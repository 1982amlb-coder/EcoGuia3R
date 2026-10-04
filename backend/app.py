"""
EcoGuía3R - Servidor API y Controlador Principal en Python
Proporciona endpoints REST y ejecutor CLI para interactuar con la base de datos SQLite,
el generador de Excel y el clasificador ambiental.
"""

import sys
import json
import base64
import os
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs

# Importamos módulos locales
sys.path.append(os.path.dirname(__file__))
from database import init_db, get_all_reviews, add_review, log_download
from analytics import compute_metrics
from excel_generator import generate_excel_bytes
from waste_classifier import classify_waste, calculate_impact

AUTH_PASSWORDS = ["eco2026", "admin", "admin123", "reciclaje2026"]

class EcoGuiaAPIHandler(BaseHTTPRequestHandler):
    def _set_headers(self, status=200, content_type="application/json"):
        self.send_response(status)
        self.send_header("Content-Type", content_type)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        self.end_headers()

    def do_OPTIONS(self):
        self._set_headers(200)

    def do_GET(self):
        parsed = urlparse(self.path)
        path = parsed.path

        if path == "/api/health":
            self._set_headers(200)
            self.wfile.write(json.dumps({"status": "ok", "runtime": "Python 3.10", "engine": "EcoGuía3R SQLite"}).encode("utf-8"))

        elif path == "/api/reviews":
            reviews = get_all_reviews()
            metrics = compute_metrics(reviews)
            self._set_headers(200)
            self.wfile.write(json.dumps({"reviews": reviews, "metrics": metrics}).encode("utf-8"))

        elif path == "/api/export-excel":
            reviews = get_all_reviews()
            metrics = compute_metrics(reviews)
            log_download("Administrador Perfiles", "XLSX", len(reviews))
            excel_data = generate_excel_bytes(reviews, metrics)
            
            self.send_response(200)
            self.send_header("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
            self.send_header("Content-Disposition", 'attachment; filename="ecoguia3r_reporte_python.xlsx"')
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(excel_data)

        else:
            self._set_headers(404)
            self.wfile.write(json.dumps({"error": "Ruta no encontrada"}).encode("utf-8"))

    def do_POST(self):
        parsed = urlparse(self.path)
        path = parsed.path

        content_length = int(self.headers.get("Content-Length", 0))
        body_bytes = self.rfile.read(content_length)
        
        try:
            body = json.loads(body_bytes.decode("utf-8")) if body_bytes else {}
        except Exception:
            body = {}

        if path == "/api/reviews":
            new_id = add_review(body)
            reviews = get_all_reviews()
            metrics = compute_metrics(reviews)
            self._set_headers(201)
            self.wfile.write(json.dumps({
                "success": True,
                "id": new_id,
                "metrics": metrics
            }).encode("utf-8"))

        elif path == "/api/auth":
            pwd = body.get("password", "").strip().lower()
            if pwd in AUTH_PASSWORDS:
                self._set_headers(200)
                self.wfile.write(json.dumps({"authorized": True, "role": "Administrador de Base de Datos"}).encode("utf-8"))
            else:
                self._set_headers(401)
                self.wfile.write(json.dumps({"authorized": False, "error": "Contraseña inválida"}).encode("utf-8"))

        elif path == "/api/classify":
            waste_name = body.get("text", "")
            result = classify_waste(waste_name)
            self._set_headers(200)
            self.wfile.write(json.dumps(result).encode("utf-8"))

        else:
            self._set_headers(404)
            self.wfile.write(json.dumps({"error": "Ruta no encontrada"}).encode("utf-8"))

# Modo CLI / Subproceso para integración directa
def run_cli_action(action, payload=None):
    init_db()
    if action == "get_reviews":
        reviews = get_all_reviews()
        metrics = compute_metrics(reviews)
        print(json.dumps({"reviews": reviews, "metrics": metrics}))
    elif action == "add_review":
        data = json.loads(payload) if payload else {}
        new_id = add_review(data)
        reviews = get_all_reviews()
        metrics = compute_metrics(reviews)
        print(json.dumps({"success": True, "id": new_id, "metrics": metrics}))
    elif action == "export_excel_base64":
        reviews = get_all_reviews()
        metrics = compute_metrics(reviews)
        log_download("Administrador Perfiles", "XLSX", len(reviews))
        excel_bytes = generate_excel_bytes(reviews, metrics)
        b64 = base64.b64encode(excel_bytes).decode("ascii")
        print(json.dumps({"success": True, "base64": b64, "filename": "ecoguia3r_reporte_python.xlsx"}))
    elif action == "verify_auth":
        pwd = (payload or "").strip().lower()
        is_ok = pwd in AUTH_PASSWORDS
        print(json.dumps({"authorized": is_ok}))
    elif action == "classify":
        res = classify_waste(payload or "")
        print(json.dumps(res))
    else:
        print(json.dumps({"error": f"Acción desconocida: {action}"}))

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1].startswith("--action="):
        action = sys.argv[1].split("=", 1)[1]
        payload = sys.argv[2] if len(sys.argv) > 2 else ""
        run_cli_action(action, payload)
    elif len(sys.argv) > 1 and sys.argv[1] == "--serve":
        port = int(sys.argv[2]) if len(sys.argv) > 2 else 5001
        init_db()
        server = HTTPServer(("0.0.0.0", port), EcoGuiaAPIHandler)
        print(f"Servidor Python EcoGuía3R escuchando en el puerto {port}...")
        server.serve_forever()
    else:
        init_db()
        print("Módulo Python EcoGuía3R listo. Ejecuta con --serve o --action=<accion>")
