import React from 'react';
import { WasteItem } from '../data/wasteData';
import { X, CheckCircle, Sparkles, AlertCircle } from 'lucide-react';
import { playSound } from '../utils/audio';

interface WasteDetailModalProps {
  item: WasteItem | null;
  onClose: () => void;
  onNavigateToContainer: (container: string) => void;
}

export const WasteDetailModal: React.FC<WasteDetailModalProps> = ({
  item,
  onClose,
  onNavigateToContainer,
}) => {
  if (!item) return null;

  const containerColorClass =
    item.container === 'verde'
      ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
      : item.container === 'blanco'
      ? 'bg-blue-100 text-blue-800 border-blue-300'
      : 'bg-gray-200 text-gray-800 border-gray-400';

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-[1700] animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 transition-colors"
          aria-label="Cerrar modal"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-4xl shadow-xs">
            {item.emoji}
          </div>
          <div>
            <h3 className="font-serif font-bold text-xl text-gray-900">
              {item.name}
            </h3>
            <span className={`inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full border mt-1 ${containerColorClass}`}>
              {item.containerName} · {item.category.toUpperCase()}
            </span>
          </div>
        </div>

        <p className="text-xs text-[#4A5A4E] leading-relaxed mb-4">
          {item.description}
        </p>

        <div className="space-y-3 mb-6">
          <div className="bg-[#F4FBF5] p-3.5 rounded-2xl border border-[#C5DDCB]/60">
            <h4 className="text-xs font-bold text-[#174D32] flex items-center gap-1.5 mb-1">
              <CheckCircle className="w-3.5 h-3.5 text-[#4CAF50]" />
              <span>¿Cómo prepararlo antes de desecharlo?</span>
            </h4>
            <p className="text-xs text-[#2E7D32]">
              {item.howToPrepare}
            </p>
          </div>

          <div className="bg-[#FFF9EF] p-3.5 rounded-2xl border border-amber-200">
            <h4 className="text-xs font-bold text-amber-900 flex items-center gap-1.5 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Impacto ambiental positivo</span>
            </h4>
            <p className="text-xs text-amber-800">
              {item.impactNote}
            </p>
          </div>
        </div>

        <div className="flex justify-between items-center pt-2 border-t border-gray-100">
          <button
            type="button"
            onClick={() => {
              playSound('pop');
              onNavigateToContainer(item.container);
              onClose();
            }}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-900 underline"
          >
            Ver más sobre el Contenedor {item.container} →
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-[#174D32] hover:bg-[#123D2A] text-white text-xs font-bold transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
