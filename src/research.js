export const researchSources = {
  history: {
    label: 'León Altuna (2014) · Precipitaciones y caudales en Tumbes y Piura · Repositorio IGP',
    url: 'https://repositorio.igp.gob.pe/items/7128bbec-a456-4bc8-b3a8-c0ba4a8bcf17',
  },
  damage: {
    label: 'INDECI · Consolidado de daños producidos por El Niño 1997–1998 · PDF',
    url: 'https://portal.indeci.gob.pe/wp-content/uploads/2019/01/3.4_cons.pdf',
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

// Estas fichas sintetizan fuentes consultadas; no utilizan imágenes de otros episodios.
export const researchRecords = [
  {
    id: 'tumbes-1983', kind: 'research', category: 'Memoria',
    title: '1982–1983: la memoria también está en Tumbes',
    location: 'Tumbes, Perú', year: '1983', period: '1982–1983',
    subtitle: 'Lluvias y caudales que permiten leer la historia de otra cuenca.',
    displayDate: 'Episodio de 1982–1983 · investigación publicada en 2014',
    description: 'El Niño de 1982–1983 también forma parte de la historia de Tumbes. La investigación de Karen Beatriz León Altuna, conservada en el repositorio del Instituto Geofísico del Perú, analiza las precipitaciones y los caudales durante ese episodio y el de 1997–1998 en Tumbes y Piura.\n\nMirar otra cuenca amplía la pregunta del proyecto: la memoria del agua no pertenece a una sola ciudad. Conservar series de lluvia y caudal también es una forma de recordar, complementaria a los relatos y las fotografías.\n\n¿Qué cambia en nuestra idea de la calma cuando miramos un territorio a lo largo de varias décadas?',
    disclosure: 'Ficha documental basada en una investigación de 2014 sobre episodios históricos. La composición tipográfica identifica el periodo; no es una fotografía de 1983.',
    credit: 'Karen Beatriz León Altuna · UNALM / repositorio IGP',
    cardCredit: 'Fuente: León Altuna, 2014 · Repositorio IGP',
    originalUrl: researchSources.history.url,
    sources: [researchSources.history],
  },
  {
    id: 'lambayeque-1998', kind: 'research', category: 'Territorio',
    title: '1997–1998: Lambayeque en el registro de daños',
    location: 'Lambayeque, Perú', year: '1998', period: '1997–1998',
    subtitle: 'Un mismo episodio alcanza viviendas, cultivos e infraestructura de distintas regiones.',
    displayDate: 'Episodio de 1997–1998 · consolidado de INDECI',
    description: 'El consolidado de INDECI sobre El Niño de 1997–1998 incluye a Lambayeque entre los departamentos afectados. Reúne daños humanos y materiales, viviendas, agricultura e infraestructura, y permite situar la emergencia más allá de Piura.\n\nUn registro de daños habla de redes de vida: una vivienda, una vía y un cultivo cumplen funciones diferentes, pero su pérdida puede transformar al mismo tiempo la movilidad, el sustento y la posibilidad de permanecer en un lugar.\n\nLa pregunta para el proyecto es qué significa reconstruir cuando el territorio sigue expuesto, y cómo sostener el cuidado durante los años siguientes.',
    disclosure: 'Síntesis editorial de un registro institucional de daños. No se reproduce una fotografía histórica ni se atribuye el registro departamental a un distrito concreto.',
    credit: 'Instituto Nacional de Defensa Civil (INDECI)',
    cardCredit: 'Fuente: INDECI · Consolidado 1997–1998',
    originalUrl: researchSources.damage.url,
    sources: [researchSources.damage],
  },
  {
    id: 'moche-2023', kind: 'research', category: 'Prevención',
    title: '2023: el río Moche y la vida junto al cauce',
    location: 'La Campiña, Moche · La Libertad', year: '2023', period: '2023',
    subtitle: 'Viviendas y sembríos afectados en la provincia de Trujillo.',
    displayDate: 'Marzo de 2023 · reportaje publicado el 13 de marzo',
    description: 'El 13 de marzo de 2023, Infobae informó sobre el desborde del río Moche y sus efectos en viviendas y sembríos del sector La Campiña, en la provincia de Trujillo. La noticia permite mirar la relación entre el cauce, la actividad agrícola y los espacios habitados.\n\nEl 7 de marzo, SENAMHI había explicado la influencia del ciclón Yaku en las lluvias extremas del norte y su posible intensificación en La Libertad. Yaku y El Niño son fenómenos distintos: aquí se incorpora este caso para comparar la exposición al agua y las necesidades de prevención.\n\n¿Cómo mantener los medios de vida y reducir la exposición de quienes viven y trabajan junto a los ríos?',
    disclosure: 'Ficha de contexto periodístico sobre las lluvias de marzo de 2023. La composición tipográfica no sustituye ni se presenta como una fotografía del desborde. No se equipara el ciclón Yaku con El Niño.',
    credit: 'Infobae · contexto meteorológico de SENAMHI',
    cardCredit: 'Fuentes: Infobae y SENAMHI · marzo de 2023',
    originalUrl: researchSources.moche.url,
    sources: [researchSources.moche, researchSources.yaku],
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
  '2017': {
    kicker: '2017 / PIURA Y CATACAOS',
    title: 'El agua ocupa lo que habíamos olvidado.',
    text: 'El desborde del río Piura y las evacuaciones en Catacaos fueron reportados por BBC News el 28 de marzo de 2017. Las fotografías del archivo muestran cómo el agua transformó recorridos, viviendas y conexiones durante esa temporada.',
    sources: [{ label: 'BBC News · Desborde del río Piura · 28 de marzo de 2017', url: 'https://www.bbc.com/news/world-latin-america-39418314' }],
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
