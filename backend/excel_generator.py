"""
EcoGuía3R - Generador Nativo de Microsoft Excel (.xlsx) en Python Puro
Crea archivos .xlsx profesionales sin librerías externas utilizando zipfile y estructuras XML estándar de OpenXML.
"""

import io
import zipfile
import html
from datetime import datetime

def escape_xml(s):
    if s is None:
        return ""
    return html.escape(str(s))

def generate_excel_bytes(reviews, metrics):
    """
    Genera los bytes binarios de un libro de Excel (.xlsx) con 2 hojas:
    1. Reseñas Ciudadanas
    2. Resumen y Estadísticas
    """
    output = io.BytesIO()

    # Preparamos las filas de la hoja 1: Reseñas
    sheet1_rows = []
    # Encabezados
    headers = [
        "ID Registro", "Nombre Ciudadano", "Rol / Ocupación", "Ciudad",
        "Calificación General (1-5)", "Contenido", "Diseño", "Usabilidad",
        "Categoría", "Título de la Reseña", "Comentario / Opinión",
        "Votos Útiles", "Usuario Verificado", "Fecha de Registro"
    ]
    sheet1_rows.append(headers)

    for r in reviews:
        sub = r.get("subRatings", {})
        row = [
            r.get("id", ""),
            r.get("userName", ""),
            r.get("userRole", "Ciudadano"),
            r.get("city", ""),
            str(r.get("rating", 5)),
            str(sub.get("content", 5)),
            str(sub.get("design", 5)),
            str(sub.get("usability", 5)),
            r.get("category", "general"),
            r.get("title", ""),
            r.get("comment", ""),
            str(r.get("likes", 0)),
            "Sí" if r.get("isVerified") else "No",
            r.get("createdAt", "")
        ]
        sheet1_rows.append(row)

    # Preparamos las filas de la hoja 2: Métricas
    sheet2_rows = [
        ["REPORTE ESTADÍSTICO - ECOGUÍA3R COLOMBIA", ""],
        ["Fecha de Generación:", datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC")],
        ["Total Opiniones en Base de Datos:", str(metrics.get("totalReviews", len(reviews)))],
        ["Calificación Promedio:", f"{metrics.get('averageRating', 5.0)} / 5.0"],
        ["Tasa de Recomendación Positiva:", f"{metrics.get('recommendationRate', 100)}%"],
        ["", ""],
        ["DISTRIBUCIÓN DE CALIFICACIONES POR ESTRELLAS", ""],
        ["5 Estrellas (Excelente):", str(metrics.get("ratingCounts", {}).get(5, 0))],
        ["4 Estrellas (Muy Bueno):", str(metrics.get("ratingCounts", {}).get(4, 0))],
        ["3 Estrellas (Bueno):", str(metrics.get("ratingCounts", {}).get(3, 0))],
        ["2 Estrellas (Regular):", str(metrics.get("ratingCounts", {}).get(2, 0))],
        ["1 Estrella (Insuficiente):", str(metrics.get("ratingCounts", {}).get(1, 0))],
        ["", ""],
        ["PROMEDIOS POR DIMENSIÓN EVALUADA", ""],
        ["Contenido Educativo:", f"{metrics.get('subRatingAverages', {}).get('content', 5.0)} / 5.0"],
        ["Diseño & Experiencia Visual:", f"{metrics.get('subRatingAverages', {}).get('design', 5.0)} / 5.0"],
        ["Facilidad de Uso & Navegación:", f"{metrics.get('subRatingAverages', {}).get('usability', 5.0)} / 5.0"],
        ["", ""],
        ["CÓDIGO DE COLORES RESOLUCIÓN 2184 DE 2019 (COLOMBIA)", ""],
        ["Blanco:", "Residuos aprovechables (plástico, cartón, vidrio, papel, metales limpios y secos)"],
        ["Verde:", "Residuos orgánicos aprovechables (restos de comida, cáscaras, desechos agrícolas)"],
        ["Negro:", "Residuos no aprovechables (papel higiénico, servilletas usadas, papeles metalizados)"]
    ]

    # Construimos el archivo ZIP (.xlsx)
    with zipfile.ZipFile(output, "w", zipfile.ZIP_DEFLATED) as zf:
        # [Content_Types].xml
        content_types = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
  <Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
  <Override PartName="/xl/worksheets/sheet2.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
  <Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>
</Types>"""
        zf.writestr("[Content_Types].xml", content_types)

        # _rels/.rels
        rels = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>"""
        zf.writestr("_rels/.rels", rels)

        # xl/_rels/workbook.xml.rels
        wb_rels = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet2.xml"/>
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>"""
        zf.writestr("xl/_rels/workbook.xml.rels", wb_rels)

        # xl/workbook.xml
        wb_xml = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheets>
    <sheet name="Reseñas Ciudadanas" sheetId="1" r:id="rId1"/>
    <sheet name="Métricas y Normativa" sheetId="2" r:id="rId2"/>
  </sheets>
</workbook>"""
        zf.writestr("xl/workbook.xml", wb_xml)

        # xl/styles.xml
        styles_xml = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <fonts count="2">
    <font><name val="Calibri"/><sz val="11"/></font>
    <font><b/><name val="Calibri"/><sz val="11"/></font>
  </fonts>
  <fills count="2">
    <fill><patternFill patternType="none"/></fill>
    <fill><patternFill patternType="gray125"/></fill>
  </fills>
  <borders count="1">
    <border><left/><right/><top/><bottom/></border>
  </borders>
  <cellStyleXfs count="1">
    <xf numFmtId="0" fontId="0" fillId="0" borderId="0"/>
  </cellStyleXfs>
  <cellXfs count="2">
    <xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>
    <xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0"/>
  </cellXfs>
</styleSheet>"""
        zf.writestr("xl/styles.xml", styles_xml)

        # Generar XML para hoja 1
        def make_sheet_xml(rows):
            sheet_parts = ['<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
                           '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">',
                           '<sheetData>']
            for row_idx, row in enumerate(rows, start=1):
                sheet_parts.append(f'<row r="{row_idx}">')
                for col_idx, val in enumerate(row, start=1):
                    # Convertimos índice de columna a letras (1 -> A, 2 -> B...)
                    col_letter = ""
                    c = col_idx
                    while c > 0:
                        c, rem = divmod(c - 1, 26)
                        col_letter = chr(65 + rem) + col_letter
                    cell_ref = f"{col_letter}{row_idx}"
                    escaped = escape_xml(val)
                    sheet_parts.append(f'<c r="{cell_ref}" t="inlineStr"><is><t>{escaped}</t></is></c>')
                sheet_parts.append('</row>')
            sheet_parts.append('</sheetData></worksheet>')
            return "".join(sheet_parts)

        zf.writestr("xl/worksheets/sheet1.xml", make_sheet_xml(sheet1_rows))
        zf.writestr("xl/worksheets/sheet2.xml", make_sheet_xml(sheet2_rows))

    return output.getvalue()
