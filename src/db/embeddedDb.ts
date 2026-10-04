/**
 * Embedded Database for EcoGuía3R
 * Uses browser IndexedDB with automatic LocalStorage synchronization fallback.
 * Allows storing, querying, rating, and managing user comments/ratings locally on the device.
 */

export interface SubRatings {
  content: number;   // Contenido educativo (1-5)
  design: number;    // Diseño visual (1-5)
  usability: number; // Facilidad de uso (1-5)
}

export interface ReviewComment {
  id: string;
  userName: string;
  userRole: 'Ciudadano' | 'Estudiante' | 'Docente' | 'Reciclador' | 'Entusiasta Eco';
  city: string;
  rating: number; // 1 to 5
  subRatings: SubRatings;
  category: 'general' | 'contenido' | 'juego' | 'diseno' | 'sugerencia';
  title: string;
  comment: string;
  createdAt: string; // ISO date string
  likes: number;
  tags: string[];
  isVerified?: boolean;
}

export interface DbMetrics {
  totalReviews: number;
  averageRating: number;
  recommendationRate: number; // percentage
  ratingCounts: { [stars: number]: number };
  subRatingAverages: {
    content: number;
    design: number;
    usability: number;
  };
}

const DB_NAME = 'EcoGuia3R_EmbeddedDB';
const DB_VERSION = 1;
const STORE_NAME = 'reviews';
const STORAGE_FALLBACK_KEY = 'ecoguia3r_embedded_reviews_fallback_v1';

// Initial seed reviews so the site opens with realistic community feedback
const INITIAL_SEEDED_REVIEWS: ReviewComment[] = [
  {
    id: 'rev-001',
    userName: 'Carolina Morales',
    userRole: 'Docente',
    city: 'Bogotá D.C.',
    rating: 5,
    subRatings: { content: 5, design: 5, usability: 5 },
    category: 'contenido',
    title: 'Excelente herramienta didáctica para mis clases',
    comment: 'Implementé EcoGuía3R con mis alumnos de secundaria en Bogotá para enseñar la Resolución 2184 de 2019. La explicación de la bolsa verde vs. blanca es impecable y el minijuego hace que los chicos aprendan con entusiasmo.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
    likes: 18,
    tags: ['Educación', 'Resolución 2184', 'Docencia'],
    isVerified: true,
  },
  {
    id: 'rev-002',
    userName: 'Mateo Cárdenas',
    userRole: 'Estudiante',
    city: 'Medellín',
    rating: 5,
    subRatings: { content: 5, design: 4, usability: 5 },
    category: 'juego',
    title: 'El minijuego de clasificación es muy adictivo',
    comment: 'Siempre dudaba si las cajas de pizza engrasadas iban al contenedor blanco o negro. Gracias al juego y la regla de oro "Limpio, seco y separado", ahora lo tengo completamente claro.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(), // 18 hrs ago
    likes: 12,
    tags: ['Minijuego', 'Regla de Oro', 'Separación'],
    isVerified: true,
  },
  {
    id: 'rev-003',
    userName: 'Doña Gloria Inés',
    userRole: 'Reciclador',
    city: 'Cali',
    rating: 5,
    subRatings: { content: 5, design: 5, usability: 4 },
    category: 'general',
    title: 'Valora y dignifica el trabajo de los recicladores de oficio',
    comment: 'Como recicladora de oficio en Cali, agradezco que expliquen la importancia de entregar el plástico y cartón limpios y secos en la bolsa blanca. Eso protege nuestra salud y permite aprovechar de verdad el material.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 42).toISOString(), // 42 hrs ago
    likes: 29,
    tags: ['Recicladores de Oficio', 'Economía Circular', 'Comunidad'],
    isVerified: true,
  },
  {
    id: 'rev-004',
    userName: 'Santiago Vega',
    userRole: 'Ciudadano',
    city: 'Bucaramanga',
    rating: 4,
    subRatings: { content: 4, design: 5, usability: 4 },
    category: 'sugerencia',
    title: 'Muy clara y visual, excelente paleta de colores',
    comment: 'La interfaz es súper limpia y moderna. Me encantó la sección de la "Botella de Amor" y la lista de pequeñas acciones en el espacio público. Sugiero añadir más ejemplos de residuos electrónicos o posconsumo.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 70).toISOString(),
    likes: 7,
    tags: ['Diseño', 'Botella de Amor', 'Posconsumo'],
    isVerified: false,
  },
  {
    id: 'rev-005',
    userName: 'Laura Camila Restrepo',
    userRole: 'Entusiasta Eco',
    city: 'Pereira',
    rating: 5,
    subRatings: { content: 5, design: 5, usability: 5 },
    category: 'contenido',
    title: 'La guía de las 9R y los casos colombianos son geniales',
    comment: 'No conocía el emprendimiento de Coffee Kreis con la borra de café en Colombia. Es inspirador ver que el reciclaje va mucho más allá de tirar basura: es economía circular real.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 95).toISOString(),
    likes: 14,
    tags: ['9R', 'Coffee Kreis', 'Sostenibilidad'],
    isVerified: true,
  }
];

class EmbeddedDatabase {
  private db: IDBDatabase | null = null;
  private isReady = false;

  public async init(): Promise<void> {
    if (this.isReady) return;

    return new Promise((resolve) => {
      if (typeof window === 'undefined' || !window.indexedDB) {
        this.initFallbackStorage();
        this.isReady = true;
        resolve();
        return;
      }

      try {
        const request = window.indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
            store.createIndex('rating', 'rating', { unique: false });
            store.createIndex('createdAt', 'createdAt', { unique: false });
            store.createIndex('category', 'category', { unique: false });
          }
        };

        request.onsuccess = async (event) => {
          this.db = (event.target as IDBOpenDBRequest).result;
          this.isReady = true;

          // Check if store is empty; if so, populate initial seed
          const count = await this.countReviews();
          if (count === 0) {
            await this.seedInitialData();
          }
          resolve();
        };

        request.onerror = () => {
          console.warn('IndexedDB unavailable, falling back to LocalStorage');
          this.initFallbackStorage();
          this.isReady = true;
          resolve();
        };
      } catch (err) {
        console.warn('Error initializing IndexedDB:', err);
        this.initFallbackStorage();
        this.isReady = true;
        resolve();
      }
    });
  }

  private initFallbackStorage() {
    if (typeof window !== 'undefined') {
      const existing = localStorage.getItem(STORAGE_FALLBACK_KEY);
      if (!existing) {
        localStorage.setItem(STORAGE_FALLBACK_KEY, JSON.stringify(INITIAL_SEEDED_REVIEWS));
      }
    }
  }

  private async countReviews(): Promise<number> {
    if (!this.db) {
      const items = this.getFallbackReviews();
      return items.length;
    }

    return new Promise((resolve) => {
      try {
        const tx = this.db!.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.count();
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => resolve(0);
      } catch {
        resolve(0);
      }
    });
  }

  private async seedInitialData(): Promise<void> {
    for (const review of INITIAL_SEEDED_REVIEWS) {
      await this.addReview(review);
    }
  }

  private getFallbackReviews(): ReviewComment[] {
    if (typeof window === 'undefined') return INITIAL_SEEDED_REVIEWS;
    try {
      const data = localStorage.getItem(STORAGE_FALLBACK_KEY);
      return data ? JSON.parse(data) : INITIAL_SEEDED_REVIEWS;
    } catch {
      return INITIAL_SEEDED_REVIEWS;
    }
  }

  private saveFallbackReviews(reviews: ReviewComment[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_FALLBACK_KEY, JSON.stringify(reviews));
    } catch (e) {
      console.warn('Failed to save to localStorage:', e);
    }
  }

  public async getAllReviews(): Promise<ReviewComment[]> {
    await this.init();

    if (!this.db) {
      const list = this.getFallbackReviews();
      return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return new Promise((resolve) => {
      try {
        const tx = this.db!.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.getAll();

        req.onsuccess = () => {
          const results: ReviewComment[] = req.result || [];
          results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          resolve(results);
        };

        req.onerror = () => {
          resolve(this.getFallbackReviews());
        };
      } catch {
        resolve(this.getFallbackReviews());
      }
    });
  }

  public async addReview(review: ReviewComment): Promise<ReviewComment> {
    await this.init();

    // Also update fallback mirror
    const fallbackList = this.getFallbackReviews();
    const updatedFallback = [review, ...fallbackList.filter(r => r.id !== review.id)];
    this.saveFallbackReviews(updatedFallback);

    if (!this.db) {
      return review;
    }

    return new Promise((resolve, reject) => {
      try {
        const tx = this.db!.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const req = store.put(review);

        req.onsuccess = () => resolve(review);
        req.onerror = () => reject(req.error);
      } catch (err) {
        resolve(review);
      }
    });
  }

  public async likeReview(id: string): Promise<number> {
    await this.init();
    const reviews = await this.getAllReviews();
    const target = reviews.find(r => r.id === id);
    if (!target) return 0;

    target.likes += 1;
    await this.addReview(target);
    return target.likes;
  }

  public async deleteReview(id: string): Promise<boolean> {
    await this.init();

    const fallbackList = this.getFallbackReviews().filter(r => r.id !== id);
    this.saveFallbackReviews(fallbackList);

    if (!this.db) return true;

    return new Promise((resolve) => {
      try {
        const tx = this.db!.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const req = store.delete(id);
        req.onsuccess = () => resolve(true);
        req.onerror = () => resolve(false);
      } catch {
        resolve(false);
      }
    });
  }

  public async resetToDefaults(): Promise<void> {
    await this.init();

    if (this.db) {
      await new Promise<void>((resolve) => {
        try {
          const tx = this.db!.transaction(STORE_NAME, 'readwrite');
          const store = tx.objectStore(STORE_NAME);
          const req = store.clear();
          req.onsuccess = () => resolve();
          req.onerror = () => resolve();
        } catch {
          resolve();
        }
      });
    }

    this.saveFallbackReviews(INITIAL_SEEDED_REVIEWS);
    for (const r of INITIAL_SEEDED_REVIEWS) {
      await this.addReview(r);
    }
  }

  public async exportAsJson(): Promise<string> {
    const all = await this.getAllReviews();
    return JSON.stringify({
      database: DB_NAME,
      exportedAt: new Date().toISOString(),
      version: DB_VERSION,
      recordsCount: all.length,
      data: all,
    }, null, 2);
  }

  public async importFromJson(jsonString: string): Promise<number> {
    try {
      const parsed = JSON.parse(jsonString);
      const items: ReviewComment[] = Array.isArray(parsed) ? parsed : (parsed.data || []);
      if (!Array.isArray(items)) throw new Error('Formato inválido');

      let imported = 0;
      for (const item of items) {
        if (item && item.id && item.userName && item.rating) {
          await this.addReview(item);
          imported++;
        }
      }
      return imported;
    } catch (e) {
      throw new Error('Error al importar archivo JSON: ' + (e instanceof Error ? e.message : 'archivo no válido'));
    }
  }

  public computeMetrics(reviews: ReviewComment[]): DbMetrics {
    if (reviews.length === 0) {
      return {
        totalReviews: 0,
        averageRating: 5.0,
        recommendationRate: 100,
        ratingCounts: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        subRatingAverages: { content: 5, design: 5, usability: 5 },
      };
    }

    const counts: { [stars: number]: number } = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let sumRating = 0;
    let sumContent = 0;
    let sumDesign = 0;
    let sumUsability = 0;
    let recommendedCount = 0;

    for (const r of reviews) {
      const star = Math.min(5, Math.max(1, Math.round(r.rating)));
      counts[star] = (counts[star] || 0) + 1;
      sumRating += r.rating;

      if (r.rating >= 4) recommendedCount++;

      sumContent += r.subRatings?.content || r.rating;
      sumDesign += r.subRatings?.design || r.rating;
      sumUsability += r.subRatings?.usability || r.rating;
    }

    const n = reviews.length;
    return {
      totalReviews: n,
      averageRating: parseFloat((sumRating / n).toFixed(1)),
      recommendationRate: Math.round((recommendedCount / n) * 100),
      ratingCounts: counts,
      subRatingAverages: {
        content: parseFloat((sumContent / n).toFixed(1)),
        design: parseFloat((sumDesign / n).toFixed(1)),
        usability: parseFloat((sumUsability / n).toFixed(1)),
      },
    };
  }
}

export const embeddedDb = new EmbeddedDatabase();
