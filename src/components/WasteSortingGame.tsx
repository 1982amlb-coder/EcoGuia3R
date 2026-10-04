import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { WASTE_ITEMS, WasteItem } from '../data/wasteData';
import { RotateCcw, Trophy, Flame, CheckCircle, XCircle } from 'lucide-react';
import { playSound } from '../utils/audio';

export const WasteSortingGame: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [points, setPoints] = useState<number>(0);
  const [classifiedCount, setClassifiedCount] = useState<number>(0);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [wrongCount, setWrongCount] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [bestStreak, setBestStreak] = useState<number>(0);
  const [feedback, setFeedback] = useState<{ message: string; isCorrect: boolean } | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [activeBinHover, setActiveBinHover] = useState<'verde' | 'blanco' | 'negro' | null>(null);

  const currentItem: WasteItem = WASTE_ITEMS[currentIndex % WASTE_ITEMS.length];

  const pickNextItem = () => {
    setCurrentIndex((prev) => (prev + 1) % WASTE_ITEMS.length);
    setFeedback(null);
  };

  const handleClassify = (selectedBin: 'verde' | 'blanco' | 'negro') => {
    if (!currentItem) return;

    const isCorrect = selectedBin === currentItem.container;
    setClassifiedCount((prev) => prev + 1);

    if (isCorrect) {
      playSound('correct');
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > bestStreak) setBestStreak(newStreak);

      const bonusPoints = newStreak >= 3 ? 15 : 10;
      setPoints((prev) => prev + bonusPoints);
      setCorrectCount((prev) => prev + 1);

      setFeedback({
        message: `¡Correcto! ${currentItem.name} va en el contenedor ${selectedBin} porque ${currentItem.description.toLowerCase()}`,
        isCorrect: true,
      });

      // Confetti burst
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#4CAF50', '#81C784', '#CFEF9D', '#4A90E2'],
        });
      } catch {
        // fallback
      }
    } else {
      playSound('wrong');
      setStreak(0);
      setWrongCount((prev) => prev + 1);

      setFeedback({
        message: `Incorrecto. ${currentItem.name} pertenece al contenedor ${currentItem.container} (${currentItem.category}). ${currentItem.howToPrepare}`,
        isCorrect: false,
      });
    }

    // Auto next after 1.5s
    setTimeout(() => {
      pickNextItem();
    }, 1500);
  };

  const restartGame = () => {
    playSound('pop');
    setPoints(0);
    setClassifiedCount(0);
    setCorrectCount(0);
    setWrongCount(0);
    setStreak(0);
    setFeedback(null);
    setCurrentIndex(Math.floor(Math.random() * WASTE_ITEMS.length));
  };

  return (
    <section className="max-w-[1240px] mx-auto px-4 sm:px-6 py-16" id="juego">
      <div className="max-w-2xl mb-8">
        <p className="text-xs font-bold uppercase tracking-widest text-[#F5A623] mb-2">
          Pon a prueba lo aprendido
        </p>
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1F2E24] tracking-tight">
          🎮 ¡Clasifica el residuo!
        </h2>
        <p className="text-[#4A5A4E] text-base mt-2 leading-relaxed">
          Arrastra el residuo hacia la caneca correcta o <strong>haz clic en el contenedor</strong> donde debe ir. 
          ¡Construye rachas de aciertos para ganar puntos extra!
        </p>
      </div>

      {/* Scoreboard */}
      <div className="flex flex-wrap items-center gap-3 mb-8">
        <div className="bg-white px-4 py-2 rounded-full border border-[#C5DDCB] shadow-xs text-xs font-bold flex items-center gap-1.5 text-gray-700">
          <Trophy className="w-4 h-4 text-amber-500" />
          <span>Puntos:</span>
          <span className="text-emerald-700 font-extrabold text-sm">{points}</span>
        </div>

        <div className="bg-white px-4 py-2 rounded-full border border-[#C5DDCB] shadow-xs text-xs font-bold flex items-center gap-1.5 text-gray-700">
          <span>Clasificados:</span>
          <span className="text-[#2F5FA3] font-extrabold text-sm">{classifiedCount}</span>
        </div>

        <div className="bg-white px-4 py-2 rounded-full border border-[#C5DDCB] shadow-xs text-xs font-bold flex items-center gap-1.5 text-emerald-700">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>Aciertos:</span>
          <span className="font-extrabold text-sm">{correctCount}</span>
        </div>

        <div className="bg-white px-4 py-2 rounded-full border border-[#C5DDCB] shadow-xs text-xs font-bold flex items-center gap-1.5 text-rose-700">
          <XCircle className="w-4 h-4 text-rose-600" />
          <span>Errores:</span>
          <span className="font-extrabold text-sm">{wrongCount}</span>
        </div>

        {streak >= 2 && (
          <div className="bg-amber-100 text-amber-900 px-3.5 py-1.5 rounded-full border border-amber-300 text-xs font-black flex items-center gap-1 animate-bounce">
            <Flame className="w-4 h-4 text-amber-600 fill-amber-600" />
            <span>¡Racha x{streak}! (+Bonus)</span>
          </div>
        )}
      </div>

      {/* Game board */}
      <div className="bg-gradient-to-br from-white via-[#F4FBF5] to-[#E3F1E6] rounded-3xl p-6 sm:p-10 border border-[#C5DDCB] shadow-xl relative overflow-hidden">
        
        {/* Background icon watermark */}
        <span className="absolute -top-6 -right-6 text-9xl text-emerald-900/5 select-none font-bold">
          ♻
        </span>

        {/* Current Waste Stage */}
        <div className="flex flex-col items-center justify-center mb-10 text-center relative z-10">
          
          <div
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData('text/plain', currentItem.container);
              setIsDragging(true);
            }}
            onDragEnd={() => setIsDragging(false)}
            className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-white border-4 border-[#81C784] shadow-lg flex items-center justify-center text-5xl sm:text-6xl cursor-grab active:cursor-grabbing hover:scale-105 transition-all select-none ${
              isDragging ? 'opacity-40 scale-95' : 'animate-float'
            }`}
          >
            {currentItem.emoji}
          </div>

          <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#1F2E24] mt-4">
            {currentItem.name}
          </h3>

          <p className="text-xs text-[#4A5A4E] max-w-sm mt-1">
            {currentItem.description}
          </p>

          <span className="text-[11px] text-[#2E7D32] bg-[#E8F5E9] px-3 py-1 rounded-full font-bold mt-2">
            Tip: Arrastra hacia una caneca o tócala directamente
          </span>
        </div>

        {/* 3 Interactive Drop Bins */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 relative z-10">
          
          {/* Bin Verde */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setActiveBinHover('verde');
            }}
            onDragLeave={() => setActiveBinHover(null)}
            onDrop={(e) => {
              e.preventDefault();
              setActiveBinHover(null);
              handleClassify('verde');
            }}
            onClick={() => handleClassify('verde')}
            className={`cursor-pointer rounded-2xl p-6 text-center border-2 border-dashed transition-all duration-200 select-none ${
              activeBinHover === 'verde'
                ? 'bg-[#E8F5E9] border-[#4CAF50] scale-105 shadow-lg'
                : 'bg-white/80 border-[#81C784]/60 hover:bg-[#E8F5E9] hover:border-[#4CAF50]'
            }`}
          >
            <div className="text-4xl mb-2">🟢</div>
            <h4 className="font-serif font-bold text-base text-[#123D2A]">
              Verde (Orgánicos)
            </h4>
            <p className="text-xs text-[#2E7D32] mt-1">
              Frutas, verduras, podas, borra
            </p>
          </div>

          {/* Bin Blanco */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setActiveBinHover('blanco');
            }}
            onDragLeave={() => setActiveBinHover(null)}
            onDrop={(e) => {
              e.preventDefault();
              setActiveBinHover(null);
              handleClassify('blanco');
            }}
            onClick={() => handleClassify('blanco')}
            className={`cursor-pointer rounded-2xl p-6 text-center border-2 border-dashed transition-all duration-200 select-none ${
              activeBinHover === 'blanco'
                ? 'bg-blue-50 border-[#4A90E2] scale-105 shadow-lg'
                : 'bg-white/80 border-gray-300 hover:bg-blue-50 hover:border-[#4A90E2]'
            }`}
          >
            <div className="text-4xl mb-2">⚪</div>
            <h4 className="font-serif font-bold text-base text-[#123D2A]">
              Blanco (Aprovechables)
            </h4>
            <p className="text-xs text-[#2F5FA3] mt-1">
              Plástico, cartón, vidrio, metal
            </p>
          </div>

          {/* Bin Negro */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setActiveBinHover('negro');
            }}
            onDragLeave={() => setActiveBinHover(null)}
            onDrop={(e) => {
              e.preventDefault();
              setActiveBinHover(null);
              handleClassify('negro');
            }}
            onClick={() => handleClassify('negro')}
            className={`cursor-pointer rounded-2xl p-6 text-center border-2 border-dashed transition-all duration-200 select-none ${
              activeBinHover === 'negro'
                ? 'bg-gray-100 border-gray-800 scale-105 shadow-lg'
                : 'bg-white/80 border-gray-300 hover:bg-gray-100 hover:border-gray-800'
            }`}
          >
            <div className="text-4xl mb-2">⚫</div>
            <h4 className="font-serif font-bold text-base text-[#123D2A]">
              Negro (No aprovechables)
            </h4>
            <p className="text-xs text-gray-600 mt-1">
              Servilletas, papel higiénico, grasa
            </p>
          </div>
        </div>

        {/* Feedback Display */}
        {feedback && (
          <div
            className={`mt-6 p-4 rounded-2xl text-center text-sm font-bold border transition-all animate-in fade-in duration-200 ${
              feedback.isCorrect
                ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                : 'bg-rose-100 text-rose-900 border-rose-300'
            }`}
          >
            {feedback.message}
          </div>
        )}

        {/* Controls */}
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={restartGame}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-white hover:bg-emerald-50 text-[#174D32] border border-[#C5DDCB] font-bold text-xs shadow-xs hover:shadow-md transition-all active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reiniciar juego</span>
          </button>
        </div>
      </div>
    </section>
  );
};
