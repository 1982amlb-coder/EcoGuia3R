"""
EcoGuía3R - Motor de Clasificación de Residuos en Python
Alineado con el Código de Colores de la Resolución 2184 de 2019 del Ministerio de Ambiente de Colombia.
"""

from typing import Dict, Any, List

CONTAINERS = {
    "blanco": {
        "nombre": "Contenedor Blanco (Aprovechables Limpios)",
        "color_hex": "#2563EB",
        "descripcion": "Plástico, vidrio, metales, papel y cartón limpios y secos.",
        "ejemplos": ["Botellas plásticas", "Cajas de cartón", "Frascos de vidrio", "Latas de atún limpias", "Hojas de papel"]
    },
    "verde": {
        "nombre": "Contenedor Verde (Orgánicos Aprovechables)",
        "color_hex": "#16A34A",
        "descripcion": "Restos de comida cruda o cocinada, cáscaras, restos de podas y jardinería.",
        "ejemplos": ["Cáscaras de frutas", "Restos de café", "Cáscaras de huevo", "Hojas secas", "Restos de verduras"]
    },
    "negro": {
        "nombre": "Contenedor Negro (No Aprovechables)",
        "color_hex": "#1F2937",
        "descripcion": "Papel higiénico, servilletas usadas, papeles y cartones contaminados con comida, papeles metalizados.",
        "ejemplos": ["Papel higiénico", "Servilletas sucias", "Pañales", "Empaques metalizados de papas", "Huesos cocinados grasosos"]
    }
}

RULES = [
    (["botella", "plastico", "pet", "tapa", "envase limpio", "vaso desechable limpio"], "blanco", "Enjuaga y escurre la botella antes de depositarla. Retira la etiqueta si es posible."),
    (["carton", "caja", "papel", "periodico", "revista", "archivo", "hoja"], "blanco", "Asegúrate de que no esté mojado ni con restos de grasa o aceite."),
    (["vidrio", "frasco", "botella de vino", "cristal"], "blanco", "Lávalo y no quiebres el envase para seguridad de los recicladores de oficio."),
    (["lata", "aluminio", "atun", "gaseosa", "cerveza", "aerosol vacio"], "blanco", "Enjuaga y aplasta la lata para optimizar espacio en el contenedor."),
    (["cascara", "fruta", "platano", "manzana", "cafe", "borra", "huevo", "verdura", "pasto", "hoja seca", "comida cruda"], "verde", "Ideal para compostaje o abono orgánico domiciliario."),
    (["servilleta", "papel higienico", "panal", "toalla higienica", "cubrebocas", "tapabocas", "chicle", "barrido", "colilla"], "negro", "Residuo no reciclable; irá al relleno sanitario (Doña Juana / Praderas del Huila, etc.)."),
    (["icopor sucio", "paquete de papas", "metalizado", "tetra pak sucio", "papel engrasado", "pizza"], "negro", "Si tiene grasa o restos pegados de alimentos no se puede reciclar; va al negro.")
]

def classify_waste(text: str) -> Dict[str, Any]:
    """Clasifica un residuo ingresado en texto según las reglas de la Resolución 2184."""
    query = text.lower().strip()
    
    for keywords, container, tip in RULES:
        for kw in keywords:
            if kw in query:
                return {
                    "matched": True,
                    "keyword": kw,
                    "container": container,
                    "container_info": CONTAINERS[container],
                    "tip": tip
                }

    # Si no hay coincidencia exacta
    return {
        "matched": False,
        "keyword": None,
        "container": "negro",
        "container_info": CONTAINERS["negro"],
        "tip": "Ante la duda, si está sucio o contaminado con alimentos o fluidos, deposítalo en la caneca negra para no contaminar los reciclables."
    }

def calculate_impact(plastic_kg: float, paper_kg: float, glass_kg: float) -> Dict[str, Any]:
    """Calcula el impacto ambiental en ahorro de agua, CO2 y energía en Python."""
    co2_saved = round(plastic_kg * 1.5 + paper_kg * 0.9 + glass_kg * 0.3, 2)
    water_saved_liters = round(plastic_kg * 25 + paper_kg * 26 + glass_kg * 5, 1)
    trees_saved = round(paper_kg * 0.017, 3)
    kwh_saved = round(plastic_kg * 5.7 + paper_kg * 4.0 + glass_kg * 1.2, 1)

    return {
        "co2_saved_kg": co2_saved,
        "water_saved_liters": water_saved_liters,
        "trees_saved": trees_saved,
        "kwh_saved": kwh_saved
    }
