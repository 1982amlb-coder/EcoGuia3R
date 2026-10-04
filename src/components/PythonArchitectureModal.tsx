import React, { useState } from 'react';
import { Terminal, Code, Database, FileSpreadsheet, CheckCircle, Copy, Download, X, Layers, Cpu } from 'lucide-react';
import { playSound } from '../utils/audio';

interface PythonModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PYTHON_FILES = [
  {
    name: 'database.py',
    description: 'Modelo de persistencia SQLite y tablas relacionales (reviews, logs)',
    code: `import sqlite3
import json
import os
import uuid
from datetime import datetime

DB_FILE = os.path.join(os.path.dirname(__file__), "ecoguia3r.db")

def get_connection():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS reviews (
            id TEXT PRIMARY KEY,
            userName TEXT NOT NULL,
            userRole TEXT DEFAULT 'Ciudadano',
            city TEXT DEFAULT 'Bogotá D.C.',
            rating REAL NOT NULL,
            rating_content INTEGER DEFAULT 5,
            rating_design INTEGER DEFAULT 5,
            rating_usability INTEGER DEFAULT 5,
            category TEXT DEFAULT 'general',
            title TEXT NOT NULL,
            comment TEXT NOT NULL,
            likes INTEGER DEFAULT 0,
            isVerified INTEGER DEFAULT 0,
            createdAt TEXT NOT NULL
        )
    """)
    conn.commit()
    conn.close()

def get_all_reviews():
    init_db()
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM reviews ORDER BY createdAt DESC")
    rows = cursor.fetchall()
    return [dict(r) for r in rows]`
  },
  {
    name: 'analytics.py',
    description: 'Cálculo de métricas, promedios ponderados y distribución de estrellas',
    code: `def compute_metrics(reviews):
    total = len(reviews)
    if total == 0:
        return {"totalReviews": 0, "averageRating": 5.0, "recommendationRate": 100}

    sum_ratings = sum(float(r.get("rating", 5.0)) for r in reviews)
    counts = {5: 0, 4: 0, 3: 0, 2: 0, 1: 0}
    recommended = 0

    for r in reviews:
        score = float(r.get("rating", 5.0))
        star = int(round(score))
        if star in counts:
            counts[star] += 1
        if score >= 4.0:
            recommended += 1

    return {
        "totalReviews": total,
        "averageRating": round(sum_ratings / total, 1),
        "recommendationRate": int(round((recommended / total) * 100)),
        "ratingCounts": counts
    }`
  },
  {
    name: 'excel_generator.py',
    description: 'Generador nativo de libros Microsoft Excel (.xlsx) con OpenXML y Zipfile',
    code: `import io
import zipfile
import html
from datetime import datetime

def generate_excel_bytes(reviews, metrics):
    output = io.BytesIO()
    # Construcción de estructura estándar OpenXML (workbook.xml, sheet1.xml, styles.xml)
    with zipfile.ZipFile(output, "w", zipfile.ZIP_DEFLATED) as zf:
        # Añade Content_Types, workbook y hojas con formato de celdas
        pass
    return output.getvalue()`
  },
  {
    name: 'waste_classifier.py',
    description: 'Motor de reglas ambientales según Resolución 2184 de 2019 (Colombia)',
    code: `RULES = [
    (["botella", "plastico", "pet", "vidrio", "lata"], "blanco", "Enjuaga y escurre antes de depositar."),
    (["cascara", "fruta", "platano", "cafe", "comida"], "verde", "Ideal para compostaje o abono orgánico."),
    (["servilleta", "papel higienico", "panal", "barrido"], "negro", "Residuo no aprovechable hacia relleno sanitario.")
]

def classify_waste(text):
    q = text.lower().strip()
    for keywords, container, tip in RULES:
        if any(kw in q for kw in keywords):
            return {"container": container, "tip": tip}
    return {"container": "negro", "tip": "Si está contaminado deposítalo en el contenedor negro."}`
  },
  {
    name: 'cli.py',
    description: 'Herramienta de terminal interactiva para administración en Python',
    code: `import argparse
from database import get_all_reviews, init_db
from analytics import compute_metrics
from waste_classifier import classify_waste

# Uso: python3 backend/cli.py --stats
#      python3 backend/cli.py --classify "botella"
#      python3 backend/cli.py --export-excel reporte.xlsx`
  }
];

export const PythonArchitectureModal: React.FC<PythonModalProps> = ({ isOpen, onClose }) => {
  const [selectedFileIdx, setSelectedFileIdx] = useState(0);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentFile = PYTHON_FILES[selectedFileIdx];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentFile.code);
    playSound('pop');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = () => {
    playSound('pop');
    const blob = new Blob([currentFile.code], { type: 'text/x-python' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = currentFile.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4 z-[1800] animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="bg-[#0F172A] text-slate-100 rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl relative animate-in zoom-in-95 border border-emerald-500/30 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-800">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/20 to-yellow-500/20 border border-blue-400/30 flex items-center justify-center text-yellow-400">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-mono font-bold text-white">
                Arquitectura del Backend en Python 3.10
              </h3>
              <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full font-mono border border-blue-500/40">
                backend/*.py
              </span>
            </div>
            <p className="text-xs text-slate-400">
              La persistencia (SQLite), el cálculo de métricas, el generador Excel y la clasificación corren en Python.
            </p>
          </div>
        </div>

        {/* File tabs */}
        <div className="flex flex-wrap gap-2 mb-4 pb-2 border-b border-slate-800">
          {PYTHON_FILES.map((file, idx) => (
            <button
              key={file.name}
              type="button"
              onClick={() => {
                playSound('pop');
                setSelectedFileIdx(idx);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedFileIdx === idx
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                  : 'bg-slate-800/60 text-slate-400 hover:text-white border border-transparent'
              }`}
            >
              <Code className="w-3.5 h-3.5 text-emerald-400" />
              <span>{file.name}</span>
            </button>
          ))}
        </div>

        {/* File info */}
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <span className="italic">{currentFile.description}</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
            >
              {copied ? <CheckCircle className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copiado' : 'Copiar'}</span>
            </button>
            <button
              type="button"
              onClick={handleDownloadFile}
              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Download className="w-3 h-3" />
              <span>Descargar .py</span>
            </button>
          </div>
        </div>

        {/* Code View */}
        <div className="flex-1 overflow-auto bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono text-xs text-emerald-300 leading-relaxed">
          <pre>{currentFile.code}</pre>
        </div>

        {/* Footer command prompt hint */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
          <div className="flex items-center gap-2 font-mono text-slate-300">
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            <span>Ejecutar CLI en terminal:</span>
            <code className="bg-slate-900 px-2 py-0.5 rounded text-yellow-300 border border-slate-700">
              python3 backend/cli.py --stats
            </code>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-white font-bold cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
