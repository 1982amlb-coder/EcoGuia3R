"""
EcoGuía3R - Módulo de Base de Datos SQLite (Python)
Gestiona la persistencia de reseñas, calificaciones ciudadanas y registros de auditoría.
"""

import sqlite3
import json
import os
import uuid
from datetime import datetime

DB_FILE = os.path.join(os.path.dirname(__file__), "ecoguia3r.db")

DEFAULT_REVIEWS = [
    {
        "id": "rev_py_001",
        "userName": "Valentina Ospina",
        "userRole": "Estudiante",
        "city": "Medellín",
        "rating": 5.0,
        "rating_content": 5,
        "rating_design": 5,
        "rating_usability": 5,
        "category": "educacion",
        "title": "¡La mejor guía interactiva para aprender a reciclar!",
        "comment": "El mini juego de clasificación me ayudó muchísimo a memorizar el código de colores de la Resolución 2184. Ahora en mi universidad separamos correctamente los plásticos y el cartón limpio en el contenedor blanco.",
        "likes": 28,
        "isVerified": 1,
        "createdAt": "2026-03-24T14:32:00.000Z"
    },
    {
        "id": "rev_py_002",
        "userName": "Carlos Mario Restrepo",
        "userRole": "Reciclador",
        "city": "Bogotá D.C.",
        "rating": 5.0,
        "rating_content": 5,
        "rating_design": 4,
        "rating_usability": 5,
        "category": "contenedores",
        "title": "Excelente aclaración sobre entregar los reciclables limpios",
        "comment": "Como recuperador ambiental de oficio, agradezco de corazón que enfaticen que los envases deben estar enjuagados y secos en la bolsa blanca. Nos dignifica el trabajo y evita que se contamine el material aprovechable.",
        "likes": 42,
        "isVerified": 1,
        "createdAt": "2026-03-26T09:15:00.000Z"
    },
    {
        "id": "rev_py_003",
        "userName": "Dra. Lucía Mendoza",
        "userRole": "Docente",
        "city": "Cali",
        "rating": 5.0,
        "rating_content": 5,
        "rating_design": 5,
        "rating_usability": 5,
        "category": "normativa",
        "title": "Material pedagógico de alta calidad para colegios y familias",
        "comment": "Implementé los pasos de la Guía de Economía Circular y la calculadora de impacto con mis alumnos de secundaria. Es visual, rigurosa y fundamentada en la normativa ambiental colombiana.",
        "likes": 35,
        "isVerified": 1,
        "createdAt": "2026-03-28T16:45:00.000Z"
    },
    {
        "id": "rev_py_004",
        "userName": "Andrés Felipe Gómez",
        "userRole": "Ciudadano",
        "city": "Barranquilla",
        "rating": 4.0,
        "rating_content": 4,
        "rating_design": 5,
        "rating_usability": 4,
        "category": "general",
        "title": "Muy completa y fácil de usar en el celular",
        "comment": "Tenía dudas constantes con las servilletas sucias y el icopor. Ahora sé que las servilletas van al negro y el icopor limpio puede ir al blanco si está seco.",
        "likes": 19,
        "isVerified": 1,
        "createdAt": "2026-03-30T11:20:00.000Z"
    },
    {
        "id": "rev_py_005",
        "userName": "Mariana Cardona",
        "userRole": "Entusiasta Eco",
        "city": "Bucaramanga",
        "rating": 5.0,
        "rating_content": 5,
        "rating_design": 5,
        "rating_usability": 5,
        "category": "calculadora",
        "title": "La calculadora de impacto te abre los ojos",
        "comment": "Ver cuánta agua y cuántas emisiones de CO2 se ahorran al reciclar 10 botellas o latas al mes motiva muchísimo a crear el hábito en el hogar.",
        "likes": 24,
        "isVerified": 1,
        "createdAt": "2026-04-01T18:05:00.000Z"
    },
    {
        "id": "rev_py_006",
        "userName": "Ing. Fernando Morales",
        "userRole": "Gestor Ambiental",
        "city": "Cartagena",
        "rating": 5.0,
        "rating_content": 5,
        "rating_design": 5,
        "rating_usability": 5,
        "category": "normativa",
        "title": "Alineada 100% con la Resolución 2184 de 2019",
        "comment": "La explicación de los tres contenedores (Blanco, Verde y Negro) es impecable. El modelo de exportación a Excel y la base de datos embebida permiten un control estadístico transparente.",
        "likes": 31,
        "isVerified": 1,
        "createdAt": "2026-04-03T10:10:00.000Z"
    }
]

def get_connection():
    """Retorna una conexión a la base de datos SQLite."""
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Inicializa las tablas en SQLite y crea los registros por defecto si está vacía."""
    conn = get_connection()
    cursor = conn.cursor()

    # Tabla de reseñas / calificaciones
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

    # Tabla de descargas y auditoría de seguridad
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS download_audit_logs (
            id TEXT PRIMARY KEY,
            profile_name TEXT NOT NULL,
            download_format TEXT NOT NULL,
            total_records INTEGER NOT NULL,
            timestamp TEXT NOT NULL,
            status TEXT NOT NULL
        )
    """)

    # Verificar si existen registros
    cursor.execute("SELECT COUNT(*) as count FROM reviews")
    row = cursor.fetchone()
    if row["count"] == 0:
        for r in DEFAULT_REVIEWS:
            cursor.execute("""
                INSERT INTO reviews (
                    id, userName, userRole, city, rating,
                    rating_content, rating_design, rating_usability,
                    category, title, comment, likes, isVerified, createdAt
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                r["id"], r["userName"], r["userRole"], r["city"], r["rating"],
                r["rating_content"], r["rating_design"], r["rating_usability"],
                r["category"], r["title"], r["comment"], r["likes"], r["isVerified"], r["createdAt"]
            ))

    conn.commit()
    conn.close()

def get_all_reviews():
    """Retorna la lista de todas las reseñas ordenadas por fecha."""
    init_db()
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM reviews ORDER BY createdAt DESC")
    rows = cursor.fetchall()
    
    reviews = []
    for r in rows:
        reviews.append({
            "id": r["id"],
            "userName": r["userName"],
            "userRole": r["userRole"],
            "city": r["city"],
            "rating": float(r["rating"]),
            "subRatings": {
                "content": int(r["rating_content"]),
                "design": int(r["rating_design"]),
                "usability": int(r["rating_usability"])
            },
            "category": r["category"],
            "title": r["title"],
            "comment": r["comment"],
            "likes": int(r["likes"]),
            "isVerified": bool(r["isVerified"]),
            "createdAt": r["createdAt"]
        })
    conn.close()
    return reviews

def add_review(data):
    """Inserta una nueva reseña en la base de datos SQLite."""
    init_db()
    conn = get_connection()
    cursor = conn.cursor()

    review_id = f"rev_{uuid.uuid4().hex[:8]}"
    created_at = datetime.utcnow().isoformat() + "Z"
    
    sub = data.get("subRatings", {})
    
    cursor.execute("""
        INSERT INTO reviews (
            id, userName, userRole, city, rating,
            rating_content, rating_design, rating_usability,
            category, title, comment, likes, isVerified, createdAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        review_id,
        data.get("userName", "Anónimo"),
        data.get("userRole", "Ciudadano"),
        data.get("city", "Bogotá D.C."),
        float(data.get("rating", 5.0)),
        int(sub.get("content", 5)),
        int(sub.get("design", 5)),
        int(sub.get("usability", 5)),
        data.get("category", "general"),
        data.get("title", "Opinión"),
        data.get("comment", ""),
        0,
        1 if data.get("isVerified") else 0,
        created_at
    ))

    conn.commit()
    conn.close()
    return review_id

def log_download(profile_name, fmt, count):
    """Registra una descarga en la tabla de auditoría SQLite."""
    init_db()
    conn = get_connection()
    cursor = conn.cursor()
    log_id = f"log_{uuid.uuid4().hex[:8]}"
    cursor.execute("""
        INSERT INTO download_audit_logs (id, profile_name, download_format, total_records, timestamp, status)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (log_id, profile_name, fmt, count, datetime.utcnow().isoformat() + "Z", "EXITOSO"))
    conn.commit()
    conn.close()

if __name__ == "__main__":
    init_db()
    print("Base de datos SQLite de EcoGuía3R inicializada con éxito en:", DB_FILE)
