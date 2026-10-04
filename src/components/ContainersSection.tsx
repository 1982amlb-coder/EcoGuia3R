import React, { useState } from 'react';
import { CONTAINER_INFO } from '../data/wasteData';
import { ArrowRight, X, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { playSound } from '../utils/audio';

type ContainerKey = 'verde' | 'blanco' | 'negro';

export const ContainersSection: React.FC = () => {
  const [activeModalKey, setActiveModalKey] = useState<ContainerKey | null>(null);

  const openContainer = (key: ContainerKey) => {
    playSound('pop');
    setActiveModalKey(key);
  };

  const closeModal = () => {
    setActiveModalKey(null);
  };

  const activeInfo = activeModalKey ? CONTAINER_INFO[activeModalKey] : null;

  return (
    <section className="bg-gradient-to-b from-[#DDF3E3] via-[#D3EBD9] to-[#DFF2E4] py-16 lg:py-20 relative overflow-hidden" id="contenedores">
      {/* Decorative background shape */}
      <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full border-[28px] border-emerald-500/10 pointer-events-none" />

      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 relative z-10">
        
        <div className="max-w-2xl mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-[#2F5FA3] mb-2">
            Clasificación oficial en Colombia · Resolución 2184
          </p>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1F2E24] tracking-tight">
            Conoce los 3 contenedores
          </h2>
          <p className="text-[#4A5A4E] text-base sm:text-lg mt-3 leading-relaxed">
            Desde el 1 de enero de 2021, Colombia unificó el código de colores en todo el país. 
            Haz clic en cada contenedor para ver ejemplos detallados y consejos de preparación.
          </p>
        </div>

        {/* 3 Container Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          
          {/* Contenedor Verde */}
          <button
            type="button"
            onClick={() => openContainer('verde')}
            className="group text-left relative overflow-hidden rounded-3xl p-8 bg-gradient-to-br from-[#4CAF50] to-[#1F7A45] text-white shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-[#81C784]"
          >
            <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10 group-hover:scale-125 transition-transform" />
            
            {/* Vector Illustration */}
            <div className="w-16 h-20 mb-6 drop-shadow-md">
              <svg viewBox="0 0 100 110" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <rect x="18" y="30" width="64" height="70" rx="10" fill="rgba(255,255,255,0.25)" />
                <rect x="10" y="14" width="80" height="20" rx="8" fill="rgba(255,255,255,0.4)" />
                <rect x="38" y="2" width="24" height="12" rx="4" fill="rgba(255,255,255,0.4)" />
                <text x="50" y="74" textAnchor="middle" fontSize="32">🍃</text>
              </svg>
            </div>

            <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-2.5 py-1 rounded-full text-white">
              Orgánico
            </span>

            <h3 className="text-2xl font-serif font-bold text-white mt-3 mb-2">
              Contenedor verde
            </h3>

            <p className="text-white/85 text-sm mb-6 leading-relaxed">
              Residuos orgánicos aprovechables: cáscaras, restos de alimentos, podas y borra de café.
            </p>

            <div className="inline-flex items-center gap-2 font-bold text-sm text-[#CFEF9D] group-hover:translate-x-1 transition-transform">
              <span>Explorar ejemplos y normas</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </button>

          {/* Contenedor Blanco */}
          <button
            type="button"
            onClick={() => openContainer('blanco')}
            className="group text-left relative overflow-hidden rounded-3xl p-8 bg-gradient-to-br from-[#FFFFFF] via-[#F4FBF5] to-[#CDE9D6] text-[#123D2A] border-2 border-white shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-white"
          >
            <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-emerald-800/5 group-hover:scale-125 transition-transform" />

            {/* Vector Illustration */}
            <div className="w-16 h-20 mb-6 drop-shadow-md">
              <svg viewBox="0 0 100 110" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <rect x="18" y="30" width="64" height="70" rx="10" fill="#E8F5E9" stroke="#81C784" strokeWidth="2" />
                <rect x="10" y="14" width="80" height="20" rx="8" fill="#B9E7C5" />
                <rect x="38" y="2" width="24" height="12" rx="4" fill="#5FB878" />
                <text x="50" y="74" textAnchor="middle" fontSize="32">🧴</text>
              </svg>
            </div>

            <span className="text-xs font-bold uppercase tracking-wider bg-emerald-100 text-[#174D32] px-2.5 py-1 rounded-full">
              Aprovechable (Reciclable)
            </span>

            <h3 className="text-2xl font-serif font-bold text-[#123D2A] mt-3 mb-2">
              Contenedor blanco
            </h3>

            <p className="text-[#315340] text-sm mb-6 leading-relaxed">
              Plásticos, botellas, cartón limpio, papel seco, vidrio, metales y Tetra Pak.
            </p>

            <div className="inline-flex items-center gap-2 font-bold text-sm text-[#1F7A45] group-hover:translate-x-1 transition-transform">
              <span>Explorar ejemplos y normas</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </button>

          {/* Contenedor Negro */}
          <button
            type="button"
            onClick={() => openContainer('negro')}
            className="group text-left relative overflow-hidden rounded-3xl p-8 bg-gradient-to-br from-[#37474F] to-[#1C2529] text-white shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-gray-600"
          >
            <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10 group-hover:scale-125 transition-transform" />

            {/* Vector Illustration */}
            <div className="w-16 h-20 mb-6 drop-shadow-md">
              <svg viewBox="0 0 100 110" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <rect x="18" y="30" width="64" height="70" rx="10" fill="rgba(255,255,255,0.15)" />
                <rect x="10" y="14" width="80" height="20" rx="8" fill="rgba(255,255,255,0.25)" />
                <rect x="38" y="2" width="24" height="12" rx="4" fill="rgba(255,255,255,0.25)" />
                <text x="50" y="74" textAnchor="middle" fontSize="32">🧻</text>
              </svg>
            </div>

            <span className="text-xs font-bold uppercase tracking-wider bg-white/15 px-2.5 py-1 rounded-full text-white/90">
              No aprovechable
            </span>

            <h3 className="text-2xl font-serif font-bold text-white mt-3 mb-2">
              Contenedor negro
            </h3>

            <p className="text-white/80 text-sm mb-6 leading-relaxed">
              Papel higiénico, servilletas usadas, cartón engrasado y residuos sanitarios.
            </p>

            <div className="inline-flex items-center gap-2 font-bold text-sm text-[#CFEF9D] group-hover:translate-x-1 transition-transform">
              <span>Explorar ejemplos y normas</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </button>
        </div>
      </div>

      {/* Modal Details */}
      {activeInfo && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-[1500] animate-in fade-in"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative animate-in zoom-in-95 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={closeModal}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 transition-colors"
              aria-label="Cerrar ventana"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl">{activeInfo.icon}</span>
              <div>
                <h3 className="text-2xl font-serif font-bold text-[#1F2E24]">
                  {activeInfo.title}
                </h3>
                <p className="text-xs font-bold uppercase tracking-wider text-[#2E7D32]">
                  {activeInfo.subtitle}
                </p>
              </div>
            </div>

            <p className="text-sm text-[#4A5A4E] leading-relaxed mb-6">
              {activeInfo.description}
            </p>

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-bold text-[#1F2E24] flex items-center gap-1.5 mb-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#4CAF50]" />
                  <span>¿Qué depositar aquí?</span>
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#4A5A4E]">
                  {activeInfo.examples.map((item, i) => (
                    <li key={i} className="flex items-start gap-1.5 bg-[#F4FBF5] p-2 rounded-lg border border-[#C5DDCB]/50">
                      <span className="text-[#4CAF50] font-bold">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Golden Tip */}
              <div className="bg-[#E8F5E9] p-4 rounded-2xl border border-[#81C784]/40 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-[#2E7D32] shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-[#174D32]">Regla de Oro en este contenedor:</p>
                  <p className="text-xs text-[#2E7D32] mt-0.5">{activeInfo.goldenTip}</p>
                </div>
              </div>

              {/* Destination */}
              <div className="text-xs text-[#4A5A4E] bg-gray-50 p-3 rounded-xl border border-gray-100 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-gray-500 shrink-0" />
                <span><strong>Destino final:</strong> {activeInfo.destination}</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end">
              <button
                type="button"
                onClick={closeModal}
                className="px-5 py-2.5 rounded-full bg-[#174D32] hover:bg-[#123D2A] text-white text-xs font-bold transition-colors"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
