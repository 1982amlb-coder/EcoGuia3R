"""
EcoGuía3R - Módulo de Analítica y Estadísticas (Python)
Calcula promedios, distribución de estrellas y porcentajes de recomendación.
"""

from typing import List, Dict, Any

def compute_metrics(reviews: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Calcula todas las métricas estadísticas a partir de una lista de reseñas."""
    total = len(reviews)
    if total == 0:
        return {
            "totalReviews": 0,
            "averageRating": 5.0,
            "recommendationRate": 100,
            "ratingCounts": {5: 0, 4: 0, 3: 0, 2: 0, 1: 0},
            "subRatingAverages": {"content": 5.0, "design": 5.0, "usability": 5.0}
        }

    sum_ratings = 0.0
    sum_content = 0.0
    sum_design = 0.0
    sum_usability = 0.0
    recommended_count = 0
    counts = {5: 0, 4: 0, 3: 0, 2: 0, 1: 0}

    for r in reviews:
        score = float(r.get("rating", 5.0))
        sum_ratings += score
        
        star = int(round(score))
        if star in counts:
            counts[star] += 1

        if score >= 4.0:
            recommended_count += 1

        sub = r.get("subRatings", {})
        sum_content += float(sub.get("content", score))
        sum_design += float(sub.get("design", score))
        sum_usability += float(sub.get("usability", score))

    avg_rating = round(sum_ratings / total, 1)
    rec_rate = int(round((recommended_count / total) * 100))

    return {
        "totalReviews": total,
        "averageRating": avg_rating,
        "recommendationRate": rec_rate,
        "ratingCounts": counts,
        "subRatingAverages": {
            "content": round(sum_content / total, 1),
            "design": round(sum_design / total, 1),
            "usability": round(sum_usability / total, 1)
        }
    }
