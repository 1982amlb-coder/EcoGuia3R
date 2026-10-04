import React, { useState, useEffect, useRef } from 'react';
import { WASTE_ITEMS, WasteItem } from '../data/wasteData';
import { Search, Volume2, VolumeX, Menu, X, MessageSquare, Star, Gamepad2, Users } from 'lucide-react';
import { isSoundEnabled, setSoundEnabled, playSound } from '../utils/audio';

interface NavbarProps {
  onSelectWasteModal: (item: WasteItem) => void;
  onOpenProfileModal: () => void;
  totalCommentsCount: number;
  averageRating: number;
  isAdmin?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onSelectWasteModal,
  onOpenProfileModal,
  totalCommentsCount,
  averageRating,
  isAdmin,
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(isSoundEnabled());
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<WasteItem[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchInput = (val: string) => {
    setSearchQuery(val);
    const q = val.trim().toLowerCase();
    if (!q) {
      setSearchResults([]);
      setIsSearchOpen(false);
      return;
    }

    const matched = WASTE_ITEMS.filter((item) =>
      item.name.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.containerName.toLowerCase().includes(q)
    );

    setSearchResults(matched.slice(0, 6));
    setIsSearchOpen(true);
  };

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
    if (next) playSound('pop');
  };

  return (
    <>
      {/* Scroll Reading Progress Bar */}
      <div
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-[#4CAF50] via-[#CFEF9D] to-[#4A90E2] z-[1200] transition-all duration-75"
        style={{ width: `${scrollProgress}%` }}
        aria-hidden="true"
      />

      <header className="sticky top-0 z-[1000] bg-gradient-to-r from-[#145A32] via-[#1F7A45] to-[#2E7D32] text-white shadow-lg border-b border-white/10 backdrop-blur-md">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 h-[72px] flex items-center justify-between gap-4">
          
          {/* Brand */}
          <a
            href="#inicio"
            className="flex items-center gap-2.5 font-serif font-bold text-xl sm:text-2xl text-white tracking-tight group"
          >
            <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-[#B9E7C5] group-hover:scale-110 transition-transform">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" className="animate-leaf" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 20C4 10 12 4 20 4C20 12 15 20 4 20Z" fill="currentColor"/>
                <path d="M4 20C8 16 12 12 20 4" stroke="#174D32" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </span>
            <span>
              EcoGuía<span className="text-[#81C784]">3R</span>
            </span>
            <span className="hidden lg:inline-flex text-[10px] font-sans font-bold bg-[#CFEF9D] text-[#123D2A] px-2 py-0.5 rounded-full uppercase tracking-wider">
              Base de Datos Embebida
            </span>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden xl:flex items-center gap-5 text-sm font-semibold text-emerald-50">
            <a href="#inicio" className="hover:text-white transition-colors py-1 hover:border-b-2 hover:border-[#CFEF9D]">Inicio</a>
            <a href="#recicla" className="hover:text-white transition-colors py-1 hover:border-b-2 hover:border-[#CFEF9D]">¿Por qué reciclar?</a>
            <a href="#contenedores" className="hover:text-white transition-colors py-1 hover:border-b-2 hover:border-[#CFEF9D]">Contenedores</a>
            <a href="#guias" className="hover:text-white transition-colors py-1 hover:border-b-2 hover:border-[#CFEF9D]">Guías</a>
            <a href="#separacion-fuente" className="hover:text-white transition-colors py-1 hover:border-b-2 hover:border-[#CFEF9D]">Resolución 2184</a>
            <a href="#calculadora" className="hover:text-white transition-colors py-1 hover:border-b-2 hover:border-[#CFEF9D]">Calculadora</a>
            <a href="#juego" className="hover:text-white transition-colors py-1 hover:border-b-2 hover:border-[#CFEF9D] flex items-center gap-1">
              <Gamepad2 className="w-4 h-4 text-[#CFEF9D]" /> Juego
            </a>
            <a
              href="#foro"
              className="bg-white/15 hover:bg-white text-white hover:text-[#174D32] px-3.5 py-1.5 rounded-full transition-all duration-200 font-bold flex items-center gap-1.5 shadow-sm"
            >
              <MessageSquare className="w-4 h-4 text-[#CFEF9D]" />
              <span>Foro & Reseñas ({totalCommentsCount})</span>
            </a>
          </nav>

          {/* Search + Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Waste Search Bar */}
            <div ref={searchRef} className="relative hidden md:block">
              <div className="flex items-center bg-white/15 border border-white/25 rounded-full px-3 py-1.5 focus-within:bg-white focus-within:text-[#1F2E24] focus-within:border-[#4CAF50] transition-all duration-200 w-52 lg:w-64">
                <Search className="w-4 h-4 text-white/80 focus-within:text-[#2E7D32] mr-2 shrink-0" />
                <input
                  type="text"
                  placeholder="Buscar residuo..."
                  value={searchQuery}
                  onChange={(e) => handleSearchInput(e.target.value)}
                  onFocus={() => searchQuery && setIsSearchOpen(true)}
                  className="bg-transparent border-none outline-none text-xs w-full text-white placeholder:text-white/60 focus:text-[#1F2E24]"
                />
              </div>

              {/* Autocomplete Dropdown */}
              {isSearchOpen && (
                <div className="absolute top-full mt-2 left-0 right-0 bg-white rounded-xl shadow-2xl border border-gray-200 text-[#1F2E24] overflow-hidden z-[1300] animate-in fade-in zoom-in-95">
                  <div className="p-2 bg-emerald-50 border-b border-emerald-100 flex items-center justify-between text-[11px] font-bold text-emerald-800">
                    <span>Resultados de clasificación</span>
                    <span>{searchResults.length} encontrados</span>
                  </div>
                  {searchResults.length === 0 ? (
                    <div className="p-3 text-xs text-gray-500 text-center">
                      No encontramos coincidencias para "{searchQuery}". Intenta con: <em>plástico, cáscara, papel, botella...</em>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100 max-h-64 overflow-y-auto">
                      {searchResults.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            playSound('pop');
                            onSelectWasteModal(item);
                            setIsSearchOpen(false);
                            setSearchQuery('');
                          }}
                          className="w-full text-left px-3 py-2.5 hover:bg-emerald-50 flex items-center justify-between gap-2 transition-colors group"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{item.emoji}</span>
                            <div>
                              <p className="text-xs font-bold text-gray-900 group-hover:text-emerald-700">
                                {item.name}
                              </p>
                              <p className="text-[11px] text-gray-500 truncate max-w-[180px]">
                                {item.description}
                              </p>
                            </div>
                          </div>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                              item.container === 'verde'
                                ? 'bg-emerald-100 text-emerald-800'
                                : item.container === 'blanco'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-200 text-gray-800'
                            }`}
                          >
                            {item.container === 'verde' ? 'Verde' : item.container === 'blanco' ? 'Blanco' : 'Negro'}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Perfiles Button */}
            <button
              type="button"
              onClick={() => {
                playSound('pop');
                onOpenProfileModal();
              }}
              title="Apartado de Perfiles (Descarga de base de datos)"
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white/15 hover:bg-white text-white hover:text-[#174D32] rounded-full text-xs font-bold border border-white/20 transition-all shadow-sm cursor-pointer"
            >
              <Users className="w-3.5 h-3.5 text-[#CFEF9D] group-hover:text-[#174D32]" />
              <span>Perfiles</span>
              {isAdmin && (
                <span className="w-2 h-2 rounded-full bg-[#81C784] animate-pulse" title="Acceso al perfil activo" />
              )}
            </button>

            {/* Audio Toggle */}
            <button
              type="button"
              onClick={toggleSound}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              title={soundOn ? 'Desactivar efectos de sonido' : 'Activar efectos de sonido'}
            >
              {soundOn ? <Volume2 className="w-4 h-4 text-[#CFEF9D]" /> : <VolumeX className="w-4 h-4 text-white/50" />}
            </button>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="xl:hidden w-9 h-9 rounded-full bg-white/15 flex items-center justify-center text-white"
              aria-label="Abrir menú"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="xl:hidden bg-[#174D32] border-t border-emerald-700/60 px-5 py-4 space-y-3 animate-in slide-in-from-top-4 duration-200">
            {/* Mobile search */}
            <div className="pb-2">
              <input
                type="text"
                placeholder="Buscar residuo..."
                value={searchQuery}
                onChange={(e) => handleSearchInput(e.target.value)}
                className="w-full bg-white/20 border border-white/30 rounded-xl px-3 py-2 text-sm text-white placeholder:text-white/60 focus:bg-white focus:text-gray-900 outline-none"
              />
            </div>

            <nav className="flex flex-col gap-2 font-medium text-sm">
              <a
                href="#inicio"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2 px-3 rounded-lg hover:bg-white/10 text-white"
              >
                Inicio
              </a>
              <a
                href="#recicla"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2 px-3 rounded-lg hover:bg-white/10 text-white"
              >
                ¿Por qué reciclar?
              </a>
              <a
                href="#contenedores"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2 px-3 rounded-lg hover:bg-white/10 text-white"
              >
                Los 3 Contenedores (Colombia)
              </a>
              <a
                href="#guias"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2 px-3 rounded-lg hover:bg-white/10 text-white"
              >
                Guías de Reciclaje
              </a>
              <a
                href="#separacion-fuente"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2 px-3 rounded-lg hover:bg-white/10 text-white"
              >
                Resolución 2184 & 9R
              </a>
              <a
                href="#calculadora"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2 px-3 rounded-lg hover:bg-white/10 text-white"
              >
                Calculadora de Impacto
              </a>
              <a
                href="#juego"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2 px-3 rounded-lg hover:bg-white/10 text-white flex items-center justify-between"
              >
                <span>🎮 Mini Juego Clasificador</span>
                <span className="text-xs bg-[#CFEF9D] text-[#123D2A] px-2 py-0.5 rounded-full font-bold">Interactivo</span>
              </a>
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenProfileModal();
                }}
                className="py-2.5 px-3 rounded-lg bg-white/15 text-white font-bold flex items-center justify-between text-left"
              >
                <span className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#CFEF9D]" />
                  <span>Perfiles</span>
                </span>
                <span className="text-xs bg-[#CFEF9D] text-[#123D2A] px-2 py-0.5 rounded-full font-bold">
                  {isAdmin ? 'Autorizado' : 'Ingresar'}
                </span>
              </button>

              <a
                href="#foro"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2.5 px-3 rounded-lg bg-white text-[#174D32] font-bold flex items-center justify-between shadow-md"
              >
                <span className="flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-emerald-600" />
                  Foro de Calificación & Opiniones (Público)
                </span>
                <span className="bg-[#174D32] text-white text-xs px-2 py-0.5 rounded-full">
                  ★ {averageRating}
                </span>
              </a>
            </nav>
          </div>
        )}
      </header>
    </>
  );
};
