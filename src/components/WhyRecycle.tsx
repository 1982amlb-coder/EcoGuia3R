import React from 'react';
import { RefreshCw, Leaf, Droplets, Building2 } from 'lucide-react';

export const WhyRecycle: React.FC = () => {
  return (
    <section className="max-w-[1240px] mx-auto px-4 sm:px-6 py-16" id="recicla">
      <div className="max-w-2xl mb-12">
        <p className="text-xs font-bold uppercase tracking-widest text-[#2E7D32] mb-2">
          Educación ambiental
        </p>
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1F2E24] tracking-tight">
          ¿Por qué reciclar?
        </h2>
        <p className="text-[#4A5A4E] text-base sm:text-lg mt-3 leading-relaxed">
          Reciclar es separar correctamente tus residuos para que puedan reincorporarse a ciclos productivos, 
          en lugar de terminar contaminando el suelo, las fuentes hídricas y el aire. Cada gesto en casa reduce 
          el impacto ecológico de toda una ciudad.
        </p>
      </div>

      {/* 4 Interactive Feature Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1 */}
        <div className="bg-white/95 rounded-2xl p-6 shadow-sm hover:shadow-xl border border-[#C5DDCB] border-t-4 border-t-[#4CAF50] hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden group">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-[#2E7D32] flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform">
            <RefreshCw className="w-6 h-6 text-[#4CAF50]" />
          </div>
          <h3 className="text-lg font-serif font-bold text-[#1F2E24] mb-2">
            Reducimos residuos
          </h3>
          <p className="text-sm text-[#4A5A4E] leading-relaxed">
            Separar en la fuente evita que toneladas de materiales que tardan siglos en degradarse terminen saturando los rellenos sanitarios.
          </p>
          <span className="absolute -bottom-6 -right-6 text-7xl text-emerald-900/5 select-none font-bold">
            ♻
          </span>
        </div>

        {/* Card 2 */}
        <div className="bg-white/95 rounded-2xl p-6 shadow-sm hover:shadow-xl border border-[#C5DDCB] border-t-4 border-t-[#26A69A] hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden group">
          <div className="w-12 h-12 rounded-xl bg-teal-100 text-[#26A69A] flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform">
            <Leaf className="w-6 h-6 text-[#26A69A]" />
          </div>
          <h3 className="text-lg font-serif font-bold text-[#1F2E24] mb-2">
            Protegemos el ambiente
          </h3>
          <p className="text-sm text-[#4A5A4E] leading-relaxed">
            Menos residuos mal dispuestos se traduce en ríos libres de microplásticos, suelos no acidificados y menor emisión de gases de efecto invernadero.
          </p>
          <span className="absolute -bottom-6 -right-6 text-7xl text-teal-900/5 select-none font-bold">
            🌱
          </span>
        </div>

        {/* Card 3 */}
        <div className="bg-white/95 rounded-2xl p-6 shadow-sm hover:shadow-xl border border-[#C5DDCB] border-t-4 border-t-[#4A90E2] hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden group">
          <div className="w-12 h-12 rounded-xl bg-blue-100 text-[#4A90E2] flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform">
            <Droplets className="w-6 h-6 text-[#4A90E2]" />
          </div>
          <h3 className="text-lg font-serif font-bold text-[#1F2E24] mb-2">
            Ahorramos recursos
          </h3>
          <p className="text-sm text-[#4A5A4E] leading-relaxed">
            Reutilizar aluminio, vidrio y papel reduce de forma dramática la tala de bosques, la minería de bauxita y el consumo de agua dulce.
          </p>
          <span className="absolute -bottom-6 -right-6 text-7xl text-blue-900/5 select-none font-bold">
            💧
          </span>
        </div>

        {/* Card 4 */}
        <div className="bg-white/95 rounded-2xl p-6 shadow-sm hover:shadow-xl border border-[#C5DDCB] border-t-4 border-t-[#F5A623] hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden group">
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-[#F5A623] flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform">
            <Building2 className="w-6 h-6 text-[#F5A623]" />
          </div>
          <h3 className="text-lg font-serif font-bold text-[#1F2E24] mb-2">
            Ciudades sostenibles
          </h3>
          <p className="text-sm text-[#4A5A4E] leading-relaxed">
            Facilita las rutas selectivas y dignifica la labor de los recicladores de oficio, pilares de la economía circular urbana.
          </p>
          <span className="absolute -bottom-6 -right-6 text-7xl text-amber-900/5 select-none font-bold">
            🏙
          </span>
        </div>
      </div>

      {/* Illustrated cycle banner */}
      <div className="mt-12 bg-[#F1FAF3] rounded-3xl p-6 sm:p-8 border border-[#C5DDCB] shadow-sm">
        <div className="text-center mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-[#2E7D32] bg-[#E8F5E9] px-3 py-1 rounded-full">
            El Ciclo del Reciclaje en Colombia
          </span>
        </div>
        <svg viewBox="0 0 900 180" className="w-full h-auto select-none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="450" cy="165" rx="420" ry="14" fill="#E8F5E9" />
          
          {/* Casa / Origen */}
          <g transform="translate(70,50)">
            <polygon points="40,0 80,32 0,32" fill="#81C784" />
            <rect x="10" y="32" width="60" height="55" fill="#FFFFFF" stroke="#C5DDCB" strokeWidth="2" />
            <rect x="32" y="55" width="16" height="32" fill="#4A90E2" />
            <text x="40" y="105" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#174D32">1. Hogar / Origen</text>
          </g>

          {/* Flecha curva 1 */}
          <path d="M190 90 C 270 30, 340 30, 410 80" stroke="#4CAF50" strokeWidth="3" fill="none" strokeDasharray="8 8" />
          <polygon points="405,70 420,82 402,90" fill="#4CAF50" />

          {/* Camión / Recolección */}
          <g transform="translate(420,40)">
            <rect x="0" y="20" width="75" height="38" rx="6" fill="#26A69A" />
            <rect x="75" y="30" width="36" height="28" rx="4" fill="#F5A623" />
            <circle cx="22" cy="62" r="10" fill="#263238" />
            <circle cx="94" cy="62" r="10" fill="#263238" />
            <text x="37" y="44" textAnchor="middle" fontSize="20" fill="white">♻</text>
            <text x="55" y="105" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#174D32">2. Rutas Selectivas</text>
          </g>

          {/* Flecha curva 2 */}
          <path d="M570 80 C 640 30, 710 30, 760 90" stroke="#4A90E2" strokeWidth="3" fill="none" strokeDasharray="8 8" />
          <polygon points="753,78 770,88 750,98" fill="#4A90E2" />

          {/* Planta / Transformación */}
          <g transform="translate(760,40)">
            <rect x="26" y="45" width="12" height="30" fill="#8D6E63" />
            <circle cx="32" cy="35" r="26" fill="#4CAF50" />
            <circle cx="15" cy="50" r="15" fill="#81C784" />
            <circle cx="50" cy="50" r="15" fill="#81C784" />
            <text x="32" y="105" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#174D32">3. Nueva Vida</text>
          </g>
        </svg>
      </div>
    </section>
  );
};
