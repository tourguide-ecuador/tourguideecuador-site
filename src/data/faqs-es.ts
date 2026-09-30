// Spanish (Ecuadorian) FAQ content — authored copy, mirrors the English `faqs`
// collection. Answers may contain light inline HTML (links already point to /es/).
// Kept as data (not a content collection) so the English FAQPage schema and
// collection stay untouched.

export type FaqCategory = 'cruises' | 'tours' | 'amazon' | 'booking' | 'practical';

export interface FaqEs {
  question: string;
  category: FaqCategory;
  order: number;
  answerHtml: string;
}

export const categoriesEs: { key: FaqCategory; label: string }[] = [
  { key: 'cruises', label: 'Cruceros a Galápagos' },
  { key: 'tours', label: 'Tours por Ecuador' },
  { key: 'amazon', label: 'Tours a la Amazonía' },
  { key: 'booking', label: 'Reservas y pago' },
  { key: 'practical', label: 'Viaje y práctica' },
];

export const faqsEs: FaqEs[] = [
  {
    question: '¿Cuántos días necesito en la Amazonía?',
    category: 'amazon',
    order: 1,
    answerHtml:
      'Te sugerimos <strong>al menos 3 noches (4 días)</strong>. A la mayoría de los lodges se llega con un vuelo corto de Quito a Coca y luego en canoa a motor, así que el primer y el último día son sobre todo de viaje. Con 4 noches tienes más tiempo en los senderos, lagunas y torres de observación, y más oportunidades de ver fauna. Cuéntanos tus fechas y te sugerimos el lodge y la duración ideales.',
  },
  {
    question: '¿Qué incluye una estadía en un lodge amazónico?',
    category: 'amazon',
    order: 2,
    answerHtml:
      'Los programas suelen incluir el alojamiento, <strong>todas las comidas</strong>, excursiones guiadas con un naturalista y un guía local, y los traslados en canoa hacia y desde el lodge. Los vuelos a Coca y las bebidas normalmente van aparte. Cada lodge es un poco distinto, así que detallamos exactamente qué incluye en tu cotización.',
  },
  {
    question: '¿Qué debo llevar a la Amazonía?',
    category: 'amazon',
    order: 3,
    answerHtml:
      '<strong>Camisas y pantalones largos</strong>, ligeros y de secado rápido, chaqueta impermeable, repelente de insectos, protector solar, gorra, linterna y binoculares si tienes. Es un bosque lluvioso, así que espera algo de lluvia en cualquier mes. La mayoría de los lodges prestan botas de caucho; te lo confirmamos para el tuyo.',
  },
  {
    question: '¿Necesito vacunas para la Amazonía?',
    category: 'amazon',
    order: 4,
    answerHtml:
      'Consulta con tu médico o una clínica del viajero unas semanas antes del viaje. La <strong>vacuna contra la fiebre amarilla</strong> se recomienda comúnmente para la Amazonía ecuatoriana, y tu médico puede indicarte si necesitas algo para la malaria. Con gusto te contamos lo que han hecho otros viajeros en el mismo viaje.',
  },
  {
    question: '¿Cuál es la mejor época para visitar Galápagos?',
    category: 'practical',
    order: 1,
    answerHtml:
      'Sinceramente, <strong>no hay mala época</strong>: la fauna prospera todo el año en el ecuador. El mejor mes depende de lo que más quieras ver. Hemos preparado un <a href="/es/galapagos-wildlife-calendar">calendario de fauna de Galápagos</a> mes a mes para ayudarte a elegir.',
  },
  {
    question: '¿Cuántos días necesito en Galápagos?',
    category: 'cruises',
    order: 1,
    answerHtml:
      'Sugerimos <strong>un mínimo de 4 días</strong>, pero <strong>6–8 días</strong> es el punto ideal para ver las islas icónicas y su fauna con calma. Ocho días o más te permiten llegar a las islas remotas del oeste y el norte. Dinos de cuánto tiempo dispones y te sugerimos la mejor ruta.',
  },
  {
    question: '¿Qué incluye un crucero por Galápagos?',
    category: 'cruises',
    order: 3,
    answerHtml:
      'Normalmente: tu cabina, <strong>todas las comidas</strong>, <strong>excursiones guiadas diarias</strong> con un naturalista certificado, equipo de snorkel y los traslados entre el aeropuerto y el barco. No suele incluir: vuelos internacionales o entre islas, la entrada al Parque Nacional, bebidas alcohólicas, alquiler de neopreno ni propinas. Cada cotización detalla exactamente qué está cubierto.',
  },
  {
    question: '¿Qué categoría de crucero debería elegir?',
    category: 'cruises',
    order: 4,
    answerHtml:
      'Todos los barcos siguen las mismas normas del parque y visitan la misma fauna extraordinaria; la diferencia es el confort. <strong>Turista y Turista Superior</strong> ofrecen gran valor; <strong>Primera Clase</strong> suma más espacio, mejores guías y gastronomía; <strong>Lujo</strong> brinda las mejores cabinas, comida y servicio. Usa nuestra <a href="/es/cruises/compare">herramienta de comparación</a> para verlos lado a lado.',
  },
  {
    question: '¿Me marearé en un crucero?',
    category: 'cruises',
    order: 5,
    answerHtml:
      'El mar está más en calma en la <strong>temporada cálida (diciembre–mayo)</strong>, y las <strong>embarcaciones más grandes</strong> navegan con mayor estabilidad que los yates pequeños. Si eres propenso al mareo, elige un barco más grande, una cabina central y lleva tu remedio habitual; la mayoría de los huéspedes está perfectamente bien.',
  },
  {
    question: '¿Ofrecen tours privados y compartidos?',
    category: 'tours',
    order: 1,
    answerHtml:
      'Sí: muchos de nuestros tours de día vienen en ambas modalidades. <strong>Privado</strong> significa tu propio guía y vehículo, totalmente flexible a tu ritmo. <strong>Compartido</strong> se une a un grupo pequeño a un precio más amigable. Solo dinos cuál prefieres.',
  },
  {
    question: '¿Pueden diseñar un itinerario a mi medida?',
    category: 'tours',
    order: 2,
    answerHtml:
      'Por supuesto: es lo que mejor hacemos. Cuéntanos tus fechas, intereses, ritmo y presupuesto y diseñamos un viaje a tu medida por Ecuador y Galápagos. Empieza con nuestro <a href="/es/plan-my-trip">formulario para planear tu viaje</a>.',
  },
  {
    question: '¿Cómo reservo y pago?',
    category: 'booking',
    order: 1,
    answerHtml:
      'Envíanos una consulta, te respondemos con ideas y una cotización, y cuando estés conforme un depósito asegura tu viaje. Los tours de día también podrán reservarse en línea (vía Bókun). Aceptamos <strong>tarjeta de crédito, PayPal y transferencia bancaria</strong>.',
  },
  {
    question: '¿Tengo que pagar algo para consultar?',
    category: 'booking',
    order: 2,
    answerHtml:
      'No. Consultar es <strong>totalmente gratis y sin compromiso</strong>: haznos todas las preguntas que quieras antes de decidir nada.',
  },
  {
    question: '¿Cuál es su política de cancelación?',
    category: 'booking',
    order: 3,
    answerHtml:
      '<strong>Confirmación de tu reserva.</strong> Un tour de día queda confirmado cuando recibimos el pago (tarjeta de crédito, PayPal o transferencia bancaria). Te sugerimos una llamada, correo o WhatsApp el día anterior para confirmar todos los detalles; no es obligatorio, pero ayuda.<br><br><strong>Tours de día: si cancelas una reserva confirmada:</strong><ul><li>Más de 7 días antes del tour: 10% del precio.</li><li>Entre 3 y 7 días antes: 50% del precio.</li><li>Dentro de las 72 horas previas al inicio: sin reembolso.</li></ul><strong>Cambio de fecha.</strong> Los cambios con más de 6 días de anticipación no tienen costo, siempre que la nueva fecha sea dentro de los 2 meses siguientes.<br><br><strong>Los cruceros a Galápagos y los programas de varios días</strong> siguen la política del operador del barco o lodge, que suele ser más estricta cuanto más cerca está la salida. Te enviamos las condiciones exactas con tu cotización, antes de que pagues nada.<br><br>Reserves lo que reserves, recomendamos encarecidamente un seguro de viaje: vale la pena por la tranquilidad.',
  },
  {
    question: '¿Necesito visa para Ecuador?',
    category: 'practical',
    order: 2,
    answerHtml:
      'La mayoría de las nacionalidades <strong>no necesitan visa</strong> para estancias turísticas cortas (por favor verifica las normas de tu país). Necesitarás un pasaporte con al menos seis meses de validez y un billete de salida. Para Galápagos también pagarás la entrada al Parque Nacional y obtendrás la Tarjeta de Control de Tránsito a tu llegada.',
  },
  {
    question: '¿Qué tan en forma debo estar?',
    category: 'practical',
    order: 3,
    answerHtml:
      'La mayoría de nuestros viajes son de <strong>nivel fácil a moderado</strong> y los adaptamos a ti. Las excursiones en Galápagos implican caminar sobre terreno volcánico irregular, desembarcos secos y mojados desde una panga y snorkel opcional, todo a un ritmo tranquilo y con tiempo de sobra para disfrutarlo.',
  },
  {
    question: '¿Es seguro y necesito vacunas?',
    category: 'practical',
    order: 4,
    answerHtml:
      'Ecuador es en general seguro para quienes toman precauciones normales, y nuestros guías te cuidan en todo momento. Para la mayoría de visitantes no hay vacunas obligatorias, aunque la de la fiebre amarilla es recomendable si vas a la Amazonía. Consulta siempre la información más reciente con tu médico antes de viajar.',
  },
];
