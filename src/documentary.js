const author = 'Galería del Ministerio de Defensa del Perú';
const license = { name: 'CC BY 2.0', url: 'https://creativecommons.org/licenses/by/2.0/' };
const news = { label: 'BBC News · Desborde del río Piura (28 de marzo de 2017, en inglés)', url: 'https://www.bbc.com/news/world-latin-america-39418314' };
const explanation = { label: 'RPP / Mongabay · Cinco preguntas sobre El Niño costero (1 de abril de 2017)', url: 'https://rpp.pe/blog/mongabay/5-preguntas-para-entender-el-fenomeno-el-nino-costero-que-golpea-peru-noticia-1038554' };

// Las fechas son las de la toma, según DateTimeOriginal del archivo de origen.
// Las fotografías se conservan sin alteración. Solo la miniatura adapta el encuadre.
export const documentaryRecords = [
  {
    id: 'territorio', kind: 'documentary',
    title: 'Cuando el camino desaparece', category: 'Territorio', location: 'Piura, Perú', year: '2017',
    image: '/images/documental/piura-carretera-inundada-2017.jpg',
    alt: 'Vista aérea de una carretera interrumpida y rodeada de agua, con árboles parcialmente anegados en Piura.',
    subtitle: '29 de marzo de 2017 · La inundación también corta las conexiones.',
    date: '2017-03-29', displayDate: '29 de marzo de 2017',
    caption: 'Carretera interrumpida entre áreas inundadas, fotografiada durante la cobertura institucional de la emergencia en Piura.',
    description: 'Una carretera queda interrumpida entre extensas áreas de agua. La fotografía forma parte del reportaje del Ministerio de Defensa sobre su respuesta a la emergencia de marzo de 2017 en Piura.\n\nLa imagen permite pensar el territorio más allá de las viviendas: cuando una vía deja de ser transitable, también cambian las posibilidades de trasladarse, abastecerse y recibir ayuda. En el proyecto, esta huella nos pregunta cómo planificamos un paisaje que puede transformarse con el agua.',
    disclosure: 'Fotografía documental de la emergencia de 2017 en Piura. La ubicación se conserva con la precisión que ofrece el archivo: no se atribuye a un distrito específico. La miniatura adapta el encuadre; al abrirla se muestra la fotografía completa, sin retoques.',
    credit: author, license,
    originalUrl: 'https://www.flickr.com/photos/ministeriodedefensaperu/33008716663/',
    commonsUrl: 'https://commons.wikimedia.org/w/index.php?curid=57710211',
    sources: [
      { label: 'Reportaje fotográfico original · Ministerio de Defensa del Perú', url: 'https://www.flickr.com/photos/ministeriodedefensaperu/33008716663/' },
      { label: 'Ficha de la fotografía y licencia · Wikimedia Commons', url: 'https://commons.wikimedia.org/w/index.php?curid=57710211' },
      news,
    ],
  },
  {
    id: 'memoria', kind: 'documentary',
    title: '2017: cruzar en medio del agua', category: 'Memoria', location: 'Piura, Perú', year: '2017',
    image: '/images/documental/piura-paso-inundado-2017.jpg',
    alt: 'Personas atraviesan un paso inundado en Piura, apoyándose en estructuras y pequeñas balsas, vistas desde el aire.',
    subtitle: '28 de marzo de 2017 · Un trayecto cotidiano convertido en emergencia.',
    date: '2017-03-28', displayDate: '28 de marzo de 2017',
    caption: 'Personas cruzan un paso cubierto por agua en Piura. La toma pertenece a la cobertura del Ministerio de Defensa durante la emergencia de 2017.',
    description: 'La fotografía muestra a personas atravesando un paso cubierto por agua, entre estructuras y pequeñas balsas. Fue tomada el 28 de marzo de 2017 y forma parte de la cobertura de la respuesta a la emergencia en Piura.\n\nEse mismo día, BBC News informó sobre el desborde del río Piura y las evacuaciones en Catacaos. El reportaje periodístico aporta contexto al episodio; la fotografía procede del archivo del Ministerio de Defensa, no de BBC.\n\n¿Qué recordamos de las personas que debieron cambiar sus recorridos y sus rutinas cuando llegó el agua? Esta imagen invita a sostener esa memoria también durante los años de calma.',
    disclosure: 'Fotografía documental, no imagen generada. La fecha corresponde a la toma según la ficha de origen. El texto es una lectura editorial del proyecto: no atribuye testimonios ni identidades a las personas retratadas.',
    credit: author, license,
    originalUrl: 'https://www.flickr.com/photos/ministeriodedefensaperu/33008720133/',
    commonsUrl: 'https://commons.wikimedia.org/w/index.php?curid=57710151',
    sources: [
      { label: 'Reportaje fotográfico original · Ministerio de Defensa del Perú', url: 'https://www.flickr.com/photos/ministeriodedefensaperu/33008720133/' },
      { label: 'Ficha de la fotografía y licencia · Wikimedia Commons', url: 'https://commons.wikimedia.org/w/index.php?curid=57710151' },
      news,
    ],
  },
  {
    id: 'prevencion', kind: 'documentary',
    title: 'La emergencia a la puerta de casa', category: 'Prevención', location: 'Piura, Perú', year: '2017',
    image: '/images/documental/piura-viviendas-anegadas-2017.jpg',
    alt: 'Una mujer junto a un terreno con agua acumulada, rodeado de muros y viviendas de Piura.',
    subtitle: '14 de marzo de 2017 · Escuchar al territorio antes de la próxima lluvia.',
    date: '2017-03-14', displayDate: '14 de marzo de 2017',
    caption: 'Agua acumulada junto a viviendas, durante el recorrido institucional por asentamientos de Piura del 14 de marzo de 2017.',
    description: 'La imagen fue tomada durante un recorrido por asentamientos de Piura para constatar los daños de las lluvias. Muestra agua acumulada junto a las viviendas y a una mujer que señala el espacio anegado.\n\nEste registro es anterior al desborde del río Piura reportado a finales de marzo: no todas las fotografías de una temporada muestran el mismo momento de la emergencia.\n\nDesde la dimensión preventiva del proyecto, invita a mirar las condiciones cotidianas del drenaje, la vivienda y el entorno, y a escuchar a quienes habitan los lugares expuestos antes de que la emergencia se agrave.',
    disclosure: 'Fotografía documental del 14 de marzo de 2017. No se presenta como una imagen del desborde del 27 de marzo ni como un registro del presente. Se conserva la autoría institucional y no se inventan testimonios de la persona retratada.',
    credit: author, license,
    originalUrl: 'https://www.flickr.com/photos/ministeriodedefensaperu/33493214735/',
    commonsUrl: 'https://commons.wikimedia.org/w/index.php?curid=57710504',
    sources: [
      { label: 'Reportaje fotográfico original · Ministerio de Defensa del Perú', url: 'https://www.flickr.com/photos/ministeriodedefensaperu/33493214735/' },
      { label: 'Ficha de la fotografía y licencia · Wikimedia Commons', url: 'https://commons.wikimedia.org/w/index.php?curid=57710504' },
      explanation,
    ],
  },
];
