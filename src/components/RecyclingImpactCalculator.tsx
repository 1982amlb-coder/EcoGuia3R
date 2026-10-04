import React, { useState } from 'react';
import { Calculator, Droplets, CloudRain, Trees, Zap, RefreshCw } from 'lucide-react';
import { playSound } from '../utils/audio';

export const RecyclingImpactCalculator: React.FC = () => {
  const [plasticBottles, setPlasticBottles] = useState<number>(10);
  const [paperKg, setPaperKg] = useState<number>(5);
  const [cans, setCans] = useState<number>(8);
  const [organicsKg, setOrganicsKg] = useState<number>(6);

  // Environmental impact formulas (scientific estimates)
  // 1 plastic bottle: ~0.08 kWh energy, ~0.05 kg CO2, ~0.8 L water
  // 1 kg paper: ~26 L water, ~0.9 kg CO2, ~0.017 trees
  // 1 aluminum can: ~0.2 kWh energy (95% savings), ~0.15 kg CO2
  // 1 kg organics composted: ~0.5 kg CO2 equivalent avoided from methane in landfill
  const totalWaterSavedLiters = Math.round(plasticBottles * 0.8 + paperKg * 26 + cans * 2);
  const totalCo2AvoidedKg = parseFloat(
    (plasticBottles * 0.05 + paperKg * 0.9 + cans * 0.15 + organicsKg * 0.5).toFixed(1)
  );
  const totalTreesSaved = parseFloat((paperKg * 0.017).toFixed(2));
  const energyKwhSaved = Math.round(plasticBottles * 0.08 + cans * 0.2 + paperKg * 0.5);

  const handleSliderChange = (setter: React.Dispatch<React.SetStateAction<number>>, val: number) => {
    setter(val);
    playSound('pop');
  };

  const handleReset = () => {
    playSound('pop');
    setPlasticBottles(10);
    setPaperKg(5);
    setCans(8);
    setOrganicsKg(6);
  };

  return (
    <section className="max-w-[1240px] mx-auto px-4 sm:px-6 py-16" id="calculadora">
      <div className="bg-gradient-to-br from-[#FFFFFF] via-[#F4FBF5] to-[#E8F5E9] rounded-3xl p-6 sm:p-10 border border-[#C5DDCB] shadow-xl relative overflow-hidden">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#2E7D32] bg-[#E8F5E9] px-3 py-1 rounded-full flex items-center gap-1.5 w-fit mb-2">
              <Calculator className="w-3.5 h-3.5" />
              <span>Simulador interactivo</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1F2E24]">
              Calculadora de Impacto Ambiental Semanal
            </h2>
            <p className="text-sm text-[#4A5A4E] mt-1 max-w-xl">
              Mueve los controles según los residuos que separas en tu hogar cada semana y descubre tu aporte tangible a la naturaleza.
            </p>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs font-bold text-[#2E7D32] hover:text-[#174D32] bg-white border border-[#C5DDCB] px-3.5 py-2 rounded-full self-start md:self-auto hover:bg-[#E8F5E9] transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Restablecer valores</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Sliders Area (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Slider 1: Botellas */}
            <div className="bg-white/80 p-4 rounded-2xl border border-[#C5DDCB]/60 shadow-2xs">
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-[#1F2E24] flex items-center gap-2">
                  <span className="text-lg">🧴</span>
                  <span>Botellas plásticas vacías (PET)</span>
                </label>
                <span className="text-sm font-black text-[#4CAF50] bg-[#E8F5E9] px-2.5 py-0.5 rounded-full">
                  {plasticBottles} unid / semana
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                value={plasticBottles}
                onChange={(e) => handleSliderChange(setPlasticBottles, Number(e.target.value))}
                className="w-full accent-[#4CAF50] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                <span>0</span>
                <span>25 botellas</span>
                <span>50 botellas</span>
              </div>
            </div>

            {/* Slider 2: Cartón y Papel */}
            <div className="bg-white/80 p-4 rounded-2xl border border-[#C5DDCB]/60 shadow-2xs">
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-[#1F2E24] flex items-center gap-2">
                  <span className="text-lg">📦</span>
                  <span>Papel y cartón limpios y secos</span>
                </label>
                <span className="text-sm font-black text-[#4A90E2] bg-blue-50 px-2.5 py-0.5 rounded-full">
                  {paperKg} kg / semana
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="30"
                value={paperKg}
                onChange={(e) => handleSliderChange(setPaperKg, Number(e.target.value))}
                className="w-full accent-[#4A90E2] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                <span>0 kg</span>
                <span>15 kg</span>
                <span>30 kg</span>
              </div>
            </div>

            {/* Slider 3: Latas de aluminio */}
            <div className="bg-white/80 p-4 rounded-2xl border border-[#C5DDCB]/60 shadow-2xs">
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-[#1F2E24] flex items-center gap-2">
                  <span className="text-lg">🥫</span>
                  <span>Latas de aluminio y conservas</span>
                </label>
                <span className="text-sm font-black text-[#F5A623] bg-amber-50 px-2.5 py-0.5 rounded-full">
                  {cans} latas / semana
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="40"
                value={cans}
                onChange={(e) => handleSliderChange(setCans, Number(e.target.value))}
                className="w-full accent-[#F5A623] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                <span>0</span>
                <span>20 latas</span>
                <span>40 latas</span>
              </div>
            </div>

            {/* Slider 4: Orgánicos */}
            <div className="bg-white/80 p-4 rounded-2xl border border-[#C5DDCB]/60 shadow-2xs">
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-[#1F2E24] flex items-center gap-2">
                  <span className="text-lg">🍃</span>
                  <span>Orgánicos aprovechados o compostados</span>
                </label>
                <span className="text-sm font-black text-[#26A69A] bg-teal-50 px-2.5 py-0.5 rounded-full">
                  {organicsKg} kg / semana
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="30"
                value={organicsKg}
                onChange={(e) => handleSliderChange(setOrganicsKg, Number(e.target.value))}
                className="w-full accent-[#26A69A] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                <span>0 kg</span>
                <span>15 kg</span>
                <span>30 kg</span>
              </div>
            </div>

          </div>

          {/* Impact Stats Display (5 cols) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#174D32] to-[#123D2A] text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col justify-between space-y-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#CFEF9D]">
                Tu huella positiva anual proyectada
              </span>
              <h3 className="font-serif font-bold text-xl text-white mt-1">
                Beneficios ecológicos directos
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              
              {/* Stat 1: Agua */}
              <div className="bg-white/10 p-3.5 rounded-2xl border border-white/15">
                <div className="flex items-center gap-1.5 text-[#CFEF9D] mb-1">
                  <Droplets className="w-4 h-4" />
                  <span className="text-[11px] font-bold">Agua ahorrada</span>
                </div>
                <p className="text-2xl font-serif font-extrabold text-white">
                  {(totalWaterSavedLiters * 52).toLocaleString()} L
                </p>
                <span className="text-[10px] text-white/70">
                  {totalWaterSavedLiters} L cada semana
                </span>
              </div>

              {/* Stat 2: CO2 */}
              <div className="bg-white/10 p-3.5 rounded-2xl border border-white/15">
                <div className="flex items-center gap-1.5 text-[#CFEF9D] mb-1">
                  <CloudRain className="w-4 h-4" />
                  <span className="text-[11px] font-bold">CO₂ evitado</span>
                </div>
                <p className="text-2xl font-serif font-extrabold text-white">
                  {(totalCo2AvoidedKg * 52).toFixed(0)} kg
                </p>
                <span className="text-[10px] text-white/70">
                  {totalCo2AvoidedKg} kg cada semana
                </span>
              </div>

              {/* Stat 3: Árboles */}
              <div className="bg-white/10 p-3.5 rounded-2xl border border-white/15">
                <div className="flex items-center gap-1.5 text-[#CFEF9D] mb-1">
                  <Trees className="w-4 h-4" />
                  <span className="text-[11px] font-bold">Árboles preservados</span>
                </div>
                <p className="text-2xl font-serif font-extrabold text-white">
                  {(totalTreesSaved * 52).toFixed(1)}
                </p>
                <span className="text-[10px] text-white/70">
                  equiv. en celulosa
                </span>
              </div>

              {/* Stat 4: Energía */}
              <div className="bg-white/10 p-3.5 rounded-2xl border border-white/15">
                <div className="flex items-center gap-1.5 text-[#CFEF9D] mb-1">
                  <Zap className="w-4 h-4" />
                  <span className="text-[11px] font-bold">Energía limpia</span>
                </div>
                <p className="text-2xl font-serif font-extrabold text-white">
                  {(energyKwhSaved * 52).toLocaleString()} kWh
                </p>
                <span className="text-[10px] text-white/70">
                  {energyKwhSaved} kWh por semana
                </span>
              </div>
            </div>

            <div className="p-3 bg-white/10 rounded-xl border border-white/15 text-[11px] text-[#CFEF9D] leading-relaxed">
              💡 <em>¿Sabías que?</em> Reciclar 1 sola lata de aluminio ahorra la energía suficiente para mantener encendido un televisor durante 3 horas completas.
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
