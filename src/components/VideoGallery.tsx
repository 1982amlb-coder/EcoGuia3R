import React, { useState } from 'react';
import { Play, X, ExternalLink, Video } from 'lucide-react';
import { playSound } from '../utils/audio';

interface VideoItem {
  id: string;
  title: string;
  desc: string;
  category: string;
  thumbBg: string;
  accent: string;
  watchUrl: string;
}

const VIDEOS: VideoItem[] = [
  {
    id: 'vid-1',
    title: '¿Cómo separar residuos?',
    desc: 'Un recorrido rápido y práctico por el proceso de separación desde la cocina y el patio de casa.',
    category: 'Práctica diaria',
    thumbBg: 'from-[#E8F5E9] to-[#C8E6C9]',
    accent: '#4CAF50',
    watchUrl: 'https://notebook.google.com/notebook/00d92e22-d558-45b8-a38a-75fa738f1660/artifact/f8f4a2b2-d09b-4c8c-98cc-1d5667a48f4f?utm_source=nlm_web_share&utm_medium=google_oo&utm_campaign=art_share_1&utm_content=&utm_smc=nlm_web_share_google_oo_art_share_1_',
  },
  {
    id: 'vid-2',
    title: 'Tipos de contenedores en Colombia',
    desc: 'Conoce en detalle el uso técnico y los materiales permitidos para las canecas blanca, verde y negra.',
    category: 'Normativa 2184',
    thumbBg: 'from-[#E3F2FD] to-[#BBDEFB]',
    accent: '#4A90E2',
    watchUrl: 'https://notebook.google.com/notebook/00d92e22-d558-45b8-a38a-75fa738f1660/artifact/4f4844ab-c091-4782-909c-68c052ad3a1d?utm_source=nlm_web_share&utm_medium=google_oo&utm_campaign=art_share_1&utm_content=&utm_smc=nlm_web_share_google_oo_art_share_1_',
  },
  {
    id: 'vid-3',
    title: 'Consejos clave para reciclar con éxito',
    desc: 'Buenas prácticas para mantener el hábito de reciclaje con orden, limpieza y sin malos olores.',
    category: 'Cultura ciudadana',
    thumbBg: 'from-[#FFF4E0] to-[#FFE0B2]',
    accent: '#F5A623',
    watchUrl: 'https://notebook.google.com/notebook/00d92e22-d558-45b8-a38a-75fa738f1660/artifact/b1e4da9b-d250-4539-be76-fe6e9a939f29?utm_source=nlm_web_share&utm_medium=google_oo&utm_campaign=art_share_1&utm_content=&utm_smc=nlm_web_share_google_oo_art_share_1_',
  }
];

export const VideoGallery: React.FC = () => {
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);

  const openVideo = (v: VideoItem) => {
    playSound('pop');
    setActiveVideo(v);
  };

  const closeVideo = () => {
    setActiveVideo(null);
  };

  return (
    <section className="max-w-[1240px] mx-auto px-4 sm:px-6 py-16" id="videos">
      <div className="max-w-2xl mb-10">
        <p className="text-xs font-bold uppercase tracking-widest text-[#7E6BC4] mb-2">
          Aprende viendo
        </p>
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1F2E24] tracking-tight">
          Galería de videos educativos
        </h2>
        <p className="text-[#4A5A4E] text-base mt-2 leading-relaxed">
          Recursos audiovisuales diseñados para reforzar los conceptos de reciclaje y separación de forma entretenida.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {VIDEOS.map((vid) => (
          <div
            key={vid.id}
            className="bg-white rounded-3xl p-5 border border-[#C5DDCB] shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group"
          >
            <div>
              {/* Thumbnail Container */}
              <div
                onClick={() => openVideo(vid)}
                className={`w-full h-44 rounded-2xl bg-gradient-to-br ${vid.thumbBg} flex items-center justify-center relative overflow-hidden cursor-pointer mb-5 shadow-xs`}
              >
                {/* Decorative preview illustration */}
                <div className="absolute inset-0 flex items-center justify-center opacity-40">
                  <Video className="w-24 h-24 text-gray-700/20" />
                </div>

                {/* Play Button */}
                <div className="w-14 h-14 rounded-full bg-white text-emerald-800 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform relative z-10">
                  <Play className="w-6 h-6 fill-emerald-800 ml-0.5" />
                </div>

                <span className="absolute bottom-3 left-3 bg-white/90 text-gray-800 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-2xs">
                  {vid.category}
                </span>
              </div>

              <h3 className="font-serif font-bold text-lg text-[#1F2E24] mb-2 group-hover:text-emerald-700 transition-colors">
                {vid.title}
              </h3>
              <p className="text-xs text-[#4A5A4E] leading-relaxed mb-4">
                {vid.desc}
              </p>
            </div>

            <button
              type="button"
              onClick={() => openVideo(vid)}
              className="w-full py-2.5 px-4 rounded-xl border border-emerald-600 text-emerald-700 font-bold text-xs hover:bg-emerald-50 transition-colors flex items-center justify-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 fill-emerald-700" />
              <span>Ver video educativo</span>
            </button>
          </div>
        ))}
      </div>

      {/* Video Modal */}
      {activeVideo && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-[1500] animate-in fade-in"
          onClick={closeVideo}
        >
          <div
            className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={closeVideo}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 transition-colors"
              aria-label="Cerrar modal"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                Video educativo
              </span>
            </div>

            <h3 className="text-xl font-serif font-bold text-[#1F2E24] mb-2">
              {activeVideo.title}
            </h3>
            <p className="text-xs text-[#4A5A4E] mb-6">
              {activeVideo.desc}
            </p>

            {/* Video preview frame with external link */}
            <div className="aspect-video bg-gray-900 rounded-2xl flex flex-col items-center justify-center p-6 text-center text-white relative overflow-hidden shadow-inner">
              <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center mb-3">
                <Play className="w-7 h-7 fill-white ml-0.5" />
              </div>
              <p className="text-xs text-white/80 max-w-xs mb-4">
                Este video educativo se encuentra alojado y optimizado en Google NotebookLM.
              </p>
              <a
                href={activeVideo.watchUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => playSound('pop')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#4CAF50] hover:bg-[#2E7D32] text-white font-bold text-xs shadow-md transition-colors"
              >
                <span>Reproducir video en pestaña nueva</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={closeVideo}
                className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
