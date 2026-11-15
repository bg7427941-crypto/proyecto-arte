// Visual editorial para 2002.
// No es una fotografía histórica: representa la cuenca y las lluvias descritas por INDECI.
const piura2002Visual = 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 720">
  <defs>
    <linearGradient id="paper" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#e9e4d4"/>
      <stop offset="1" stop-color="#c9d1bd"/>
    </linearGradient>
    <linearGradient id="river" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#76a99b"/>
      <stop offset="1" stop-color="#315e57"/>
    </linearGradient>
    <pattern id="grain" width="22" height="22" patternUnits="userSpaceOnUse">
      <circle cx="3" cy="5" r="1" fill="#536d5c" opacity=".18"/>
      <circle cx="15" cy="16" r="1.2" fill="#536d5c" opacity=".13"/>
    </pattern>
  </defs>

  <rect width="1200" height="720" fill="url(#paper)"/>
  <rect width="1200" height="720" fill="url(#grain)"/>

  <g fill="none" stroke="#8c9d7d" stroke-width="2" opacity=".55">
    <path d="M-60 155 C180 60 250 270 455 185 S760 70 1260 175"/>
    <path d="M-60 190 C180 95 250 305 455 220 S760 105 1260 210"/>
    <path d="M-60 225 C180 130 250 340 455 255 S760 140 1260 245"/>
    <path d="M-60 545 C180 450 320 650 520 550 S900 430 1260 540"/>
    <path d="M-60 580 C180 485 320 685 520 585 S900 465 1260 575"/>
  </g>

  <path d="M-50 390 C140 330 250 400 380 345 S610 260 735 340 S950 455 1250 340"
        fill="none" stroke="#b7b99f" stroke-width="150" opacity=".55"/>
  <path d="M-50 390 C140 330 250 400 380 345 S610 260 735 340 S950 455 1250 340"
        fill="none" stroke="url(#river)" stroke-width="82" stroke-linecap="round"/>
  <path d="M-50 390 C140 330 250 400 380 345 S610 260 735 340 S950 455 1250 340"
        fill="none" stroke="#d9e5d5" stroke-width="3" stroke-dasharray="14 18" opacity=".8"/>

  <g fill="#456b55" opacity=".8">
    <path d="M150 90 l65 25 -28 48 -71 -16z"/>
    <path d="M900 110 l120 24 -22 55 -115 -20z"/>
    <path d="M820 555 l150 -16 20 58 -145 20z"/>
    <path d="M180 570 l100 -12 15 45 -95 17z"/>
  </g>

  <g fill="none" stroke="#315e57" stroke-width="4" opacity=".8">
    <path d="M95 275 L270 245 L350 275"/>
    <path d="M805 245 L930 270 L1085 230"/>
    <path d="M360 500 L475 525 L590 500"/>
  </g>

  <g fill="#f4f1e8" opacity=".92">
    <rect x="58" y="50" width="510" height="215" rx="4"/>
  </g>
  <text x="88" y="100" fill="#49654e" font-family="Arial, sans-serif" font-size="22" letter-spacing="7">ARCHIVO VIVO / 2002</text>
  <text x="88" y="165" fill="#203c35" font-family="Georgia, serif" font-size="52">El agua vuelve</text>
  <text x="88" y="222" fill="#203c35" font-family="Georgia, serif" font-size="52" font-style="italic">al Bajo Piura.</text>

  <text x="75" y="650" fill="#344f42" font-family="Arial, sans-serif" font-size="20" letter-spacing="4">06—07 ABRIL 2002</text>
  <text x="1125" y="650" text-anchor="end" fill="#344f42" font-family="Arial, sans-serif" font-size="17" letter-spacing="2">ILUSTRACIÓN EDITORIAL · NO ES FOTOGRAFÍA</text>
</svg>
`);

export const researchSources = {
  history: {
    label: 'León Altuna (2014) · Precipitaciones y caudales en Tumbes y Piura · Repositorio IGP',
    url: 'https://repositorio.igp.gob.pe/items/7128bbec-a456-4bc8-b3a8-c0ba4a8bcf17',
  },
  damage: {
    label: 'INDECI · Consolidado de daños producidos por El Niño 1997–1998 · PDF',
    url: 'https://portal.indeci.gob.pe/wp-content/uploads/2019/01/3.4_cons.pdf',
  },
  piura2002: {
    label: 'INDECI · Informe sobre las inundaciones en Piura · abril de 2002',
    url: 'https://portal.indeci.gob.pe/wp-content/uploads/2019/01/emer2002_224.pdf',
  },
  rpp2019: {
    label: 'RPP Noticias · Así quedó el centro de Piura tras la lluvia · 29 de diciembre de 2019',
    url: 'https://rpp.pe/peru/actualidad/piura-asi-quedo-la-ciudad-tras-la-intensa-lluvia-registrada-durante-la-madrugada-fotos-noticia-1236839',
  },
  coen2019: {
    label: 'COEN–INDECI · Reporte de precipitaciones pluviales en Piura · diciembre de 2019',
    url: 'https://portal.indeci.gob.pe/wp-content/uploads/2019/12/REPORTE-COMPLEMENTARIO-N%C2%BA-173-10ENE2020-PRECIPITACIONES-PLUVIALES-EN-LA-PROVINCIA-DE-PIURA-PIURA-5.pdf',
  },
  yaku: {
    label: 'SENAMHI · Ciclón Yaku frente al mar peruano · 7 de marzo de 2023',
    url: 'https://www.gob.pe/institucion/senamhi/noticias/721545-ciclon-yaku-se-presenta-frente-al-mar-peruano',
  },
  moche: {
    label: 'Infobae · Desborde del río Moche, La Campiña · 13 de marzo de 2023',
    url: 'https://www.infobae.com/peru/2023/03/13/ciclon-yaku-rio-moche-en-trujillo-se-desborda-y-deja-a-decenas-de-damnificados/',
  },
};

export const researchRecords = [
  {
    id: 'tumbes-1983',
    kind: 'research',
    category: 'Memoria',
    title: '1983: el agua también ocupó la ciudad',
    location: 'Piura, Perú',
    year: '1983',
    period: '1982–1983',
    image: 'https://www.udep.edu.pe/wp-content/uploads/sites/49/media/2013/01/elnino83-edificio80.jpg',
    alt: 'Patio de un edificio universitario de Piura inundado durante El Niño de 1982–1983.',
    subtitle: 'Una fotografía histórica de las inundaciones de 1983.',
    displayDate: 'El Niño 1982–1983 · fotografía histórica publicada por UDEP Hoy',
    caption: 'Edificio universitario inundado durante El Niño de 1982–1983. Fotografía publicada por UDEP Hoy.',
    description: 'El Niño de 1982–1983 produjo lluvias extraordinarias en Piura. La Universidad de Piura recuerda que las precipitaciones comenzaron a intensificarse desde noviembre de 1982 y continuaron durante varios meses de 1983.\n\nLa fotografía muestra el agua ocupando los espacios del campus universitario. Es una huella concreta de cómo la emergencia transformó lugares cotidianos de la ciudad.\n\n¿Qué permanece en la memoria de una ciudad después de una inundación?',
    disclosure: 'Fotografía histórica publicada por UDEP Hoy en un artículo de 2013 sobre El Niño de 1982–1983. No es una fotografía tomada en 2013.',
    credit: 'Universidad de Piura · UDEP Hoy',
    cardCredit: 'Foto: UDEP Hoy · episodio de 1982–1983',
    originalUrl: 'https://www.udep.edu.pe/hoy/2013/01/a-30-anos-de-el-nino-de-1982-83/',
    sources: [researchSources.history],
  },
  {
    id: 'piura-2002',
    kind: 'research',
    category: 'Territorio',
    title: '2002: lluvias intensas en el Bajo Piura',
    location: 'Piura y Sechura, Perú',
    year: '2002',
    period: '2001–2002',
    image: piura2002Visual,
    alt: 'Ilustración editorial de la cuenca del río Piura durante las lluvias de abril de 2002.',
    subtitle: 'Una ilustración editorial basada en el informe de INDECI.',
    displayDate: '6 y 7 de abril de 2002 · informe de INDECI',
    caption: 'Ilustración editorial basada en el informe de INDECI. No es una fotografía histórica.',
    description: 'El informe de INDECI documenta lluvias intensas durante el 6 y 7 de abril de 2002. La activación de quebradas y drenes, junto con el incremento del caudal del río Piura, provocó inundaciones en caseríos y asentamientos humanos.\n\nEl documento identifica al Bajo Piura, entre las provincias de Piura y Sechura, como una de las zonas más afectadas. También registra daños en viviendas, campos de cultivo, carreteras, puentes y canales de regadío.\n\nEste episodio recuerda que el riesgo de inundación también está presente fuera de los años más conocidos de El Niño.',
    disclosure: 'La imagen es una ilustración editorial creada para esta página a partir del contexto descrito por INDECI. No es una fotografía ni un mapa oficial del evento.',
    credit: 'Instituto Nacional de Defensa Civil (INDECI)',
    cardCredit: 'Ilustración editorial · Fuente: INDECI',
    originalUrl: researchSources.piura2002.url,
    sources: [researchSources.piura2002],
  },
  {
    id: 'piura-2019',
    kind: 'research',
    category: 'Prevención',
    title: '2019: una lluvia vuelve a anegar Piura',
    location: 'Piura, Perú',
    year: '2019',
    period: '2019',
    image: 'https://f.rpp-noticias.io/2019/12/29/880994piura-10png.png',
    alt: 'Fotografía de la galería de RPP Noticias sobre las inundaciones en Piura del 29 de diciembre de 2019.',
    subtitle: 'Las calles amanecieron inundadas después de las lluvias.',
    displayDate: '29 de diciembre de 2019 · reporte de COEN–INDECI',
    caption: 'Imagen publicada por RPP Noticias en su cobertura de las lluvias del 29 de diciembre de 2019.',
    description: 'El 29 de diciembre de 2019, las lluvias provocaron aniegos en distintos sectores de Piura. RPP Noticias documentó cómo amaneció la ciudad después de las precipitaciones.\n\nEl reporte del COEN–INDECI registró afectaciones en viviendas, locales públicos y vías de comunicación en Piura y otros distritos de la provincia.\n\nEste episodio muestra que incluso lluvias que no corresponden a un gran evento de El Niño pueden poner en evidencia problemas de drenaje y vulnerabilidad urbana.',
    disclosure: 'La fotografía procede de la galería de RPP Noticias. El reporte del COEN–INDECI documenta las afectaciones del evento del 29 de diciembre de 2019.',
    credit: 'RPP Noticias',
    cardCredit: 'Foto: RPP Noticias · 29 de diciembre de 2019',
    originalUrl: researchSources.rpp2019.url,
    sources: [researchSources.rpp2019, researchSources.coen2019],
  },
];

export const timelineStories = {
  '1983': {
    kicker: '1982–1983 / TUMBES Y PIURA',
    title: 'La historia también está en el paisaje.',
    text: 'Las lluvias y los caudales de Tumbes y Piura durante El Niño de 1982–1983 fueron estudiados junto a los de 1997–1998 por León Altuna. Mirar varias décadas y más de una cuenca ayuda a reconocer lo que la calma puede ocultar.',
    sources: [researchSources.history],
  },
  '1998': {
    kicker: '1997–1998 / LAMBAYEQUE Y PIURA',
    title: 'Una emergencia atraviesa muchas formas de habitar.',
    text: 'El consolidado de INDECI registra daños de El Niño de 1997–1998 en Lambayeque y Piura, entre otros departamentos. Viviendas, cultivos y vías forman una misma red de vida. Reconstruirla requiere sostener el cuidado más allá de la emergencia.',
    sources: [researchSources.damage],
  },
  '2002': {
    kicker: '2002 / PIURA Y SECHURA',
    title: 'El riesgo no aparece en un solo año.',
    text: 'INDECI documentó inundaciones en Piura y Sechura durante las lluvias del 6 y 7 de abril de 2002. El episodio afectó viviendas, cultivos e infraestructura.',
    sources: [researchSources.piura2002],
  },
  '2017': {
    kicker: '2017 / PIURA Y CATACAOS',
    title: 'El agua ocupa lo que habíamos olvidado.',
    text: 'El desborde del río Piura y las evacuaciones en Catacaos fueron reportados por BBC News el 28 de marzo de 2017. Las fotografías del archivo muestran cómo el agua transformó recorridos, viviendas y conexiones durante esa temporada.',
    sources: [{ label: 'BBC News · Desborde del río Piura · 28 de marzo de 2017', url: 'https://www.bbc.com/news/world-latin-america-39418314' }],
  },
  '2019': {
    kicker: '2019 / PIURA',
    title: 'Una lluvia también revela las vulnerabilidades.',
    text: 'Las precipitaciones del 29 de diciembre de 2019 ocasionaron aniegos en Piura y otros distritos de la provincia. RPP y COEN–INDECI documentaron sus efectos.',
    sources: [researchSources.rpp2019, researchSources.coen2019],
  },
  '2023': {
    kicker: '2023 / TUMBES Y MOCHE',
    title: 'Otra emergencia, otros territorios.',
    text: 'Las calles inundadas de Tumbes y el desborde del Moche, en La Libertad, amplían el recorrido. SENAMHI explicó la influencia de Yaku en las lluvias de marzo. Yaku y El Niño son fenómenos distintos; comparar sus impactos permite pensar la vulnerabilidad compartida.',
    sources: [researchSources.yaku, researchSources.moche],
  },
  'Hoy': {
    kicker: 'UNA PREGUNTA ABIERTA',
    title: 'La prevención empieza antes del retorno.',
    text: 'El presente es una oportunidad para mirar el territorio, escuchar a sus comunidades y sostener la prevención. Estos casos no forman un calendario regular ni predicen el próximo episodio: nos invitan a recordar y a decidir cómo queremos habitar.',
    sources: [],
  },
};