/**
 * Excel export utility for EcoGuía3R reviews and ratings database.
 * Generates formatted native .xlsx files using the xlsx library.
 */
import * as XLSX from 'xlsx';
import { ReviewComment, DbMetrics } from '../db/embeddedDb';

export const exportReviewsToExcel = (reviews: ReviewComment[], metrics?: DbMetrics) => {
  // 1. Prepare formatted data for the Reviews sheet
  const rows = reviews.map((r, index) => ({
    'N°': index + 1,
    'ID Registro': r.id,
    'Fecha': new Date(r.createdAt).toLocaleString('es-CO'),
    'Usuario': r.userName,
    'Rol': r.userRole,
    'Ciudad': r.city,
    'Calificación General (1-5)': r.rating,
    'Contenido Educativo (1-5)': r.subRatings?.content ?? r.rating,
    'Diseño e Interfaz (1-5)': r.subRatings?.design ?? r.rating,
    'Facilidad de Uso (1-5)': r.subRatings?.usability ?? r.rating,
    'Categoría': r.category.toUpperCase(),
    'Título': r.title,
    'Comentario': r.comment,
    'Votos Útiles (Me Gusta)': r.likes,
    'Verificado': r.isVerified ? 'SÍ' : 'NO',
    'Etiquetas': r.tags.join(', '),
  }));

  // Create workbook
  const wb = XLSX.utils.book_new();

  // Create worksheet from JSON
  const wsReviews = XLSX.utils.json_to_sheet(rows);

  // Set column widths for optimal reading in Excel
  wsReviews['!cols'] = [
    { wch: 6 },  // N°
    { wch: 16 }, // ID
    { wch: 20 }, // Fecha
    { wch: 22 }, // Usuario
    { wch: 18 }, // Rol
    { wch: 18 }, // Ciudad
    { wch: 24 }, // Calificación
    { wch: 24 }, // Contenido
    { wch: 24 }, // Diseño
    { wch: 24 }, // Usabilidad
    { wch: 16 }, // Categoría
    { wch: 32 }, // Título
    { wch: 50 }, // Comentario
    { wch: 22 }, // Votos
    { wch: 12 }, // Verificado
    { wch: 28 }, // Etiquetas
  ];

  XLSX.utils.book_append_sheet(wb, wsReviews, 'Opiniones y Calificaciones');

  // If metrics provided, add a second Summary sheet with stats
  if (metrics) {
    const summaryData = [
      { Métrica: 'Total de Opiniones Registradas', Valor: metrics.totalReviews },
      { Métrica: 'Calificación General Promedio', Valor: `${metrics.averageRating} / 5.0` },
      { Métrica: 'Tasa de Recomendación (% con 4 o 5 estrellas)', Valor: `${metrics.recommendationRate}%` },
      { Métrica: 'Promedio Contenido Educativo', Valor: `${metrics.subRatingAverages.content} / 5.0` },
      { Métrica: 'Promedio Diseño Visual', Valor: `${metrics.subRatingAverages.design} / 5.0` },
      { Métrica: 'Promedio Facilidad de Uso', Valor: `${metrics.subRatingAverages.usability} / 5.0` },
      { Métrica: 'Total 5 Estrellas (★★★★★)', Valor: metrics.ratingCounts[5] || 0 },
      { Métrica: 'Total 4 Estrellas (★★★★☆)', Valor: metrics.ratingCounts[4] || 0 },
      { Métrica: 'Total 3 Estrellas (★★★☆☆)', Valor: metrics.ratingCounts[3] || 0 },
      { Métrica: 'Total 2 Estrellas (★★☆☆☆)', Valor: metrics.ratingCounts[2] || 0 },
      { Métrica: 'Total 1 Estrella (★☆☆☆☆)', Valor: metrics.ratingCounts[1] || 0 },
      { Métrica: 'Fecha de Generación del Reporte', Valor: new Date().toLocaleString('es-CO') },
    ];
    const wsSummary = XLSX.utils.json_to_sheet(summaryData);
    wsSummary['!cols'] = [{ wch: 45 }, { wch: 25 }];
    XLSX.utils.book_append_sheet(wb, wsSummary, 'Resumen Estadístico');
  }

  // Trigger file download
  const dateStr = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(wb, `EcoGuia3R_Calificaciones_${dateStr}.xlsx`);
};
