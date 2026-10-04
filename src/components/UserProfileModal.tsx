import React, { useState } from 'react';
import {
  Users,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  FileSpreadsheet,
  Database,
  Shield,
  LogOut,
  X,
  AlertCircle,
  Download,
  KeyRound,
  ShieldCheck
} from 'lucide-react';
import { playSound } from '../utils/audio';
import confetti from 'canvas-confetti';
import { DbMetrics } from '../db/embeddedDb';

export interface UserProfile {
  name: string;
  role: string;
}

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExportExcel: () => void;
  onOpenDbInspector: () => void;
  metrics: DbMetrics;
  isAdmin: boolean;
  onLoginSuccess: () => void;
  onLogout: () => void;
  onOpenPythonModal?: () => void;
}

const AUTHORIZED_PASSWORDS = ['eco2026', 'admin', 'admin123', 'reciclaje2026'];

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  onExportExcel,
  onOpenDbInspector,
  metrics,
  isAdmin,
  onLoginSuccess,
  onLogout,
  onOpenPythonModal,
}) => {
  const [selectedProfile, setSelectedProfile] = useState('Administrador de Base de Datos');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isShaking, setIsShaking] = useState(false);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPass = password.trim().toLowerCase();

    if (AUTHORIZED_PASSWORDS.includes(cleanPass)) {
      playSound('correct');
      try {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#107C41', '#4CAF50', '#81C784', '#CFEF9D'],
        });
      } catch {}
      setErrorMsg('');
      setPassword('');
      onLoginSuccess();
    } else {
      playSound('wrong');
      setErrorMsg('Contraseña incorrecta. Solo la persona autorizada con la clave puede ingresar a este perfil.');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  const handleDownloadExcel = async () => {
    playSound('pop');
    try {
      const res = await fetch('/api/export-excel');
      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ecoguia3r_reporte_python_${new Date().toISOString().slice(0, 10)}.xlsx`;
        a.click();
        URL.revokeObjectURL(url);
        return;
      }
    } catch {}
    onExportExcel();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-[1700] animate-in fade-in"
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative animate-in zoom-in-95 border border-[#C5DDCB] transition-transform ${
          isShaking ? 'animate-bounce' : ''
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors cursor-pointer"
          aria-label="Cerrar modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header: Perfiles */}
        <div className="flex items-center gap-3.5 mb-6 pb-4 border-b border-gray-100">
          <div className="w-12 h-12 rounded-2xl bg-[#E8F5E9] text-[#174D32] flex items-center justify-center font-bold shadow-xs">
            {isAdmin ? <ShieldCheck className="w-6 h-6 text-[#107C41]" /> : <Users className="w-6 h-6 text-[#2E7D32]" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-serif font-bold text-gray-900">
                Apartado de Perfiles
              </h3>
              {isAdmin && (
                <span className="text-[10px] bg-emerald-100 text-[#107C41] px-2 py-0.5 rounded-full font-extrabold border border-emerald-300">
                  Ingreso Autorizado
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500">
              {isAdmin
                ? 'Perfil activo para descargar la base de datos'
                : 'Acceso restringido para descargar la base de datos'}
            </p>
          </div>
        </div>

        {/* STATE 1: If NOT logged in -> Password login screen */}
        {!isAdmin ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Selecciona el Perfil
              </label>
              <div className="relative flex items-center">
                <Users className="w-4 h-4 text-gray-400 absolute left-3.5 pointer-events-none" />
                <select
                  value={selectedProfile}
                  onChange={(e) => setSelectedProfile(e.target.value)}
                  className="w-full bg-[#F4FBF5] border border-gray-300 rounded-xl pl-10 pr-3 py-2.5 text-sm text-gray-900 focus:border-emerald-500 focus:bg-white outline-none appearance-none font-medium"
                >
                  <option value="Administrador de Base de Datos">Administrador de Base de Datos</option>
                  <option value="Gestor Ambiental / Auditor">Gestor Ambiental / Auditor</option>
                  <option value="Superusuario EcoGuía3R">Superusuario EcoGuía3R</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Contraseña de acceso al perfil *
              </label>
              <div className="relative flex items-center">
                <KeyRound className="w-4 h-4 text-gray-400 absolute left-3.5 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoFocus
                  required
                  placeholder="Introduce la contraseña..."
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  className="w-full bg-[#F4FBF5] border border-gray-300 rounded-xl pl-10 pr-10 py-2.5 text-sm text-gray-900 focus:border-emerald-500 focus:bg-white outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-gray-400 hover:text-gray-600 focus:outline-none p-1 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-bold flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="pt-2 space-y-2">
              <button
                type="submit"
                className="w-full py-3 rounded-full bg-[#174D32] hover:bg-[#123D2A] text-white font-bold text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                <span>Ingresar al Perfil</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50 text-xs font-bold transition-colors cursor-pointer"
              >
                Cancelar
              </button>
            </div>
          </form>
        ) : (
          /* STATE 2: If LOGGED IN -> Authorized Profile view to download the database */
          <div className="space-y-5 animate-in fade-in">
            {/* Authorized banner */}
            <div className="bg-[#E8F5E9] p-4 rounded-2xl border border-[#81C784]/50 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white text-[#107C41] flex items-center justify-center shadow-xs shrink-0">
                <CheckCircle className="w-5 h-5 text-[#107C41]" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#174D32]">
                  Sesión Iniciada: {selectedProfile}
                </p>
                <p className="text-[11px] text-emerald-800">
                  Acceso habilitado para descargar la base de datos de calificaciones y registros.
                </p>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-gray-50 p-3 rounded-2xl border border-gray-200">
                <span className="text-[10px] uppercase font-bold text-gray-500 block">Total Registros</span>
                <span className="text-xl font-black text-gray-900">{metrics.totalReviews}</span>
              </div>
              <div className="bg-gray-50 p-3 rounded-2xl border border-gray-200">
                <span className="text-[10px] uppercase font-bold text-gray-500 block">Promedio Calificación</span>
                <span className="text-xl font-black text-amber-500">{metrics.averageRating} ★</span>
              </div>
            </div>

            {/* Main Action: Download Database in Excel */}
            <div className="space-y-3 pt-1">
              <button
                type="button"
                onClick={handleDownloadExcel}
                className="w-full py-3.5 px-4 rounded-2xl bg-[#107C41] hover:bg-[#0B5A2F] text-white font-bold text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                    <FileSpreadsheet className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="font-extrabold text-sm">Descargar Base de Datos en Excel</p>
                    <p className="text-[10px] text-emerald-100 font-normal">Reporte oficial estructurado (.xlsx)</p>
                  </div>
                </div>
                <Download className="w-4 h-4 text-white group-hover:translate-y-0.5 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => {
                  onOpenDbInspector();
                  onClose();
                }}
                className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-emerald-50 text-[#174D32] border border-[#C5DDCB] font-bold text-xs shadow-xs hover:shadow-md transition-all flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Database className="w-4 h-4 text-[#4A90E2]" />
                  <span>Explorar Registros IndexedDB y Respaldos</span>
                </div>
                <span className="text-xs group-hover:translate-x-1 transition-transform">→</span>
              </button>

              {onOpenPythonModal && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenPythonModal();
                  }}
                  className="w-full py-2.5 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-yellow-300 border border-slate-700 font-mono text-xs font-bold transition-all flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span>🐍</span>
                    <span>Ver Código Python del Backend (SQLite / OpenXML)</span>
                  </div>
                  <span className="text-xs group-hover:translate-x-1 transition-transform">→</span>
                </button>
              )}
            </div>

            {/* Logout button */}
            <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={onLogout}
                className="text-rose-600 hover:text-rose-800 font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Cerrar sesión de perfil</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 font-bold cursor-pointer"
              >
                Cerrar ventana
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
