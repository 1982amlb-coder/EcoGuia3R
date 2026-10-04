import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { playSound } from '../utils/audio';

const SLIDES = [
  {
    number: '01',
    title: 'Separa desde el origen',
    text: 'Una correcta clasificación en la fuente facilita el aprovechamiento de los materiales y reduce drásticamente la cantidad de residuos que colapsan los rellenos sanitarios.',
    kicker: 'EcoGuía3R · Principio 1',
    accent: '#4CAF50',
    art: (
      <svg viewBox="0 0 430 240" className="w-full max-h-56 select-none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="350" cy="48" r="34" fill="#CFEF9D" opacity=".9" />
        <path d="M40 190 C100 145 150 155 205 180 C260 205 320 200 390 155" fill="none" stroke="#B9E7C5" strokeWidth="8" strokeLinecap="round" />
        <rect x="105" y="92" width="70" height="92" rx="13" fill="#5FB878" />
        <rect x="98" y="78" width="84" height="22" rx="8" fill="#3E915B" />
        <rect x="190" y="78" width="70" height="106" rx="13" fill="#F5FFF7" stroke="#B9E7C5" strokeWidth="4" />
        <rect x="183" y="64" width="84" height="22" rx="8" fill="#D7F0DE" />
        <rect x="275" y="98" width="65" height="86" rx="13" fill="#214C39" />
        <rect x="269" y="84" width="77" height="21" rx="8" fill="#173A2B" />
        <text x="140" y="148" fontSize="28">🍃</text>
        <text x="225" y="145" fontSize="26">🧴</text>
        <text x="306" y="148" fontSize="26">🧻</text>
      </svg>
    )
  },
  {
    number: '02',
    title: 'Pequeñas acciones, gran impacto',
    text: 'Reducir, reutilizar y separar correctamente son hábitos sencillos que comienzan en casa, en la universidad o en el trabajo y transforman comunidades enteras.',
    kicker: 'EcoGuía3R · Principio 2',
    accent: '#26A69A',
    art: (
      <svg viewBox="0 0 430 240" className="w-full max-h-56 select-none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="215" cy="120" r="78" fill="#B9E7C5" opacity=".28" />
        <path d="M215 42 C250 42 278 60 293 88" fill="none" stroke="#CFEF9D" strokeWidth="11" strokeLinecap="round" />
        <polygon points="294,77 314,91 288,99" fill="#CFEF9D" />
        <path d="M292 122 C292 160 268 186 235 194" fill="none" stroke="#B9E7C5" strokeWidth="11" strokeLinecap="round" />
        <polygon points="241,183 228,199 252,201" fill="#B9E7C5" />
        <path d="M195 195 C158 190 136 163 137 129" fill="none" stroke="#8FE0A4" strokeWidth="11" strokeLinecap="round" />
        <polygon points="137,139 123,126 142,119" fill="#8FE0A4" />
        <text x="190" y="140" fontSize="48" fill="#123D2A">♻</text>
        <circle cx="105" cy="60" r="18" fill="#5FB878" />
        <circle cx="335" cy="75" r="14" fill="#4A90E2" />
        <circle cx="330" cy="185" r="20" fill="#CFEF9D" />
      </svg>
    )
  },
  {
    number: '03',
    title: 'Arquitectura con Base de Datos Embebida',
    text: 'Sustituimos la red externa por una base de datos local embebida (IndexedDB) para almacenar opiniones, calificaciones y estadísticas sin necesidad de servidores intermedios.',
    kicker: 'EcoGuía3R · Arquitectura de Datos',
    accent: '#4A90E2',
    art: (
      <svg viewBox="0 0 430 240" className="w-full max-h-56 select-none" xmlns="http://www.w3.org/2000/svg">
        <path d="M70 155 H360" stroke="#B9E7C5" strokeWidth="4" strokeLinecap="round" />
        <rect x="55" y="65" width="100" height="64" rx="14" fill="#4A90E2" />
        <rect x="165" y="65" width="100" height="64" rx="14" fill="#5FB878" />
        <rect x="275" y="65" width="100" height="64" rx="14" fill="#214C39" />
        <text x="105" y="103" textAnchor="middle" fontSize="28">💾</text>
        <text x="215" y="103" textAnchor="middle" fontSize="28">⭐</text>
        <text x="325" y="103" textAnchor="middle" fontSize="28">💬</text>
        <circle cx="160" cy="155" r="6" fill="#CFEF9D" />
        <circle cx="270" cy="155" r="6" fill="#8FE0A4" />
        <text x="215" y="205" textAnchor="middle" fill="white" fontFamily="sans-serif" fontSize="13" fontWeight="bold">
          INDEXEDDB · FORO LOCAL · CALIFICACIÓN
        </text>
      </svg>
    )
  },
  {
    number: '04',
    title: 'Aprende jugando y califica tu experiencia',
    text: 'Pon a prueba tu conocimiento con el minijuego interactivo de clasificación y deja tu reseña en el foro para que quede registrada en la base de datos.',
    kicker: 'EcoGuía3R · Gamificación',
    accent: '#F5A623',
    art: (
      <svg viewBox="0 0 430 240" className="w-full max-h-56 select-none" xmlns="http://www.w3.org/2000/svg">
        <rect x="72" y="60" width="286" height="125" rx="24" fill="rgba(255,255,255,.12)" stroke="#B9E7C5" strokeWidth="3" />
        <circle cx="215" cy="122" r="42" fill="#F5FFF7" />
        <text x="215" y="139" textAnchor="middle" fontSize="50">🎮</text>
        <path d="M100 95 L135 75 M295 75 L330 95" stroke="#CFEF9D" strokeWidth="6" strokeLinecap="round" />
        <circle cx="118" cy="145" r="8" fill="#8FE0A4" />
        <circle cx="318" cy="145" r="8" fill="#4A90E2" />
        <text x="215" y="207" textAnchor="middle" fill="white" fontFamily="sans-serif" fontSize="13" fontWeight="bold">
          CLASIFICA · RESPONDE · OPINA
        </text>
      </svg>
    )
  }
];

export const EcoGallery: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    playSound('pop');
    setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    playSound('pop');
    setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [isPaused]);

  const slide = SLIDES[currentSlide];

  return (
    <section className="max-w-[1240px] mx-auto px-4 sm:px-6 my-6 sm:my-10" aria-label="Galería interactiva">
      <div
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#174D32] via-[#2F7D4C] to-[#2F5FA3] text-white p-6 sm:p-10 shadow-2xl transition-all duration-300 min-h-[340px] flex flex-col justify-between"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Subtle decorative circles */}
        <div className="absolute -left-16 -top-16 w-56 h-56 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute -right-20 -bottom-20 w-72 h-72 rounded-full bg-white/5 pointer-events-none" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
          
          {/* Copy */}
          <div className="md:col-span-7 space-y-3.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-xs font-bold uppercase tracking-wider text-[#CFEF9D]">
              <Sparkles className="w-3 h-3" />
              {slide.kicker}
            </span>

            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-white tracking-tight leading-snug">
              {slide.title}
            </h3>

            <p className="text-sm sm:text-base text-white/85 leading-relaxed max-w-xl">
              {slide.text}
            </p>
          </div>

          {/* Artwork */}
          <div className="md:col-span-5 flex justify-center items-center drop-shadow-lg">
            <div className="w-full max-w-[380px] animate-float">
              {slide.art}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between pt-6 border-t border-white/10 mt-4 relative z-10">
          <div className="flex items-center gap-2">
            {SLIDES.map((s, idx) => (
              <button
                key={s.number}
                type="button"
                onClick={() => {
                  playSound('pop');
                  setCurrentSlide(idx);
                }}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  idx === currentSlide
                    ? 'w-8 bg-[#CFEF9D]'
                    : 'w-2.5 bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Ir a diapositiva ${idx + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={prevSlide}
              className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/30 border border-white/30 flex items-center justify-center text-white transition-transform active:scale-95"
              aria-label="Anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={nextSlide}
              className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/30 border border-white/30 flex items-center justify-center text-white transition-transform active:scale-95"
              aria-label="Siguiente"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
