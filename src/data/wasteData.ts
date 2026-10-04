/**
 * Waste classification data based on Colombian Resolution 2184 of 2019.
 */

export interface WasteItem {
  id: string;
  name: string;
  emoji: string;
  container: 'verde' | 'blanco' | 'negro';
  containerName: string;
  category: 'orgánico' | 'aprovechable' | 'no aprovechable';
  description: string;
  howToPrepare: string;
  impactNote: string;
}

export const WASTE_ITEMS: WasteItem[] = [
  {
    id: 'w-1',
    name: 'Cáscara de banano',
    emoji: '🍌',
    container: 'verde',
    containerName: 'Contenedor Verde',
    category: 'orgánico',
    description: 'Residuo orgánico de fruta de rápida descomposición biológica.',
    howToPrepare: 'Sin etiquetas plásticas ni empaques; depositar directamente en bolsa verde.',
    impactNote: 'Al compostarse genera abono natural de alta calidad y evita gas metano en rellenos.'
  },
  {
    id: 'w-2',
    name: 'Botella plástica (PET)',
    emoji: '🧴',
    container: 'blanco',
    containerName: 'Contenedor Blanco',
    category: 'aprovechable',
    description: 'Plástico transparente o de color tipo PET 100% reciclable.',
    howToPrepare: 'Vaciar líquidos, enjuagar levemente, escurrir y compactar con su tapa puesta.',
    impactNote: 'Ahorra hasta un 84% de energía en comparación con fabricar plástico virgen.'
  },
  {
    id: 'w-3',
    name: 'Caja de cartón limpia',
    emoji: '📦',
    container: 'blanco',
    containerName: 'Contenedor Blanco',
    category: 'aprovechable',
    description: 'Cartón seco, corrugado o cartulina sin grasa ni restos de alimentos.',
    howToPrepare: 'Retirar cintas plásticas excesivas y doblar o aplanar para ahorrar volumen.',
    impactNote: 'Reciclar 1 tonelada de cartón salva aproximadamente 17 árboles medianos.'
  },
  {
    id: 'w-4',
    name: 'Restos de verduras crudas',
    emoji: '🥬',
    container: 'verde',
    containerName: 'Contenedor Verde',
    category: 'orgánico',
    description: 'Hojas, tallos y cáscaras vegetales crudas ricas en nitrógeno.',
    howToPrepare: 'Escurrir exceso de agua y mezclar con hojas secas si se hace compost casero.',
    impactNote: 'Representa hasta el 60% del peso de los residuos domésticos en Colombia.'
  },
  {
    id: 'w-5',
    name: 'Servilleta usada',
    emoji: '🧻',
    container: 'negro',
    containerName: 'Contenedor Negro',
    category: 'no aprovechable',
    description: 'Papel suave contaminado con grasa, saliva o restos de comida.',
    howToPrepare: 'No se puede lavar ni reciclar; va directo a la bolsa negra de no aprovechables.',
    impactNote: 'La fibra corta y la grasa impiden su repulpado industrial.'
  },
  {
    id: 'w-6',
    name: 'Lata de gaseosa o cerveza',
    emoji: '🥫',
    container: 'blanco',
    containerName: 'Contenedor Blanco',
    category: 'aprovechable',
    description: 'Aluminio de grado alimenticio infinitamente reciclable.',
    howToPrepare: 'Vaciar por completo y aplastar levemente con el pie o la mano.',
    impactNote: 'El reciclaje de aluminio ahorra el 95% de energía requerida para extraer bauxita.'
  },
  {
    id: 'w-7',
    name: 'Cáscara de manzana y corazón',
    emoji: '🍎',
    container: 'verde',
    containerName: 'Contenedor Verde',
    category: 'orgánico',
    description: 'Residuo frutal biodegradable.',
    howToPrepare: 'Directo al contenedor verde de orgánicos aprovechables.',
    impactNote: 'Se degrada biológicamente en 2 a 4 semanas en una compostera activa.'
  },
  {
    id: 'w-8',
    name: 'Papel de archivo u hojas de cuaderno',
    emoji: '📄',
    container: 'blanco',
    containerName: 'Contenedor Blanco',
    category: 'aprovechable',
    description: 'Hojas de oficina, impresiones, cuadernos sin espiral metálico.',
    howToPrepare: 'Mantener totalmente secas y libres de grapas o clips.',
    impactNote: 'Cada tonelada de papel reciclado ahorra 26.000 litros de agua limpia.'
  },
  {
    id: 'w-9',
    name: 'Frasco o botella de vidrio',
    emoji: '🍾',
    container: 'blanco',
    containerName: 'Contenedor Blanco',
    category: 'aprovechable',
    description: 'Vidrio transparente, ámbar o verde para alimentos o bebidas.',
    howToPrepare: 'Enjuagar para quitar residuos de néctar o salsa, retirar tapa metálica y separar.',
    impactNote: 'El vidrio puede fundirse y reciclarse infinitas veces sin perder pureza.'
  },
  {
    id: 'w-10',
    name: 'Papel higiénico y pañitos',
    emoji: '🚽',
    container: 'negro',
    containerName: 'Contenedor Negro',
    category: 'no aprovechable',
    description: 'Residuos sanitarios contaminados microbiológicamente.',
    howToPrepare: 'Disponer siempre en doble bolsa negra cerrada.',
    impactNote: 'Por razones de bioseguridad, requiere disposición final en relleno sanitario.'
  },
  {
    id: 'w-11',
    name: 'Colilla de cigarrillo',
    emoji: '🚬',
    container: 'negro',
    containerName: 'Contenedor Negro',
    category: 'no aprovechable',
    description: 'Filtro de acetato de celulosa cargado con alquitrán y nicotina.',
    howToPrepare: 'Apagar completamente antes de depositar en caneca.',
    impactNote: 'Una sola colilla puede contaminar hasta 50 litros de agua dulce si se tira en la calle.'
  },
  {
    id: 'w-12',
    name: 'Cáscara de huevo',
    emoji: '🥚',
    container: 'verde',
    containerName: 'Contenedor Verde',
    category: 'orgánico',
    description: 'Materia orgánica con altísimo aporte de carbonato de calcio.',
    howToPrepare: 'Triturar con las manos para acelerar su descomposición en el abono.',
    impactNote: 'Aporta minerales esenciales para el suelo y neutraliza la acidez del compost.'
  },
  {
    id: 'w-13',
    name: 'Caja de pizza engrasada',
    emoji: '🍕',
    container: 'negro',
    containerName: 'Contenedor Negro',
    category: 'no aprovechable',
    description: 'Cartón impregnado con aceite y queso fundido.',
    howToPrepare: 'Si la tapa superior está 100% limpia, córtala para el blanco; la base va al negro.',
    impactNote: 'El aceite vegetal se adhiere a la celulosa e impide que se disuelva en agua durante el reciclaje.'
  },
  {
    id: 'w-14',
    name: 'Borra de café (cuncho o posos)',
    emoji: '☕',
    container: 'verde',
    containerName: 'Contenedor Verde',
    category: 'orgánico',
    description: 'Residuo de la preparación del café tradicional colombiano.',
    howToPrepare: 'Dejar enfriar y verter directamente en el contenedor verde.',
    impactNote: 'Empresas colombianas como Coffee Kreis la transforman en vasos y biopolímeros.'
  },
  {
    id: 'w-15',
    name: 'Caja de Tetra Pak (leche o jugo)',
    emoji: '🧃',
    container: 'blanco',
    containerName: 'Contenedor Blanco',
    category: 'aprovechable',
    description: 'Multicapa de cartón (75%), polietileno (20%) y aluminio (5%).',
    howToPrepare: 'Desplegar las 4 pestañas esquineras, aplastar y escurrir.',
    impactNote: 'En Colombia se transforma en "polialuminio" para tejas y pupitres escolares.'
  },
  {
    id: 'w-16',
    name: 'Tapabocas y guantes desechables',
    emoji: '😷',
    container: 'negro',
    containerName: 'Contenedor Negro',
    category: 'no aprovechable',
    description: 'Elementos de protección sanitaria de un solo uso.',
    howToPrepare: 'Cortar los elásticos para proteger la fauna y depositar en bolsa negra.',
    impactNote: 'Evita la dispersión de patógenos y riesgos ocupacionales.'
  }
];

export const CONTAINER_INFO = {
  verde: {
    color: '#4CAF50',
    title: 'Contenedor Verde',
    subtitle: 'Residuos Orgánicos Aprovechables',
    icon: '🍃',
    accentClass: 'from-[#4CAF50] to-[#2E7D32]',
    description: 'Destinado a todos los desechos biológicos de origen natural que se descomponen rápidamente. Estos residuos no deben mezclarse con plásticos ni químicos.',
    examples: [
      'Cáscaras y restos de frutas y verduras',
      'Restos de comida cruda o cocinada',
      'Borra de café, bolsitas de té y yerba',
      'Cáscaras de huevo trituradas',
      'Residuos de poda de jardín y césped',
      'Hojas secas y flores marchitas'
    ],
    goldenTip: 'Excelente para huertas urbanas y compostaje. Evita restos de carne con huesos muy grandes si compostas en casa.',
    destination: 'Plantas de compostaje y biofertilizantes comunitarios.'
  },
  blanco: {
    color: '#FFFFFF',
    textColor: '#123D2A',
    title: 'Contenedor Blanco',
    subtitle: 'Residuos Aprovechables (Reciclables)',
    icon: '🧴',
    accentClass: 'from-[#FFFFFF] to-[#BFE3C8]',
    description: 'Materiales limpios y secos que pueden transformarse en nuevos productos mediante procesos industriales de reciclaje.',
    examples: [
      'Plástico: botellas PET, envases de champú, bolsas limpias',
      'Vidrio: botellas y frascos sin tapas metálicas',
      'Metales: latas de gaseosa, conservas de atún, tapas metálicas',
      'Papel: archivo, periódico, revistas, sobres, cuadernos',
      'Cartón: cajas de embalaje, cubetas de huevos secas',
      'Tetra Pak: cajas de leche y jugos desarmadas'
    ],
    goldenTip: 'Regla de oro: siempre LIMPIO, SECO y SEPARADO. Si un residuo moja o engrasa a los demás, arruina todo el lote.',
    destination: 'Asociaciones de recicladores de oficio y centros de acopio y transformación.'
  },
  negro: {
    color: '#263238',
    title: 'Contenedor Negro',
    subtitle: 'Residuos No Aprovechables',
    icon: '🧻',
    accentClass: 'from-[#37474F] to-[#263238]',
    description: 'Residuos que no tienen valor de reciclaje económico o que por contaminación sanitaria deben ir a disposición final segura.',
    examples: [
      'Papel higiénico, pañitos húmedos y toallas de cocina usadas',
      'Servilletas sucias o engrasadas',
      'Papel y cartón manchado con comida (ej. caja de pizza aceitosa)',
      'Papeles metalizados de papas fritas y golosinas tipo snack',
      'Colillas de cigarrillo y cenizas',
      'Tapabocas, guantes de látex y curitas'
    ],
    goldenTip: 'Minimizar esta bolsa es la meta principal de la economía circular.',
    destination: 'Relleno sanitario municipal (como Doña Juana en Bogotá o La Pradera en Medellín).'
  }
};
