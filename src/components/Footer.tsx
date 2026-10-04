import React from 'react';
import { Database, Heart, ShieldCheck, Terminal, Cpu } from 'lucide-react';

interface FooterProps {
  onOpenPythonModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenPythonModal }) => {
  return (
    <footer className="bg-[#174D32] text-white/85 pt-16 pb-12 border-t-4 border-[#4CAF50]">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">
          
          {/* Brand & info (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2 text-2xl font-serif font-bold text-white">
              <span>EcoGuía</span>
              <span className="text-[#81C784]">3R</span>
            </div>
            <p className="text-sm text-white/80 leading-relaxed max-w-sm">
              Plataforma interactiva para aprender a separar y valorizar residuos en Colombia. 
              Promueve la transición hacia una economía circular con hábitos reales en el hogar y las ciudades.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                type="button"
                onClick={onOpenPythonModal}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 text-xs font-mono font-bold text-yellow-300 border border-slate-700 transition-all cursor-pointer shadow-sm"
              >
                <span>🐍</span>
                <span>Backend en Python 3.10 (SQLite + OpenXML)</span>
              </button>
            </div>
          </div>

          {/* Quick links (4 cols) */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#CFEF9D]">
              Navegación Rápida
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <a href="#inicio" className="hover:text-white hover:underline">Inicio</a>
              <a href="#recicla" className="hover:text-white hover:underline">¿Por qué reciclar?</a>
              <a href="#contenedores" className="hover:text-white hover:underline">Contenedores 3R</a>
              <a href="#guias" className="hover:text-white hover:underline">Guías Paso a Paso</a>
              <a href="#separacion-fuente" className="hover:text-white hover:underline">Resolución 2184</a>
              <a href="#calculadora" className="hover:text-white hover:underline">Calculadora de Impacto</a>
              <a href="#juego" className="hover:text-white hover:underline">Minijuego Clasificador</a>
              <a href="#foro" className="hover:text-white hover:underline">Foro y Calificación</a>
            </div>
          </div>

          {/* Academic meta (3 cols) */}
          <div className="md:col-span-3 space-y-3 text-left md:text-right">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#CFEF9D]">
              Ficha Técnica
            </h4>
            <p className="text-xs text-white/70">
              Proyecto Académico de Prototipo Beta
            </p>
            <p className="text-xs text-white/70">
              Ingeniería de Sistemas · 5.º Semestre
            </p>
            <p className="text-xs text-white/70">
              Arquitectura de Datos Embebidos en Navegador
            </p>
            <p className="text-xs text-white/50 pt-2">
              &copy; 2026 EcoGuía3R · Colombia
            </p>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/60">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#81C784]" />
            <span>Basado en la Resolución 2184 de 2019 del Ministerio de Ambiente y Desarrollo Sostenible</span>
          </div>
          <div className="flex items-center gap-1">
            <span>Hecho con</span>
            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
            <span>para la cultura ciudadana y ambiental</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
