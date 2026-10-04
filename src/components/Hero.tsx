import React from 'react';
import { ArrowRight, Sparkles, Database, CheckCircle2, Star } from 'lucide-react';
import { playSound } from '../utils/audio';

interface HeroProps {
  onPlayClick: () => void;
  onRateClick: () => void;
  averageRating: number;
  totalReviews: number;
}

export const Hero: React.FC<HeroProps> = ({
  onPlayClick,
  onRateClick,
  averageRating,
  totalReviews,
}) => {
  return (
    <section className="relative overflow-hidden pt-12 pb-16 lg:py-20 max-w-[1240px] mx-auto px-4 sm:px-6">
      {/* Decorative ambient glowing orbs */}
      <div className="absolute top-10 left-[-80px] w-72 h-72 rounded-full bg-emerald-200/40 blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-4 right-[-60px] w-80 h-80 rounded-full bg-blue-200/30 blur-3xl pointer-events-none -z-10" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
        
        {/* Left column: Text & CTA */}
        <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E8F5E9] border border-[#81C784]/40 text-[#2E7D32] text-xs font-bold uppercase tracking-wider shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#4CAF50]" />
            <span>Aprende &bull; Separa &bull; Califica con DB Embebida</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-extrabold tracking-tight text-[#123D2A] leading-[1.12]">
            EcoGuía
            <span className="text-[#4CAF50] drop-shadow-xs">3R</span>
            <span className="block text-2xl sm:text-3xl lg:text-4xl font-normal text-[#2E7D32] mt-2">
              Reciclaje inteligente y participativo
            </span>
          </h1>

          <p className="text-base sm:text-lg text-[#4A5A4E] max-w-xl mx-auto lg:mx-0 leading-relaxed">
            Plataforma educativa para la correcta separación de residuos en Colombia bajo la{' '}
            <strong className="text-[#1F2E24] font-bold">Resolución 2184</strong>. Equipada con un{' '}
            <span className="text-[#2E7D32] font-semibold underline decoration-[#81C784] decoration-2">
              foro interactivo de comentarios y calificaciones respaldado por una base de datos embebida
            </span>{' '}
            (IndexedDB local, sin dependencia de servidores de red externos).
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
            <a
              href="#recicla"
              onClick={() => playSound('pop')}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#4CAF50] hover:bg-[#2E7D32] text-white font-bold text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
            >
              <span>♻ Aprender a reciclar</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <button
              type="button"
              onClick={() => {
                playSound('pop');
                onPlayClick();
              }}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#4A90E2] hover:bg-[#2F5FA3] text-white font-bold text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
            >
              <span>🎮 Jugar ahora</span>
            </button>

            <button
              type="button"
              onClick={() => {
                playSound('pop');
                onRateClick();
              }}
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full bg-white hover:bg-emerald-50 text-[#174D32] border border-[#81C784] font-bold text-sm shadow-xs hover:shadow-md transition-all duration-200"
            >
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>Calificar el sitio</span>
              <span className="text-xs bg-[#E8F5E9] text-[#2E7D32] px-2 py-0.5 rounded-full">
                {averageRating} ★ ({totalReviews})
              </span>
            </button>
          </div>

          {/* Trust badges */}
          <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 text-xs text-[#4A5A4E]">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#4CAF50]" />
              <span>Resolución 2184 Oficial</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Database className="w-4 h-4 text-[#4A90E2]" />
              <span>Base de Datos Embebida (IndexedDB)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#4CAF50]" />
              <span>Foro & Calificación Ciudadana</span>
            </div>
          </div>
        </div>

        {/* Right column: Interactive Animated Vector Illustration */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="relative w-full max-w-[420px] aspect-square rounded-3xl bg-gradient-to-br from-white/90 to-[#F1FAF3]/90 p-6 shadow-xl border border-[#C5DDCB]/60 backdrop-blur-xs flex items-center justify-center group">
            
            {/* Soft decorative ring */}
            <div className="absolute inset-0 rounded-3xl border-2 border-dashed border-[#81C784]/30 pointer-events-none" />

            <svg
              viewBox="0 0 420 420"
              className="w-full h-full drop-shadow-md select-none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Hill / ground base */}
              <ellipse cx="210" cy="370" rx="180" ry="24" fill="#DDF3E3" />

              {/* Sun / Eco light */}
              <circle cx="330" cy="80" r="44" fill="#E3F2FD" opacity="0.8" />
              <circle cx="330" cy="80" r="28" fill="#4A90E2" opacity="0.9" />

              {/* 3 Containers representation */}
              {/* Contenedor Verde */}
              <g transform="translate(60,200)">
                <rect x="0" y="24" width="76" height="110" rx="12" fill="#4CAF50" />
                <rect x="-4" y="8" width="84" height="22" rx="8" fill="#2E7D32" />
                <rect x="22" y="0" width="32" height="10" rx="4" fill="#2E7D32" />
                <circle cx="38" cy="70" r="18" fill="white" opacity="0.25" />
                <text x="38" y="77" textAnchor="middle" fontSize="22">🍃</text>
                <text x="38" y="112" textAnchor="middle" fontSize="10" fill="white" fontWeight="bold">VERDE</text>
              </g>

              {/* Contenedor Blanco */}
              <g transform="translate(170,175)">
                <rect x="0" y="28" width="84" height="135" rx="14" fill="#FFFFFF" stroke="#B0BEC5" strokeWidth="3" />
                <rect x="-4" y="10" width="92" height="24" rx="8" fill="#CFD8DC" />
                <rect x="26" y="0" width="32" height="12" rx="4" fill="#90A4AE" />
                <circle cx="42" cy="80" r="20" fill="#E8F5E9" />
                <text x="42" y="88" textAnchor="middle" fontSize="24">🧴</text>
                <text x="42" y="135" textAnchor="middle" fontSize="10" fill="#123D2A" fontWeight="bold">BLANCO</text>
              </g>

              {/* Contenedor Negro */}
              <g transform="translate(290,210)">
                <rect x="0" y="22" width="72" height="100" rx="12" fill="#263238" />
                <rect x="-4" y="6" width="80" height="20" rx="8" fill="#37474F" />
                <rect x="20" y="0" width="32" height="8" rx="4" fill="#37474F" />
                <circle cx="36" cy="65" r="16" fill="white" opacity="0.15" />
                <text x="36" y="72" textAnchor="middle" fontSize="20">🧻</text>
                <text x="36" y="102" textAnchor="middle" fontSize="9" fill="white" fontWeight="bold">NEGRO</text>
              </g>

              {/* Floating leaf */}
              <g transform="translate(160,85) rotate(-10)" className="animate-leaf origin-center">
                <path d="M0 45C0 12 25 0 50 0C50 30 35 50 0 45Z" fill="#81C784" />
                <path d="M0 45C15 32 30 20 50 0" stroke="#174D32" strokeWidth="2" strokeLinecap="round" />
              </g>

              {/* Embedded Database Data Cylinder Symbol in hero art */}
              <g transform="translate(45,70)">
                <rect x="0" y="0" width="90" height="48" rx="10" fill="#E8F5E9" stroke="#81C784" strokeWidth="2" />
                <text x="12" y="28" fontSize="18">💾</text>
                <text x="36" y="22" fontSize="9" fontWeight="bold" fill="#123D2A">DATABASE</text>
                <text x="36" y="36" fontSize="8" fill="#2E7D32">EMBEDDED</text>
              </g>
            </svg>

            {/* Interactive pill badge */}
            <div className="absolute -bottom-4 bg-white px-4 py-2 rounded-2xl shadow-lg border border-gray-100 flex items-center gap-2 text-xs font-bold text-gray-800">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Base de Datos Local Lista: {totalReviews} Reseñas</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
