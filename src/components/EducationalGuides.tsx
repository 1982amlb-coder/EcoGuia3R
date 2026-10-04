import React, { useState } from 'react';
import { Check, ShieldCheck, Sparkles, AlertTriangle, Home } from 'lucide-react';
import { playSound } from '../utils/audio';

export const EducationalGuides: React.FC = () => {
  const [completedSteps, setCompletedSteps] = useState<{ [key: string]: boolean }>({});

  const toggleStep = (stepKey: string) => {
    playSound('pop');
    setCompletedSteps(prev => ({
      ...prev,
      [stepKey]: !prev[stepKey]
    }));
  };

  return (
    <section className="max-w-[1240px] mx-auto px-4 sm:px-6 py-16" id="guias">
      <div className="max-w-2xl mb-12">
        <p className="text-xs font-bold uppercase tracking-widest text-[#FF6F59] mb-2">
          Paso a paso interactivo
        </p>
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1F2E24] tracking-tight">
          Guías para reciclar correctamente
        </h2>
        <p className="text-[#4A5A4E] text-base sm:text-lg mt-3 leading-relaxed">
          Cuatro guías breves e interactivas para despejar las dudas más frecuentes al momento de separar.
          Marca los pasos para comprobar tu rutina en casa.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Guía 1 */}
        <div className="bg-gradient-to-b from-white to-[#F4FBF5] rounded-2xl p-6 border border-[#C5DDCB] shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#2E7D32] flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-[#4CAF50]" />
              </div>
              <span className="font-serif font-bold text-xs bg-emerald-100 text-[#2E7D32] px-3 py-1 rounded-full">
                01
              </span>
            </div>
            <h3 className="font-serif font-bold text-lg text-[#1F2E24] mb-3">
              ¿Cómo separar los residuos?
            </h3>
            <ol className="space-y-3 text-xs text-[#4A5A4E]">
              {[
                'Identifica el tipo de residuo (orgánico, aprovechable o no aprovechable).',
                'Deposítalo en su contenedor: verde, blanco o negro.',
                'Evita a toda costa mezclar residuos húmedos con papel o cartón.'
              ].map((step, idx) => {
                const k = `g1-${idx}`;
                const isDone = !!completedSteps[k];
                return (
                  <li
                    key={idx}
                    onClick={() => toggleStep(k)}
                    className={`p-2 rounded-xl border cursor-pointer transition-all flex items-start gap-2 ${
                      isDone
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-900 line-through opacity-75'
                        : 'bg-white border-gray-100 hover:border-emerald-200'
                    }`}
                  >
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-[10px] ${
                      isDone ? 'bg-emerald-600 text-white' : 'border border-gray-300'
                    }`}>
                      {isDone && <Check className="w-3 h-3" />}
                    </span>
                    <span>{step}</span>
                  </li>
                );
              })}
            </ol>
          </div>
          <p className="text-[11px] text-[#2E7D32] font-semibold mt-4 text-center">
            Toca cada paso para marcar como verificado ✓
          </p>
        </div>

        {/* Guía 2 */}
        <div className="bg-gradient-to-b from-white to-[#F0F7FF] rounded-2xl p-6 border border-[#C5DDCB] shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-[#2F5FA3] flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-[#4A90E2]" />
              </div>
              <span className="font-serif font-bold text-xs bg-blue-100 text-[#2F5FA3] px-3 py-1 rounded-full">
                02
              </span>
            </div>
            <h3 className="font-serif font-bold text-lg text-[#1F2E24] mb-3">
              ¿Cómo preparar un envase?
            </h3>
            <ol className="space-y-3 text-xs text-[#4A5A4E]">
              {[
                'Vacía por completo el contenido líquido o viscoso.',
                'Enjuaga con un chorrito leve de agua usada para evitar olores.',
                'Separa tapas o sellos si están hechos de otro material.',
                'Compacta o aplana para ahorrar espacio y deposita en blanco.'
              ].map((step, idx) => {
                const k = `g2-${idx}`;
                const isDone = !!completedSteps[k];
                return (
                  <li
                    key={idx}
                    onClick={() => toggleStep(k)}
                    className={`p-2 rounded-xl border cursor-pointer transition-all flex items-start gap-2 ${
                      isDone
                        ? 'bg-blue-50 border-blue-300 text-blue-900 line-through opacity-75'
                        : 'bg-white border-gray-100 hover:border-blue-200'
                    }`}
                  >
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-[10px] ${
                      isDone ? 'bg-blue-600 text-white' : 'border border-gray-300'
                    }`}>
                      {isDone && <Check className="w-3 h-3" />}
                    </span>
                    <span>{step}</span>
                  </li>
                );
              })}
            </ol>
          </div>
          <p className="text-[11px] text-[#2F5FA3] font-semibold mt-4 text-center">
            Regla de oro: limpio, seco y separado
          </p>
        </div>

        {/* Guía 3 */}
        <div className="bg-gradient-to-b from-white to-[#FFF5F3] rounded-2xl p-6 border border-[#C5DDCB] shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-[#FF6F59] flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-[#FF6F59]" />
              </div>
              <span className="font-serif font-bold text-xs bg-rose-100 text-[#FF6F59] px-3 py-1 rounded-full">
                03
              </span>
            </div>
            <h3 className="font-serif font-bold text-lg text-[#1F2E24] mb-3">
              Errores comunes al reciclar
            </h3>
            <ul className="space-y-3 text-xs text-[#4A5A4E]">
              {[
                'Mezclar restos de comida con papel o plástico aprovechable.',
                'Tirar la caja de pizza grasosa a la caneca blanca.',
                'Dejar botellas con líquidos dentro en la bolsa blanca.',
                'Creer que las servilletas sucias pueden reciclarse.'
              ].map((step, idx) => {
                const k = `g3-${idx}`;
                const isDone = !!completedSteps[k];
                return (
                  <li
                    key={idx}
                    onClick={() => toggleStep(k)}
                    className={`p-2 rounded-xl border cursor-pointer transition-all flex items-start gap-2 ${
                      isDone
                        ? 'bg-rose-50 border-rose-300 text-rose-900 opacity-75'
                        : 'bg-white border-gray-100 hover:border-rose-200'
                    }`}
                  >
                    <span className="text-rose-500 font-bold">✕</span>
                    <span>{step}</span>
                  </li>
                );
              })}
            </ul>
          </div>
          <p className="text-[11px] text-[#FF6F59] font-semibold mt-4 text-center">
            Evita arruinar todo el cargamento reciclable
          </p>
        </div>

        {/* Guía 4 */}
        <div className="bg-gradient-to-b from-white to-[#F8F5FF] rounded-2xl p-6 border border-[#C5DDCB] shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-[#7E6BC4] flex items-center justify-center">
                <Home className="w-6 h-6 text-[#7E6BC4]" />
              </div>
              <span className="font-serif font-bold text-xs bg-purple-100 text-[#7E6BC4] px-3 py-1 rounded-full">
                04
              </span>
            </div>
            <h3 className="font-serif font-bold text-lg text-[#1F2E24] mb-3">
              Consejos prácticos para casa
            </h3>
            <ul className="space-y-3 text-xs text-[#4A5A4E]">
              {[
                'Dispón de tres recipientes o bolsas bien rotuladas en la cocina.',
                'Establece un rincón limpio para cajas aplanadas.',
                'Involucra a los niños con retos de clasificación diaria.',
                'Conoce los días y horarios del reciclador de tu barrio.'
              ].map((step, idx) => {
                const k = `g4-${idx}`;
                const isDone = !!completedSteps[k];
                return (
                  <li
                    key={idx}
                    onClick={() => toggleStep(k)}
                    className={`p-2 rounded-xl border cursor-pointer transition-all flex items-start gap-2 ${
                      isDone
                        ? 'bg-purple-50 border-purple-300 text-purple-900 line-through opacity-75'
                        : 'bg-white border-gray-100 hover:border-purple-200'
                    }`}
                  >
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-[10px] ${
                      isDone ? 'bg-purple-600 text-white' : 'border border-gray-300'
                    }`}>
                      {isDone && <Check className="w-3 h-3" />}
                    </span>
                    <span>{step}</span>
                  </li>
                );
              })}
            </ul>
          </div>
          <p className="text-[11px] text-[#7E6BC4] font-semibold mt-4 text-center">
            Convierte la separación en un hábito familiar
          </p>
        </div>

      </div>
    </section>
  );
};
