import express from 'express';
import { createServer as createViteServer } from 'vite';
import { execFile } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = 3000;

app.use(express.json());

// Helper para ejecutar las acciones del motor en Python
function runPython(action: string, payload: string = ''): Promise<string> {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, 'backend/app.py');
    execFile('python3', [scriptPath, `--action=${action}`, payload], (error, stdout, stderr) => {
      if (error) {
        console.error('Python execution error:', stderr || error.message);
        reject(error);
      } else {
        resolve(stdout);
      }
    });
  });
}

// API Routes delegadas 100% al motor en Python
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', engine: 'Python 3.10', backend: 'SQLite' });
});

app.get('/api/reviews', async (req, res) => {
  try {
    const output = await runPython('get_reviews');
    res.json(JSON.parse(output));
  } catch (err) {
    res.status(500).json({ error: 'Error ejecutando motor Python' });
  }
});

app.post('/api/reviews', async (req, res) => {
  try {
    const output = await runPython('add_review', JSON.stringify(req.body));
    res.json(JSON.parse(output));
  } catch (err) {
    res.status(500).json({ error: 'Error guardando en SQLite con Python' });
  }
});

app.post('/api/auth', async (req, res) => {
  try {
    const output = await runPython('verify_auth', req.body?.password || '');
    res.json(JSON.parse(output));
  } catch (err) {
    res.status(500).json({ error: 'Error de verificación de clave en Python' });
  }
});

app.get('/api/export-excel', async (req, res) => {
  try {
    const output = await runPython('export_excel_base64');
    const parsed = JSON.parse(output);
    const buffer = Buffer.from(parsed.base64, 'base64');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="ecoguia3r_reporte_python.xlsx"');
    res.send(buffer);
  } catch (err) {
    res.status(500).json({ error: 'Error generando Excel con Python' });
  }
});

app.post('/api/classify', async (req, res) => {
  try {
    const output = await runPython('classify', req.body?.text || '');
    res.json(JSON.parse(output));
  } catch (err) {
    res.status(500).json({ error: 'Error clasificando con motor Python' });
  }
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist/index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor EcoGuía3R con backend Python corriendo en http://0.0.0.0:${PORT}`);
  });
}

startServer();
