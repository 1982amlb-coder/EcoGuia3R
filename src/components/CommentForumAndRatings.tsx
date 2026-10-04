import React, { useState, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { ReviewComment, DbMetrics, embeddedDb } from '../db/embeddedDb';
import {
  Star,
  MessageSquare,
  ThumbsUp,
  Database,
  Filter,
  Search,
  Sparkles,
  Download,
  Upload,
  RefreshCw,
  Trash2,
  CheckCircle,
  Award,
  Send,
  MapPin,
  Calendar,
  Layers,
  ChevronDown,
  FileSpreadsheet,
  Lock,
  ArrowLeft,
  Eye,
  EyeOff,
  KeyRound,
  AlertCircle,
  User,
  Users
} from 'lucide-react';
import { playSound } from '../utils/audio';
import { exportReviewsToExcel } from '../utils/excelExport';

interface CommentForumProps {
  reviews: ReviewComment[];
  metrics: DbMetrics;
  onReviewsChange: () => void;
  isDbModalOpen: boolean;
  setIsDbModalOpen: (open: boolean) => void;
  onOpenProfileModal?: () => void;
  isAdmin?: boolean;
}

const COLOMBIAN_CITIES = [
  'Bogotá D.C.',
  'Medellín',
  'Cali',
  'Barranquilla',
  'Cartagena',
  'Bucaramanga',
  'Pereira',
  'Manizales',
  'Santa Marta',
  'Cúcuta',
  'Ibagué',
  'Villavicencio',
  'Pasto',
  'Armenia',
  'Otra ciudad'
];

export const CommentForumAndRatings: React.FC<CommentForumProps> = ({
  reviews,
  metrics,
  onReviewsChange,
  isDbModalOpen,
  setIsDbModalOpen,
  onOpenProfileModal,
  isAdmin,
}) => {
  // Form state
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState<ReviewComment['userRole']>('Ciudadano');
  const [city, setCity] = useState('Bogotá D.C.');
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [contentSubRating, setContentSubRating] = useState<number>(5);
  const [designSubRating, setDesignSubRating] = useState<number>(5);
  const [usabilitySubRating, setUsabilitySubRating] = useState<number>(5);
  const [category, setCategory] = useState<ReviewComment['category']>('general');
  const [title, setTitle] = useState('');
  const [commentText, setCommentText] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Filters & sorting state
  const [selectedStarFilter, setSelectedStarFilter] = useState<number | null>(null);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('todos');
  const [searchFilter, setSearchFilter] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'highest' | 'lowest' | 'likes'>('newest');

  // JSON modal state
  const [rawJsonText, setRawJsonText] = useState('');

  // Rating labels
  const ratingLabels: { [key: number]: string } = {
    1: 'Insuficiente · Debe mejorar',
    2: 'Regular · Requiere ajustes',
    3: 'Bueno · Aceptable',
    4: 'Muy Bueno · Gran aporte',
    5: '¡Excelente! · Sobresaliente',
  };

  const handleStarSelect = (star: number) => {
    playSound('star');
    setRating(star);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !commentText.trim()) return;

    playSound('submit');

    const newReview: ReviewComment = {
      id: `rev-${Date.now()}`,
      userName: userName.trim(),
      userRole,
      city,
      rating,
      subRatings: {
        content: contentSubRating,
        design: designSubRating,
        usability: usabilitySubRating,
      },
      category,
      title: title.trim() || 'Comentario sobre EcoGuía3R',
      comment: commentText.trim(),
      createdAt: new Date().toISOString(),
      likes: 0,
      tags: [
        category === 'contenido' ? 'Educación' : category === 'juego' ? 'Minijuego' : 'Comunidad',
        userRole,
        city.split(' ')[0],
      ],
      isVerified,
    };

    await embeddedDb.addReview(newReview);
    onReviewsChange();

    // Celebration
    try {
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#4CAF50', '#81C784', '#F5A623', '#4A90E2'],
      });
    } catch {
      // ignore
    }

    setFormSuccess(true);
    setUserName('');
    setTitle('');
    setCommentText('');

    setTimeout(() => {
      setFormSuccess(false);
      setShowForm(false);
    }, 2800);
  };

  const handleLike = async (id: string) => {
    playSound('pop');
    await embeddedDb.likeReview(id);
    onReviewsChange();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Deseas eliminar este comentario de la base de datos embebida?')) {
      playSound('wrong');
      await embeddedDb.deleteReview(id);
      onReviewsChange();
    }
  };

  const handleResetDb = async () => {
    if (window.confirm('¿Restablecer la base de datos a los comentarios iniciales de muestra?')) {
      playSound('pop');
      await embeddedDb.resetToDefaults();
      onReviewsChange();
      setIsDbModalOpen(false);
    }
  };

  const handleExportJson = async () => {
    playSound('pop');
    const json = await embeddedDb.exportAsJson();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ecoguia3r_embedded_database_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportExcel = () => {
    playSound('pop');
    exportReviewsToExcel(reviews, metrics);
  };

  // Password protected download state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [pendingDownloadAction, setPendingDownloadAction] = useState<'excel' | 'db_inspector' | 'json' | null>(null);
  const [downloadPasswordInput, setDownloadPasswordInput] = useState('');
  const [showDownloadPassword, setShowDownloadPassword] = useState(false);
  const [downloadAuthError, setDownloadAuthError] = useState('');
  const [isDownloadAuthorized, setIsDownloadAuthorized] = useState(() => {
    return typeof window !== 'undefined' && sessionStorage.getItem('ecoguia3r_dl_auth') === 'true';
  });

  const VALID_DOWNLOAD_PASSWORDS = ['eco2026', 'admin', 'admin123', 'reciclaje2026'];

  const executeDownloadAction = (action: 'excel' | 'db_inspector' | 'json') => {
    if (action === 'excel') {
      handleExportExcel();
    } else if (action === 'db_inspector') {
      openInspector();
    } else if (action === 'json') {
      handleExportJson();
    }
  };

  const handleProtectedAction = (action: 'excel' | 'db_inspector' | 'json') => {
    playSound('pop');
    if (isDownloadAuthorized) {
      executeDownloadAction(action);
    } else {
      setPendingDownloadAction(action);
      setDownloadPasswordInput('');
      setDownloadAuthError('');
      setIsAuthModalOpen(true);
    }
  };

  const handleVerifyDownloadPassword = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPass = downloadPasswordInput.trim().toLowerCase();

    if (VALID_DOWNLOAD_PASSWORDS.includes(cleanPass)) {
      playSound('correct');
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#107C41', '#4CAF50', '#81C784', '#CFEF9D'],
        });
      } catch {
        // ignore
      }
      setIsDownloadAuthorized(true);
      sessionStorage.setItem('ecoguia3r_dl_auth', 'true');
      setIsAuthModalOpen(false);
      setDownloadAuthError('');
      if (pendingDownloadAction) {
        executeDownloadAction(pendingDownloadAction);
        setPendingDownloadAction(null);
      }
    } else {
      playSound('wrong');
      setDownloadAuthError('Contraseña incorrecta. Por favor intenta de nuevo.');
    }
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const count = await embeddedDb.importFromJson(text);
      playSound('correct');
      alert(`¡Se importaron con éxito ${count} registros en la base de datos embebida!`);
      onReviewsChange();
      setIsDbModalOpen(false);
    } catch (err) {
      alert('Error importando JSON: ' + (err instanceof Error ? err.message : 'archivo no válido'));
    }
  };

  const openInspector = async () => {
    const json = await embeddedDb.exportAsJson();
    setRawJsonText(json);
    setIsDbModalOpen(true);
  };

  // Filtered & sorted reviews list
  const filteredReviews = useMemo(() => {
    return reviews
      .filter((r) => {
        if (selectedStarFilter !== null && Math.round(r.rating) !== selectedStarFilter) {
          return false;
        }
        if (selectedCategoryFilter !== 'todos' && r.category !== selectedCategoryFilter) {
          return false;
        }
        if (searchFilter.trim()) {
          const q = searchFilter.toLowerCase();
          const matchName = r.userName.toLowerCase().includes(q);
          const matchComment = r.comment.toLowerCase().includes(q);
          const matchTitle = r.title.toLowerCase().includes(q);
          const matchCity = r.city.toLowerCase().includes(q);
          const matchTags = r.tags.some(t => t.toLowerCase().includes(q));
          return matchName || matchComment || matchTitle || matchCity || matchTags;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortBy === 'highest') {
          return b.rating - a.rating;
        }
        if (sortBy === 'lowest') {
          return a.rating - b.rating;
        }
        if (sortBy === 'likes') {
          return b.likes - a.likes;
        }
        return 0;
      });
  }, [reviews, selectedStarFilter, selectedCategoryFilter, searchFilter, sortBy]);

  return (
    <section className="max-w-[1240px] mx-auto px-4 sm:px-6 py-16 lg:py-24" id="foro">
      
      {/* Section Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F5E9] border border-[#81C784]/50 text-[#2E7D32] text-xs font-bold uppercase tracking-wider mb-2">
            <Database className="w-3.5 h-3.5" />
            <span>Almacenamiento Local Embebido · IndexedDB</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1F2E24] tracking-tight">
            Foro Comunitario y Calificación del Sitio
          </h2>
          <p className="text-[#4A5A4E] text-base mt-2 leading-relaxed">
            Califica la utilidad de EcoGuía3R, comparte tus comentarios y aprende de las experiencias de reciclaje 
            de otros ciudadanos. Toda la información se guarda de forma persistente en la{' '}
            <strong className="text-[#174D32]">base de datos embebida en tu navegador</strong>.
          </p>
        </div>

        {/* Action Header Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onOpenProfileModal || (() => handleProtectedAction('excel'))}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#107C41] hover:bg-[#0B5A2F] text-white text-xs font-bold shadow-xs hover:shadow-md transition-all cursor-pointer"
            title="Descargar todas las opiniones y calificaciones en formato Microsoft Excel (.xlsx) - Requiere contraseña en Perfiles"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Descargar en Excel</span>
            <Lock className="w-3 h-3 text-[#CFEF9D]" />
          </button>

          <button
            type="button"
            onClick={onOpenProfileModal || (() => handleProtectedAction('db_inspector'))}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white hover:bg-emerald-50 text-[#174D32] border border-[#C5DDCB] text-xs font-bold shadow-xs hover:shadow-md transition-all cursor-pointer"
            title="Apartado de Perfiles y Descarga de Base de Datos"
          >
            <Users className="w-4 h-4 text-[#2E7D32]" />
            <span>Perfiles</span>
            {isAdmin && (
              <span className="bg-[#E8F5E9] text-[#2E7D32] text-[10px] px-2 py-0.5 rounded-full font-black">
                Activo
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              playSound('pop');
              setShowForm(!showForm);
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#4CAF50] hover:bg-[#2E7D32] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            <Star className="w-4 h-4 fill-white" />
            <span>{showForm ? 'Cerrar formulario' : 'Escribir reseña / Calificar'}</span>
          </button>
        </div>
      </div>

      {/* Main Metrics Dashboard Box */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#C5DDCB] shadow-xl mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Overall Rating (4 cols) */}
          <div className="lg:col-span-4 text-center lg:text-left border-b lg:border-b-0 lg:border-r border-gray-100 pb-6 lg:pb-0 lg:pr-8">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Calificación Promedio
            </span>
            <div className="flex items-center justify-center lg:justify-start gap-3 my-2">
              <span className="text-6xl font-serif font-black text-[#123D2A]">
                {metrics.averageRating}
              </span>
              <div>
                <div className="flex text-amber-400 text-xl">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-5 h-5 ${
                        s <= Math.round(metrics.averageRating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-gray-200 fill-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-500 font-semibold block mt-1">
                  Basado en {metrics.totalReviews} opiniones
                </span>
              </div>
            </div>

            <div className="mt-4 p-3 bg-[#F4FBF5] rounded-2xl border border-[#C5DDCB]/60 inline-flex items-center gap-2 text-xs text-[#2E7D32] font-bold">
              <Sparkles className="w-4 h-4 text-[#4CAF50]" />
              <span>{metrics.recommendationRate}% de los usuarios recomiendan EcoGuía3R</span>
            </div>
          </div>

          {/* Star Distribution Bars (5 cols) */}
          <div className="lg:col-span-5 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-2">
              Distribución de Estrellas (Haz clic para filtrar)
            </span>

            {[5, 4, 3, 2, 1].map((stars) => {
              const count = metrics.ratingCounts[stars] || 0;
              const percent = metrics.totalReviews > 0 ? (count / metrics.totalReviews) * 100 : 0;
              const isSelected = selectedStarFilter === stars;

              return (
                <button
                  key={stars}
                  type="button"
                  onClick={() => {
                    playSound('pop');
                    setSelectedStarFilter(isSelected ? null : stars);
                  }}
                  className={`w-full flex items-center gap-3 p-1.5 rounded-xl transition-all text-xs font-medium ${
                    isSelected ? 'bg-emerald-50 ring-2 ring-emerald-500' : 'hover:bg-gray-50'
                  }`}
                >
                  <span className="w-8 text-right font-bold text-gray-700 flex items-center justify-end gap-1">
                    {stars} <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  </span>

                  <div className="flex-1 h-3 rounded-full bg-gray-100 overflow-hidden relative">
                    <div
                      className="h-full bg-gradient-to-r from-amber-400 to-[#4CAF50] rounded-full transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  <span className="w-12 text-right font-bold text-gray-600">
                    {count} ({Math.round(percent)}%)
                  </span>
                </button>
              );
            })}
          </div>

          {/* Sub-ratings Breakdown (3 cols) */}
          <div className="lg:col-span-3 bg-[#F4FBF5] p-5 rounded-2xl border border-[#C5DDCB]/60 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2E7D32] block">
              Evaluación por Criterio
            </span>

            <div>
              <div className="flex justify-between text-xs font-bold text-[#1F2E24] mb-1">
                <span>Contenido Educativo</span>
                <span className="text-emerald-700">★ {metrics.subRatingAverages.content}</span>
              </div>
              <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-600 rounded-full"
                  style={{ width: `${(metrics.subRatingAverages.content / 5) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-[#1F2E24] mb-1">
                <span>Diseño e Interfaz</span>
                <span className="text-blue-700">★ {metrics.subRatingAverages.design}</span>
              </div>
              <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full"
                  style={{ width: `${(metrics.subRatingAverages.design / 5) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-[#1F2E24] mb-1">
                <span>Facilidad de Uso</span>
                <span className="text-purple-700">★ {metrics.subRatingAverages.usability}</span>
              </div>
              <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-600 rounded-full"
                  style={{ width: `${(metrics.subRatingAverages.usability / 5) * 100}%` }}
                />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* New Review Form Accordion */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-gradient-to-br from-white via-[#F4FBF5] to-[#E8F5E9] rounded-3xl p-6 sm:p-8 border-2 border-[#81C784] shadow-2xl mb-12 animate-in fade-in zoom-in-95 space-y-6"
        >
          <div className="border-b border-[#C5DDCB] pb-4 flex items-center justify-between">
            <div>
              <h3 className="font-serif font-bold text-2xl text-[#123D2A]">
                Calificar y Opinar sobre EcoGuía3R
              </h3>
              <p className="text-xs text-[#4A5A4E]">
                Tu opinión quedará grabada en la base de datos embebida para retroalimentar la plataforma.
              </p>
            </div>
            <span className="text-xs font-bold bg-[#E8F5E9] text-[#2E7D32] px-3 py-1 rounded-full border border-[#81C784]/40">
              Almacenamiento IndexedDB
            </span>
          </div>

          {/* Interactive Star Selector */}
          <div className="bg-white p-5 rounded-2xl border border-[#C5DDCB]/60 shadow-xs">
            <label className="text-xs font-bold text-gray-700 block mb-2">
              Calificación General de la Plataforma (1 a 5 estrellas) *
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => {
                const isLit = (hoverRating !== null ? hoverRating : rating) >= star;
                return (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(null)}
                    onClick={() => handleStarSelect(star)}
                    className="p-1 text-3xl focus:outline-none transition-transform hover:scale-125"
                    aria-label={`Calificar con ${star} estrellas`}
                  >
                    <Star
                      className={`w-9 h-9 ${
                        isLit
                          ? 'fill-amber-400 text-amber-400 drop-shadow-xs'
                          : 'fill-gray-100 text-gray-300'
                      }`}
                    />
                  </button>
                );
              })}
              <span className="ml-3 text-sm font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                {ratingLabels[hoverRating || rating]}
              </span>
            </div>
          </div>

          {/* Sub-ratings sliders */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white/70 p-4 rounded-2xl border border-[#C5DDCB]/60">
            <div>
              <div className="flex justify-between text-xs font-bold text-gray-700 mb-1">
                <span>Contenido Educativo:</span>
                <span className="text-[#2E7D32]">{contentSubRating} ★</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                value={contentSubRating}
                onChange={(e) => setContentSubRating(Number(e.target.value))}
                className="w-full accent-[#4CAF50]"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-gray-700 mb-1">
                <span>Diseño e Interfaz:</span>
                <span className="text-[#2F5FA3]">{designSubRating} ★</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                value={designSubRating}
                onChange={(e) => setDesignSubRating(Number(e.target.value))}
                className="w-full accent-[#4A90E2]"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-gray-700 mb-1">
                <span>Facilidad de Uso:</span>
                <span className="text-[#7E6BC4]">{usabilitySubRating} ★</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                value={usabilitySubRating}
                onChange={(e) => setUsabilitySubRating(Number(e.target.value))}
                className="w-full accent-[#7E6BC4]"
              />
            </div>
          </div>

          {/* User Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Tu Nombre o Alias *
              </label>
              <input
                type="text"
                required
                placeholder="Ej. Juan Pérez"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Rol / Perfil *
              </label>
              <select
                value={userRole}
                onChange={(e) => setUserRole(e.target.value as ReviewComment['userRole'])}
                className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-sm focus:border-emerald-500 outline-none"
              >
                <option value="Ciudadano">Ciudadano</option>
                <option value="Estudiante">Estudiante</option>
                <option value="Docente">Docente</option>
                <option value="Reciclador">Reciclador de oficio</option>
                <option value="Entusiasta Eco">Entusiasta Eco / Sostenibilidad</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Ciudad en Colombia
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-sm focus:border-emerald-500 outline-none"
              >
                {COLOMBIAN_CITIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Category & Title */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Categoría del Comentario
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ReviewComment['category'])}
                className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-sm focus:border-emerald-500 outline-none"
              >
                <option value="general">General</option>
                <option value="contenido">Contenido Educativo</option>
                <option value="juego">Minijuego</option>
                <option value="diseno">Diseño Visual</option>
                <option value="sugerencia">Sugerencia / Idea</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Título del Comentario *
              </label>
              <input
                type="text"
                required
                placeholder="Ej. Muy didáctico para enseñar en casa"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2 text-sm focus:border-emerald-500 outline-none"
              />
            </div>
          </div>

          {/* Comment text */}
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1">
              Tu Reseña o Aporte *
            </label>
            <textarea
              required
              rows={3}
              placeholder="Comparte tu opinión, dudas resueltas sobre la Resolución 2184, o cómo te fue clasificando residuos..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-xl p-3.5 text-sm focus:border-emerald-500 outline-none resize-y"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="verifiedCheck"
              checked={isVerified}
              onChange={(e) => setIsVerified(e.target.checked)}
              className="w-4 h-4 accent-emerald-600 rounded"
            />
            <label htmlFor="verifiedCheck" className="text-xs text-gray-600 cursor-pointer">
              Soy reciclador/a de oficio, educador/a o promotor ambiental verificado
            </label>
          </div>

          {/* Submit Feedback */}
          {formSuccess ? (
            <div className="p-4 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-2xl flex items-center gap-2 text-sm font-bold animate-in fade-in">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <span>¡Gracias! Tu reseña ha sido almacenada con éxito en la base de datos embebida (IndexedDB).</span>
            </div>
          ) : (
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-5 py-2.5 rounded-full border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#174D32] hover:bg-[#123D2A] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Guardar en Base de Datos Embebida</span>
              </button>
            </div>
          )}
        </form>
      )}

      {/* Filter and Search Bar for Comments */}
      <div className="bg-[#F1FAF3] rounded-2xl p-4 border border-[#C5DDCB] mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Category pills */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="font-bold text-gray-600 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Filtro:
          </span>
          {['todos', 'general', 'contenido', 'juego', 'diseno', 'sugerencia'].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => {
                playSound('pop');
                setSelectedCategoryFilter(cat);
              }}
              className={`px-3 py-1 rounded-full font-bold capitalize transition-colors ${
                selectedCategoryFilter === cat
                  ? 'bg-[#174D32] text-white'
                  : 'bg-white text-gray-700 hover:bg-emerald-100'
              }`}
            >
              {cat === 'todos' ? 'Todos' : cat}
            </button>
          ))}
          {selectedStarFilter !== null && (
            <button
              type="button"
              onClick={() => setSelectedStarFilter(null)}
              className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 font-bold flex items-center gap-1"
            >
              <span>{selectedStarFilter}★ activo</span>
              <span className="text-xs">✕</span>
            </button>
          )}
        </div>

        {/* Search & Sort */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search box */}
          <div className="relative flex items-center bg-white border border-gray-300 rounded-xl px-3 py-1.5 text-xs w-48 focus-within:border-emerald-500">
            <Search className="w-3.5 h-3.5 text-gray-400 mr-1.5 shrink-0" />
            <input
              type="text"
              placeholder="Buscar opinión..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="bg-transparent border-none outline-none w-full"
            />
          </div>

          {/* Sort dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="bg-white border border-gray-300 rounded-xl px-3 py-1.5 text-xs font-bold text-gray-700 outline-none"
          >
            <option value="newest">Más recientes</option>
            <option value="highest">Mayor calificación</option>
            <option value="lowest">Menor calificación</option>
            <option value="likes">Más útiles (Me gusta)</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      {filteredReviews.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-gray-200 p-8">
          <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h4 className="font-serif font-bold text-lg text-gray-700">
            No se encontraron opiniones con estos filtros
          </h4>
          <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
            Prueba a limpiar la búsqueda o cambiar la categoría seleccionada.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedStarFilter(null);
              setSelectedCategoryFilter('todos');
              setSearchFilter('');
            }}
            className="mt-4 px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold hover:bg-emerald-200 transition-colors"
          >
            Limpiar filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredReviews.map((rev) => {
            const dateStr = new Date(rev.createdAt).toLocaleDateString('es-CO', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            });

            return (
              <div
                key={rev.id}
                className="bg-white rounded-3xl p-6 border border-[#C5DDCB] shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Top row: Avatar, Name, Rating */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-600 to-teal-800 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                        {rev.userName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-bold text-sm text-gray-900">
                            {rev.userName}
                          </h4>
                          {rev.isVerified && (
                            <span title="Usuario verificado">
                              <Award className="w-4 h-4 text-emerald-600" />
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-gray-500">
                          <span className="font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                            {rev.userRole}
                          </span>
                          <span className="flex items-center gap-0.5">
                            <MapPin className="w-3 h-3 text-gray-400" />
                            {rev.city}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Star Rating Badge */}
                    <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 shrink-0">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="text-xs font-extrabold text-amber-900">
                        {rev.rating}
                      </span>
                    </div>
                  </div>

                  {/* Title and comment */}
                  <h5 className="font-serif font-bold text-base text-gray-900 mb-1.5">
                    {rev.title}
                  </h5>
                  <p className="text-xs text-[#4A5A4E] leading-relaxed mb-4">
                    {rev.comment}
                  </p>

                  {/* Sub-ratings badges */}
                  {rev.subRatings && (
                    <div className="flex flex-wrap gap-2 text-[10px] text-gray-600 mb-4 bg-gray-50 p-2 rounded-xl">
                      <span>Contenido: <strong>{rev.subRatings.content}★</strong></span>
                      <span>•</span>
                      <span>Diseño: <strong>{rev.subRatings.design}★</strong></span>
                      <span>•</span>
                      <span>Usabilidad: <strong>{rev.subRatings.usability}★</strong></span>
                    </div>
                  )}

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {rev.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] bg-[#F1FAF3] text-[#2E7D32] px-2 py-0.5 rounded-md font-semibold border border-[#C5DDCB]/40"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom row: Date, Likes, Moderation delete */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-xs text-gray-400">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{dateStr}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleLike(rev.id)}
                      className="flex items-center gap-1 text-xs font-bold text-gray-600 hover:text-emerald-700 bg-gray-100 hover:bg-emerald-50 px-2.5 py-1 rounded-full transition-colors"
                      title="Marcar como útil"
                    >
                      <ThumbsUp className="w-3 h-3 text-emerald-600" />
                      <span>{rev.likes} útil</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(rev.id)}
                      className="p-1 text-gray-300 hover:text-rose-500 rounded transition-colors"
                      title="Eliminar de la DB embebida"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Embedded Database Inspector Modal */}
      {isDbModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-[1600] animate-in fade-in"
          onClick={() => setIsDbModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative animate-in zoom-in-95 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4 border-b pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <Database className="w-5 h-5 text-emerald-700" />
                </div>
                <div>
                  <h3 className="text-xl font-serif font-bold text-gray-900">
                    Explorador de Base de Datos Embebida
                  </h3>
                  <p className="text-xs text-emerald-700 font-semibold">
                    Motor: IndexedDB (Store: reviews) · Sincronización LocalStorage
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsDbModalOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600"
              >
                ✕
              </button>
            </div>

            {/* Architecture Explainer */}
            <div className="bg-[#E8F5E9] p-4 rounded-2xl border border-[#81C784]/40 mb-5 text-xs text-[#174D32] leading-relaxed">
              <strong>Arquitectura Embebida Sin Red Externa:</strong> En esta versión beta, todos los comentarios,
              calificaciones de 1 a 5 estrellas y métricas se gestionan en el motor de base de datos embebido en el 
              navegador del cliente mediante <code>window.indexedDB</code> con clave primaria <code>id</code> e índices 
              para <code>rating</code> y <code>createdAt</code>. No se requiere servidor HTTP backend ni infraestructura de red externa.
            </div>

            {/* Metrics summary */}
            <div className="grid grid-cols-3 gap-3 mb-5 text-center">
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                <span className="text-[10px] font-bold text-gray-500 uppercase block">Registros</span>
                <span className="text-xl font-black text-gray-900">{reviews.length}</span>
              </div>
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                <span className="text-[10px] font-bold text-gray-500 uppercase block">Calificación</span>
                <span className="text-xl font-black text-amber-500">{metrics.averageRating} ★</span>
              </div>
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                <span className="text-[10px] font-bold text-gray-500 uppercase block">Estado DB</span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full inline-block mt-1">
                  Activa & Persistida
                </span>
              </div>
            </div>

            {/* Database schema table */}
            <div className="mb-5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                <span>Esquema de la Tabla "reviews"</span>
              </h4>
              <div className="overflow-x-auto border border-gray-200 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 text-gray-700 font-bold border-b border-gray-200">
                    <tr>
                      <th className="p-2.5">Campo</th>
                      <th className="p-2.5">Tipo</th>
                      <th className="p-2.5">Descripción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-600">
                    <tr><td className="p-2.5 font-mono text-emerald-800">id</td><td className="p-2.5">string (PK)</td><td className="p-2.5">Identificador único del registro</td></tr>
                    <tr><td className="p-2.5 font-mono text-emerald-800">userName</td><td className="p-2.5">string</td><td className="p-2.5">Nombre del usuario calificador</td></tr>
                    <tr><td className="p-2.5 font-mono text-emerald-800">rating</td><td className="p-2.5">number (1-5)</td><td className="p-2.5">Calificación general asignada</td></tr>
                    <tr><td className="p-2.5 font-mono text-emerald-800">subRatings</td><td className="p-2.5">object</td><td className="p-2.5">Puntuación de contenido, diseño y usabilidad</td></tr>
                    <tr><td className="p-2.5 font-mono text-emerald-800">comment</td><td className="p-2.5">string</td><td className="p-2.5">Texto de la reseña / comentario</td></tr>
                    <tr><td className="p-2.5 font-mono text-emerald-800">city</td><td className="p-2.5">string</td><td className="p-2.5">Ciudad de procedencia en Colombia</td></tr>
                    <tr><td className="p-2.5 font-mono text-emerald-800">likes</td><td className="p-2.5">number</td><td className="p-2.5">Votos de utilidad recibidos</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Actions: Export / Import / Reset */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-200">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleProtectedAction('excel')}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-[#107C41] hover:bg-[#0B5A2F] text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
                  title="Descargar base de datos en formato Microsoft Excel (.xlsx) - Requiere contraseña"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Descargar Excel (.xlsx)</span>
                  <Lock className="w-3 h-3 text-white/80" />
                </button>

                <button
                  type="button"
                  onClick={() => handleProtectedAction('json')}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
                  title="Exportar respaldo en formato JSON - Requiere contraseña"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Exportar JSON</span>
                  <Lock className="w-3 h-3 text-white/80" />
                </button>

                <label className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Importar JSON</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportFile}
                    className="hidden"
                  />
                </label>
              </div>

              <button
                type="button"
                onClick={handleResetDb}
                className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 hover:bg-rose-50 text-gray-700 hover:text-rose-700 rounded-xl text-xs font-bold border border-gray-200 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Restablecer Demo</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Password Authorization Modal specifically for Downloading Information */}
      {isAuthModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-[1800] animate-in fade-in"
          onClick={() => setIsAuthModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative animate-in zoom-in-95 border border-[#C5DDCB]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsAuthModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600"
            >
              ✕
            </button>

            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-[#107C41] flex items-center justify-center mx-auto mb-4 shadow-xs">
              <Lock className="w-7 h-7 text-[#107C41]" />
            </div>

            <div className="text-center mb-6">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#107C41] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 inline-block mb-1.5">
                Seguridad de Datos
              </span>
              <h3 className="text-xl font-serif font-bold text-gray-900">
                Contraseña para Descargar Información
              </h3>
              <p className="text-xs text-[#4A5A4E] mt-1 leading-relaxed">
                El foro con las reseñas está abierto al público. Para descargar los reportes en Excel (.xlsx) o exportar datos, introduce la contraseña de autorización.
              </p>
            </div>

            <form onSubmit={handleVerifyDownloadPassword} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Contraseña de descarga
                </label>
                <div className="relative flex items-center">
                  <KeyRound className="w-4 h-4 text-gray-400 absolute left-3.5 pointer-events-none" />
                  <input
                    type={showDownloadPassword ? 'text' : 'password'}
                    autoFocus
                    required
                    placeholder="Introduce la contraseña..."
                    value={downloadPasswordInput}
                    onChange={(e) => {
                      setDownloadPasswordInput(e.target.value);
                      if (downloadAuthError) setDownloadAuthError('');
                    }}
                    className="w-full bg-[#F4FBF5] border border-gray-300 rounded-xl pl-10 pr-10 py-2.5 text-sm text-gray-900 focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowDownloadPassword(!showDownloadPassword)}
                    className="absolute right-3 text-gray-400 hover:text-gray-600 focus:outline-none p-1"
                  >
                    {showDownloadPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {downloadAuthError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-bold flex items-center gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{downloadAuthError}</span>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAuthModalOpen(false)}
                  className="flex-1 py-2.5 rounded-full border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-full bg-[#107C41] hover:bg-[#0B5A2F] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5"
                >
                  <Download className="w-4 h-4" />
                  <span>Verificar y Descargar</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </section>
  );
};
