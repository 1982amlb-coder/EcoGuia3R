#!/usr/bin/env python3
"""
EcoGuía3R - Interfaz de Línea de Comandos (CLI en Python)
Herramienta de terminal para gestionar reseñas, consultar estadísticas, clasificar residuos y exportar a Excel.
"""

import sys
import os
import argparse

sys.path.append(os.path.dirname(__file__))
from database import init_db, get_all_reviews, add_review
from analytics import compute_metrics
from excel_generator import generate_excel_bytes
from waste_classifier import classify_waste, calculate_impact

def main():
    parser = argparse.ArgumentParser(description="EcoGuía3R - CLI Administrativa en Python")
    parser.add_argument("--stats", action="store_true", help="Muestra las estadísticas y métricas del foro")
    parser.add_argument("--list", action="store_true", help="Lista todas las reseñas registradas en SQLite")
    parser.add_argument("--classify", type=str, help="Clasifica un residuo según la Resolución 2184")
    parser.add_argument("--export-excel", type=str, help="Genera y guarda el archivo Excel (.xlsx) en la ruta indicada")
    parser.add_argument("--impact", nargs=3, type=float, metavar=('PLASTICO_KG', 'PAPEL_KG', 'VIDRIO_KG'), help="Calcula el impacto ambiental")

    args = parser.parse_args()
    init_db()

    if args.stats:
        reviews = get_all_reviews()
        metrics = compute_metrics(reviews)
        print("=" * 60)
        print("  📊 ECOGUÍA3R - MÉTRICAS EN BASE DE DATOS (PYTHON SQLite)")
        print("=" * 60)
        print(f"Total Reseñas:            {metrics['totalReviews']}")
        print(f"Calificación Promedio:    {metrics['averageRating']} / 5.0")
        print(f"Tasa de Recomendación:    {metrics['recommendationRate']}%")
        print("\nDistribución de estrellas:")
        for star, count in sorted(metrics['ratingCounts'].items(), reverse=True):
            bar = "★" * star + " " + "█" * count
            print(f"  {star} estrellas: {count} {bar}")
        print("\nPromedios por dimensión:")
        print(f"  Contenido:  {metrics['subRatingAverages']['content']} / 5.0")
        print(f"  Diseño:     {metrics['subRatingAverages']['design']} / 5.0")
        print(f"  Usabilidad: {metrics['subRatingAverages']['usability']} / 5.0")
        print("=" * 60)

    elif args.list:
        reviews = get_all_reviews()
        print(f"--- LISTADO DE RESEÑAS ({len(reviews)} registros) ---")
        for r in reviews:
            stars = "★" * int(round(r['rating']))
            print(f"[{r['id']}] {r['userName']} ({r['city']}) - {stars} ({r['rating']})")
            print(f"   Título: {r['title']}")
            print(f"   Comentario: {r['comment']}")
            print("-" * 50)

    elif args.classify:
        result = classify_waste(args.classify)
        print("=" * 60)
        print(f"  ♻️ CLASIFICACIÓN DE RESIDUO: '{args.classify}'")
        print("=" * 60)
        print(f"Contenedor:  {result['container_info']['nombre']}")
        print(f"Color:       {result['container_info']['color_hex']}")
        print(f"Detalle:     {result['container_info']['descripcion']}")
        print(f"Consejo 3R:  {result['tip']}")
        print("=" * 60)

    elif args.export_excel:
        reviews = get_all_reviews()
        metrics = compute_metrics(reviews)
        data = generate_excel_bytes(reviews, metrics)
        filename = args.export_excel
        if not filename.endswith(".xlsx"):
            filename += ".xlsx"
        with open(filename, "wb") as f:
            f.write(data)
        print(f"✅ Archivo Excel exportado con éxito en: {filename} ({len(data)} bytes)")

    elif args.impact:
        p, pa, v = args.impact
        res = calculate_impact(p, pa, v)
        print("=" * 60)
        print(f"  🌱 IMPACTO AMBIENTAL CALCULADO (Python Engine)")
        print("=" * 60)
        print(f"Plástico: {p} kg | Papel/Cartón: {pa} kg | Vidrio: {v} kg")
        print(f"Ahorro de CO2:          {res['co2_saved_kg']} kg CO2 equiv.")
        print(f"Ahorro de Agua:         {res['water_saved_liters']} Litros")
        print(f"Árboles salvados:       {res['trees_saved']}")
        print(f"Energía ahorrada:       {res['kwh_saved']} kWh")
        print("=" * 60)

    else:
        parser.print_help()

if __name__ == "__main__":
    main()
