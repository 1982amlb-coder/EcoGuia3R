import React, { useState } from 'react';
import { ChevronDown, Sparkles, AlertOctagon, Heart, Coffee, Building, Award, Check } from 'lucide-react';
import { playSound } from '../utils/audio';

export const SourceSeparationGuide: React.FC = () => {
  const [openAccordion, setOpenAccordion] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    playSound('pop');
    setOpenAccordion(openAccordion === index ? null : index);
  };

  const ACCORDION_ITEMS = [
    {
      title: 'Depositar materiales sucios o con líquidos en la bolsa blanca',
      desc: 'Un solo envase con restos de yogur, gaseosa o aceite puede mojar y arruinar kilogramos de papel y cartón que ya estaban impecables en la misma saca, transformando un lote aprovechable en basura.'
    },
    {
      title: 'Reciclar papel o cartón mojado o engrasado (ej. caja de pizza)',
      desc: 'La grasa y la humedad rompen y disuelven los enlaces de celulosa del cartón. Una vez contaminadas con aceite de queso o salsa, las fibras pierden toda capacidad de repulpado industrial.'
    },
    {
      title: 'No diferenciar los residuos orgánicos de los secos',
      desc: 'Mezclar cáscaras de fruta húmedas con plásticos o papeles crea pudrición inmediata, genera lixiviados con malos olores y atrae vectores de infección, imposibilitando la labor de separación.'
    },
    {
      title: 'No vaciar ni escurrir los envases antes de desecharlos',
      desc: 'Los residuos líquidos aumentan el peso innecesariamente, atraen plagas y pueden fermentar dentro de las pacas de reciclaje almacenadas en las bodegas de acopio.'
    },
    {
      title: 'Depositar residuos peligrosos o biológicos en canecas comunes',
      desc: 'Pilas, medicamentos vencidos, jeringas y bombillos fluorescentes contienen metales pesados (mercurio, plomo) y agentes patógenos. Deben entregarse en puntos posconsumo autorizados, nunca en la bolsa blanca ni verde.'
    }
  ];

  return (
    <section className="bg-[#F4F1EA] py-20 px-4 sm:px-6 text-[#1E2522] border-y border-[#EFE6D8]" id="separacion-fuente">
      <div className="max-w-[1180px] mx-auto">
        
        {/* Intro */}
        <header className="max-w-3xl mx-auto text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#4A6B53] bg-[#DCE6DE] px-3.5 py-1.5 rounded-full inline-block mb-3">
            Normativa colombiana &bull; Economía circular
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#1E2522] tracking-tight">
            Guía de Sostenibilidad y Separación en la Fuente
          </h2>
          <p className="text-[#4B534E] text-base sm:text-lg mt-4 leading-relaxed">
            Un análisis profundo del marco legal que rige el reciclaje en Colombia y de cómo la separación cotidiana
            se articula con un modelo regenerativo de economía circular.
          </p>
        </header>

        {/* 1. Contexto normativo + 9R */}
        <div className="mb-20 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#FDFCF9] rounded-3xl p-8 border border-[#EFE6D8] shadow-sm">
              <span className="inline-block text-xs font-bold text-[#4A6B53] bg-[#DCE6DE] px-3 py-1 rounded-full mb-3">
                Resolución 2184 de 2019
              </span>
              <h3 className="font-serif font-bold text-xl text-[#1E2522] mb-2">
                Unificación nacional del código de colores
              </h3>
              <p className="text-sm text-[#4B534E] leading-relaxed">
                Rige de manera obligatoria en toda Colombia desde el 1 de enero de 2021. Eliminó la confusión 
                de colores entre ciudades (azul, gris, rojo, etc.), dejando un estándar único de tres colores: 
                <strong> blanco, verde y negro</strong>.
              </p>
            </div>

            <div className="bg-[#FDFCF9] rounded-3xl p-8 border border-[#EFE6D8] shadow-sm">
              <span className="inline-block text-xs font-bold text-[#4A6B53] bg-[#DCE6DE] px-3 py-1 rounded-full mb-3">
                Meta Climática 2030 (NDC Colombia)
              </span>
              <h3 className="font-serif font-bold text-xl text-[#1E2522] mb-2">
                Reducción del 51% en emisiones de CO₂
              </h3>
              <p className="text-sm text-[#4B534E] leading-relaxed">
                Al desviar materia orgánica de los botaderos se mitiga la generación de gas metano (CH₄), 
                cuyo potencial de calentamiento global es 28 veces superior al del dióxido de carbono.
              </p>
            </div>
          </div>

          {/* 9R Banner */}
          <div className="bg-[#4A6B53] text-[#FBFAF6] rounded-3xl p-8 sm:p-10 shadow-md">
            <div className="max-w-2xl mb-6">
              <h3 className="font-serif font-bold text-2xl sm:text-3xl text-white mb-2">
                De "Usar y Tirar" a las 9R de la Economía Circular
              </h3>
              <p className="text-white/80 text-sm leading-relaxed">
                Superar el modelo lineal extractivo requiere una jerarquía de acciones que mantengan el valor de los materiales en la economía:
              </p>
            </div>

            {/* 9R Chain Pills */}
            <div className="flex flex-wrap gap-2.5 mb-8">
              {[
                '1. Repensar',
                '2. Reducir',
                '3. Reutilizar',
                '4. Reparar',
                '5. Renovar',
                '6. Remanufacturar',
                '7. Reproponer',
                '8. Reciclar',
                '9. Recuperar'
              ].map((r, i) => (
                <span
                  key={i}
                  className="bg-white/15 border border-white/25 text-white px-3.5 py-1.5 rounded-full text-xs font-bold shadow-xs hover:bg-white hover:text-[#4A6B53] transition-colors"
                >
                  {r}
                </span>
              ))}
            </div>

            {/* Colombian Innovations */}
            <h4 className="font-serif font-bold text-lg text-white mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-[#CFEF9D]" />
              <span>Casos reales de innovación circular en Colombia:</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white/10 border border-white/20 p-5 rounded-2xl">
                <div className="flex items-center gap-2 font-bold text-sm text-white mb-1.5">
                  <Coffee className="w-4 h-4 text-[#CFEF9D]" />
                  <span>Coffee Kreis</span>
                </div>
                <p className="text-xs text-white/80 leading-relaxed">
                  Transforma la borra de café de cafeterías colombianas en tazas duraderas, empaques y biomateriales reutilizables.
                </p>
              </div>

              <div className="bg-white/10 border border-white/20 p-5 rounded-2xl">
                <div className="flex items-center gap-2 font-bold text-sm text-white mb-1.5">
                  <Sparkles className="w-4 h-4 text-[#CFEF9D]" />
                  <span>Coca-Cola FEMSA</span>
                </div>
                <p className="text-xs text-white/80 leading-relaxed">
                  Incorpora resina de PET reciclado botella a botella (B2B) en sus plantas de producción en Tocancipá y Medellín.
                </p>
              </div>

              <div className="bg-white/10 border border-white/20 p-5 rounded-2xl">
                <div className="flex items-center gap-2 font-bold text-sm text-white mb-1.5">
                  <Building className="w-4 h-4 text-[#CFEF9D]" />
                  <span>Amarilo</span>
                </div>
                <p className="text-xs text-white/80 leading-relaxed">
                  Reutiliza y aprovecha sacos de cemento y residuos de construcción para darles una segunda vida útil en proyectos urbanos.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Color code bags + Golden Rule */}
        <div className="mb-20">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EFE6D8] border border-[#C8B195] text-[#33473C] font-bold text-xs">
              🌿 Regla de oro: Limpio, Seco y Separado
            </span>
            <p className="text-sm text-[#4B534E] mt-3">
              Un material reciclable pierde su valor comercial si se moja o engrasa. Verifica estas condiciones antes de embolsar:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Bolsa Blanca */}
            <div className="bg-[#F7F5F0] rounded-3xl p-6 border border-[#EFE6D8] shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-full bg-white border border-gray-300 flex items-center justify-center text-lg mb-4 shadow-xs">
                🧴
              </div>
              <h4 className="font-serif font-bold text-lg text-[#1E2522]">Bolsa Blanca</h4>
              <span className="text-xs font-bold text-[#4A6B53] block mb-3">Materiales Aprovechables</span>
              <ul className="text-xs text-[#4B534E] space-y-2">
                <li className="flex items-start gap-1.5"><Check className="w-3.5 h-3.5 text-[#4A6B53] shrink-0 mt-0.5" /><span>Papel limpio y seco (sin grapas)</span></li>
                <li className="flex items-start gap-1.5"><Check className="w-3.5 h-3.5 text-[#4A6B53] shrink-0 mt-0.5" /><span>Cajas de cartón dobladas y aplanadas</span></li>
                <li className="flex items-start gap-1.5"><Check className="w-3.5 h-3.5 text-[#4A6B53] shrink-0 mt-0.5" /><span>Botellas plásticas vacías y escurridas</span></li>
                <li className="flex items-start gap-1.5"><Check className="w-3.5 h-3.5 text-[#4A6B53] shrink-0 mt-0.5" /><span>Frascos y botellas de vidrio sin tapas</span></li>
                <li className="flex items-start gap-1.5"><Check className="w-3.5 h-3.5 text-[#4A6B53] shrink-0 mt-0.5" /><span>Latas de bebidas y alimentos enjuagadas</span></li>
                <li className="flex items-start gap-1.5"><Check className="w-3.5 h-3.5 text-[#4A6B53] shrink-0 mt-0.5" /><span>Envases Tetra Pak compactados</span></li>
              </ul>
            </div>

            {/* Bolsa Verde */}
            <div className="bg-[#E4EEE2] rounded-3xl p-6 border border-[#C5DDCB] shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-full bg-[#4A6B53] text-white flex items-center justify-center text-lg mb-4 shadow-xs">
                🍃
              </div>
              <h4 className="font-serif font-bold text-lg text-[#1E2522]">Bolsa Verde</h4>
              <span className="text-xs font-bold text-[#4A6B53] block mb-3">Orgánicos Aprovechables</span>
              <ul className="text-xs text-[#4B534E] space-y-2">
                <li className="flex items-start gap-1.5"><Check className="w-3.5 h-3.5 text-[#4A6B53] shrink-0 mt-0.5" /><span>Cáscaras de frutas y vegetales</span></li>
                <li className="flex items-start gap-1.5"><Check className="w-3.5 h-3.5 text-[#4A6B53] shrink-0 mt-0.5" /><span>Restos de alimentos crudos o cocidos</span></li>
                <li className="flex items-start gap-1.5"><Check className="w-3.5 h-3.5 text-[#4A6B53] shrink-0 mt-0.5" /><span>Semillas y carozos</span></li>
                <li className="flex items-start gap-1.5"><Check className="w-3.5 h-3.5 text-[#4A6B53] shrink-0 mt-0.5" /><span>Borra de café, bolsitas de té e infusiones</span></li>
                <li className="flex items-start gap-1.5"><Check className="w-3.5 h-3.5 text-[#4A6B53] shrink-0 mt-0.5" /><span>Césped cortado, restos de jardinería y hojas</span></li>
              </ul>
              <p className="mt-3 text-[11px] text-[#4A6B53] font-semibold">
                * Ideales para producción de abono orgánico y compost.
              </p>
            </div>

            {/* Bolsa Negra */}
            <div className="bg-[#E9E7E1] rounded-3xl p-6 border border-[#D5CFC5] shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-full bg-[#2B2B28] text-white flex items-center justify-center text-lg mb-4 shadow-xs">
                🧻
              </div>
              <h4 className="font-serif font-bold text-lg text-[#1E2522]">Bolsa Negra</h4>
              <span className="text-xs font-bold text-gray-700 block mb-3">Residuos No Aprovechables</span>
              <ul className="text-xs text-[#4B534E] space-y-2">
                <li className="flex items-start gap-1.5"><Check className="w-3.5 h-3.5 text-gray-600 shrink-0 mt-0.5" /><span>Papel higiénico y pañitos húmedos usados</span></li>
                <li className="flex items-start gap-1.5"><Check className="w-3.5 h-3.5 text-gray-600 shrink-0 mt-0.5" /><span>Servilletas sucias con grasa o comida</span></li>
                <li className="flex items-start gap-1.5"><Check className="w-3.5 h-3.5 text-gray-600 shrink-0 mt-0.5" /><span>Envolturas metalizadas (snacks, galletas)</span></li>
                <li className="flex items-start gap-1.5"><Check className="w-3.5 h-3.5 text-gray-600 shrink-0 mt-0.5" /><span>Tapabocas y guantes desechables</span></li>
                <li className="flex items-start gap-1.5"><Check className="w-3.5 h-3.5 text-gray-600 shrink-0 mt-0.5" /><span>Colillas de cigarrillo apagadas</span></li>
              </ul>
            </div>
          </div>

          {/* Red container special note */}
          <div className="mt-6 bg-[#F3E2DD] border border-[#A3402E]/30 rounded-2xl p-5 flex items-start gap-3 text-xs text-[#5C2A1F]">
            <AlertOctagon className="w-5 h-5 text-[#A3402E] shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#A3402E]">Nota de Seguridad Industrial y Salud:</strong> Existe un cuarto contenedor <strong>rojo</strong>, de uso exclusivo en clínicas, laboratorios e industrias para residuos con riesgo biológico, infecciosos o cortopunzantes. Estos <em>nunca</em> deben depositarse en los puntos ecológicos ordinarios.
            </div>
          </div>
        </div>

        {/* 3. Acordeón de 5 errores comunes */}
        <div className="mb-20 max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="font-serif font-bold text-2xl text-[#1E2522]">
              Evita estos 5 errores críticos al separar
            </h3>
            <p className="text-xs sm:text-sm text-[#4B534E] mt-1">
              Haz clic en cada error para entender la consecuencia técnica de cometerlo.
            </p>
          </div>

          <div className="space-y-3">
            {ACCORDION_ITEMS.map((item, idx) => {
              const isOpen = openAccordion === idx;
              return (
                <div
                  key={idx}
                  className="bg-[#FDFCF9] rounded-2xl border border-[#EFE6D8] overflow-hidden shadow-xs"
                >
                  <button
                    type="button"
                    onClick={() => toggleAccordion(idx)}
                    className="w-full text-left p-5 flex items-center justify-between gap-4 font-bold text-sm text-[#1E2522] hover:bg-[#F9F7F1] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-full bg-[#DCE6DE] text-[#33473C] font-serif font-bold text-xs flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <span>{item.title}</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-[#4A6B53] shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 pt-1 text-xs text-[#4B534E] leading-relaxed border-t border-[#EFE6D8]/50 animate-in fade-in">
                      {item.desc}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. Familia + Botella de Amor */}
        <div className="bg-[#EFE6D8] rounded-3xl p-8 sm:p-10 mb-20 shadow-xs">
          <div className="max-w-2xl mb-8">
            <h3 className="font-serif font-bold text-2xl text-[#1E2522] flex items-center gap-2">
              <Heart className="w-6 h-6 text-[#A3402E]" />
              <span>Aprendiendo en familia: Hábitos creativos</span>
            </h3>
            <p className="text-sm text-[#4B534E] mt-2 leading-relaxed">
              La educación ambiental se consolida cuando toda la familia participa con actividades lúdicas.
            </p>
          </div>

          {/* Botella de amor card */}
          <div className="bg-[#FDFCF9] rounded-2xl p-6 mb-6 shadow-sm border border-[#D5CFC5] flex flex-col sm:flex-row items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-[#DCE6DE] flex items-center justify-center text-3xl shrink-0">
              🍶
            </div>
            <div>
              <h4 className="font-serif font-bold text-base text-[#1E2522] mb-1">
                Proyecto "La Botella de Amor"
              </h4>
              <p className="text-xs text-[#4B534E] leading-relaxed">
                Toma una botella plástica limpia y llénala compactando todos los plásticos flexibles de un solo uso (empaques de papas, dulces, cepillos de dientes usados, tubos de pasta dental vacíos). Cuando esté tan dura como un ladrillo, entrégala en los puntos autorizados de la fundación para transformarla en madera plástica para viviendas de interés social y parques infantiles.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[#FDFCF9] rounded-2xl p-5 border border-[#D5CFC5]">
              <span className="text-2xl mb-2 block">✏️</span>
              <h5 className="font-bold text-sm text-[#1E2522] mb-1">Dibuja y separa</h5>
              <p className="text-xs text-[#4B534E]">
                Colorea las tres canecas con los más pequeños y juega a clasificar recortes de revistas o periódicos.
              </p>
            </div>

            <div className="bg-[#FDFCF9] rounded-2xl p-5 border border-[#D5CFC5]">
              <span className="text-2xl mb-2 block">🧠</span>
              <h5 className="font-bold text-sm text-[#1E2522] mb-1">Memoria verde</h5>
              <p className="text-xs text-[#4B534E]">
                Un juego de concentración: empareja los residuos idénticos y di en voz alta a qué bolsa van.
              </p>
            </div>

            <div className="bg-[#FDFCF9] rounded-2xl p-5 border border-[#D5CFC5]">
              <span className="text-2xl mb-2 block">🎨</span>
              <h5 className="font-bold text-sm text-[#1E2522] mb-1">Personaliza tus canecas</h5>
              <p className="text-xs text-[#4B534E]">
                Crea etiquetas personalizadas y caritas para cada contenedor para que separar sea emocionante.
              </p>
            </div>
          </div>
        </div>

        {/* 5. Seis pequeñas acciones */}
        <div>
          <div className="text-center max-w-xl mx-auto mb-8">
            <h3 className="font-serif font-bold text-2xl text-[#1E2522]">
              6 pequeñas acciones para un entorno limpio
            </h3>
            <p className="text-xs sm:text-sm text-[#4B534E] mt-1">
              Hábitos de cultura ciudadana que marcan la diferencia en parques, calles y transporte público.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              'Si ves un papel o servilleta en la calle, recógelo y llévalo a la caneca más próxima.',
              'Recoge siempre las heces de tu mascota en bolsa biodegradable durante los paseos.',
              'Apaga completamente tu cigarrillo y deposítalo solo en ceniceros o canecas negras.',
              'Guarda el empaque de dulces o golosinas en tu bolsillo hasta llegar a un cesto adecuado.',
              'Envuelve el chicle masticado en un trozo de papel antes de arrojarlo a la papelera.',
              'Enseña con el ejemplo separando adecuadamente desde tu propia casa y trabajo.'
            ].map((action, i) => (
              <div
                key={i}
                className="bg-[#FDFCF9] rounded-2xl p-5 border border-[#EFE6D8] shadow-xs flex items-start gap-3"
              >
                <span className="w-7 h-7 rounded-full bg-[#4A6B53] text-[#FBFAF6] font-bold text-xs flex items-center justify-center shrink-0">
                  {i + 1}
                </span>
                <p className="text-xs text-[#1E2522] leading-relaxed">
                  {action}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
