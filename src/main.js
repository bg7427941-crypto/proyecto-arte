import '@fontsource/dm-sans/latin-400.css';
import '@fontsource/dm-sans/latin-500.css';
import '@fontsource/dm-sans/latin-600.css';
import '@fontsource/instrument-serif/latin-400.css';
import '@fontsource/instrument-serif/latin-400-italic.css';
import '@fontsource/ibm-plex-mono/latin-400.css';
import './style.css';
import './motion.css';
import './context.css';
import { icon } from './icons.js';
import { initArtwork } from './artwork.js';
import { initArchive, openSources } from './archive.js';
import { gsap } from 'gsap';
import { initMotion, transitionContent, tween } from './motion.js';
import { timelineStories } from './research.js';

const timelineSourceLinks = story => story.sources.map(source => `<a href="${source.url}" target="_blank" rel="noopener noreferrer">${source.label} ${icon('arrow')}</a>`).join('');
const initialStory = timelineStories['1983'];

document.querySelector('#app').innerHTML = `
  <div class="reading-progress" aria-hidden="true"></div>
  <a class="skip-link" href="#contenido">Saltar al contenido</a>
  <header class="site-header page-width">
    <a class="wordmark" href="#inicio" aria-label="Al margen, inicio">al margen<span class="brand-dot">°</span></a>
    <nav class="desktop-nav" aria-label="Navegación principal">
      <a class="nav-link active" href="#inicio">Inicio</a>
      <a class="nav-link" href="#experiencia">La experiencia</a>
      <a class="nav-link" href="#archivo">Archivo vivo</a>
      <a class="nav-link" href="#proyecto">El proyecto</a>
    </nav>
    <div class="header-actions"><button class="sound-button" aria-label="Activar sonido ambiental" aria-pressed="false">${icon('mute')}<span>Activar sonido</span></button><a class="header-cta" href="#experiencia">Explorar la obra ${icon('arrow')}</a><button class="mobile-menu" aria-label="Abrir menú" aria-expanded="false">${icon('menu')}</button></div>
  </header>

  <main id="contenido">
    <section class="intro page-width" id="inicio" aria-labelledby="main-title">
      <div class="eyebrow-row"><p class="eyebrow"><span class="tiny-dot"></span> ARTE, TERRITORIO Y MEMORIA</p><p class="edition">COSTA NORTE, PERÚ <span>—</span> 2026</p></div>
      <div class="intro-grid"><h1 id="main-title">La ilusión de<br> habitar <em>al margen.</em></h1><div class="intro-aside"><p>Creemos vivir separados de la naturaleza.<br class="desktop-break"> Hasta que el agua nos recuerda<br class="desktop-break"> que siempre fuimos parte de ella.</p><a class="text-link" href="#experiencia">Una exploración del ciclo que vuelve ${icon('down')}</a></div></div>
    </section>

    <section class="experience page-width" id="experiencia" aria-label="Experiencia interactiva del ciclo del agua">
      <div class="artwork" tabindex="0" aria-label="Paisaje artístico interactivo. Usa los controles inferiores para explorar el ciclo del agua.">
        <div class="artwork-depth"><div class="artwork-scene"><div class="artwork-image"></div><div class="artwork-land"></div></div></div><div class="water-light" aria-hidden="true"></div><canvas id="water-canvas" aria-hidden="true"></canvas><div class="artwork-shade"></div>
        <div class="artwork-top"><span class="live-label"><span></span> PAISAJE EN MOVIMIENTO</span><span class="art-coordinates">AGUA / TIERRA / MEMORIA</span></div>
        <div class="artwork-title"><p class="eyebrow">UN CICLO. MUCHAS FORMAS DE HABITAR.</p><div class="stage-copy transition-host"><div class="transition-current"><h2 id="art-title">El agua siempre<br><em>regresa.</em></h2></div></div></div>
        <div class="artwork-hint"><span class="cursor-orbit">${icon('plus')}</span><span>Mueve el cursor.<br>Todo está conectado.</span></div>
        <div class="artwork-bottom"><span class="art-medium">ESTUDIO GENERATIVO 001 <span> / </span> EL RETORNO</span><div class="art-controls"><button id="pause-art" aria-label="Pausar animación" aria-pressed="false">${icon('pause')}</button><button id="expand-art" aria-label="Ampliar experiencia" aria-pressed="false">${icon('expand')}</button></div></div>
      </div>
      <div class="experience-bar"><div class="cycle-tabs" role="tablist" aria-label="Momentos del ciclo"><button id="stage-0" role="tab" aria-selected="false" aria-controls="cycle-description" tabindex="-1" data-stage="0"><span>01</span> La calma</button><button id="stage-1" role="tab" aria-selected="false" aria-controls="cycle-description" tabindex="-1" data-stage="1"><span>02</span> La memoria</button><button id="stage-2" class="selected" role="tab" aria-selected="true" aria-controls="cycle-description" data-stage="2"><span>03</span> El retorno</button><span class="cycle-indicator" aria-hidden="true"></span></div><p class="cycle-description" id="cycle-description" role="tabpanel" aria-labelledby="stage-2" aria-live="polite">El paisaje cambia. Nuestra relación con él, también.</p><span class="cycle-mark">${icon('drop')} TODO ES UN CICLO</span></div>
      <p class="motion-notice" hidden>Tu dispositivo reduce el movimiento. Pulsa reproducir en el paisaje para activar las transiciones.</p>
      <p class="artwork-note">Visualización artística, no simulación climática ni registro documental de Piura.</p>
      <details class="experience-reading">
        <summary>¿Cómo leer este paisaje? <span aria-hidden="true">+</span></summary>
        <div class="reading-content">
          <p class="reading-intro">El paisaje cambia para poner en duda una sensación: que la tierra que habitamos será siempre igual. Los tres momentos son una lectura de nuestra relación con el agua.</p>
          <div class="reading-stages">
            <div><span class="eyebrow">01 / LA CALMA</span><h3>La estabilidad aparente.</h3><p>Predomina la tierra y el movimiento es lento. Representa la vida cotidiana cuando el riesgo deja de verse. También es el tiempo en que podemos cuidar y prepararnos.</p></div>
            <div><span class="eyebrow">02 / LA MEMORIA</span><h3>Las huellas que conviven.</h3><p>La tierra y el agua se superponen. Las capas representan lo que permanece de una emergencia: recorridos, pérdidas, saberes y recuerdos, incluso cuando el agua ya se retiró.</p></div>
            <div><span class="eyebrow">03 / EL RETORNO</span><h3>Un territorio que se transforma.</h3><p>El agua domina y el flujo se intensifica. El cambio cuestiona la idea de un paisaje fijo y nos invita a pensar cómo habitamos un espacio que puede volver a inundarse.</p></div>
          </div>
          <p class="reading-interaction">Al mover el cursor o tocar el paisaje, alteras sus corrientes: tu presencia forma parte de lo que ocurre. Las transiciones continuas conectan los momentos; las fotografías y las fuentes del archivo les dan un contexto concreto.</p>
          <p class="reading-scope">La secuencia es simbólica: El Niño no tiene un calendario regular. Los paisajes son estudios artísticos generados con IA y animados para la obra.</p>
        </div>
      </details>
    </section>

    <section class="archive-section page-width" id="archivo" aria-labelledby="archive-title">
      <div class="section-heading"><div><p class="eyebrow"><span class="section-number">01 /</span> ARCHIVO VIVO</p><h2 id="archive-title">El territorio tiene <em>memoria.</em></h2></div><p>Mirar lo que pasó.<br>Para imaginar cómo queremos habitar.</p></div>
      <div class="archive-toolbar"><div class="filters" role="group" aria-label="Filtrar archivo por tema"><button class="filter active" data-filter="Todo" aria-pressed="true">Todo <span id="archive-count">8</span></button><button class="filter" data-filter="Territorio" aria-pressed="false">Territorio</button><button class="filter" data-filter="Memoria" aria-pressed="false">Memoria</button><button class="filter" data-filter="Prevención" aria-pressed="false">Prevención</button></div><label class="period-filter">Episodio<select id="archive-period"><option value="Todo">Todos los años</option value="1983">1982–1983</option><option value="1998">1997–1998</option><option value="2017">2017</option><option value="2023">2023</option></select></label><button class="add-media text-link">Añadir al archivo ${icon('plus')}</button></div>
      <p class="archive-context">Tumbes, Piura, Lambayeque y La Libertad. Un recorrido por 1982–1983, 1997–1998, 2017 y las lluvias de 2023, con fotografías y fichas documentales. Abre cada registro para conocer el lugar, la fecha y sus fuentes.</p>
      <p class="archive-result" id="archive-result" role="status" aria-live="polite"></p>
      <div class="archive-transition transition-host"><div id="archive-grid" class="archive-grid transition-current" aria-live="polite"></div></div>
      <div class="archive-foot"><span class="small-dot"></span><p>La memoria se construye entre todos.</p><button class="add-media">Comparte una imagen o un video ${icon('arrowRight')}</button></div>
    </section>

    <section class="memory-section" aria-labelledby="memory-title"><div class="page-width memory-layout"><div><p class="eyebrow"><span class="section-number">02 /</span> LO QUE VUELVE</p><h2 id="memory-title">No es la primera vez.<br><em>¿Qué hemos aprendido?</em></h2><p class="memory-intro">Distintos años, distintas cuencas. Estos casos permiten mirar cómo el agua transforma la vida en la costa norte y qué cuidados pueden sostenerse entre emergencias.</p><p class="source-tag">Cada episodio conserva sus propias fuentes.</p><p class="memory-nuance">Los episodios no son equivalentes: El Niño de 1982–1983 y 1997–1998, El Niño costero de 2017 y las lluvias vinculadas a Yaku en marzo de 2023 tienen contextos distintos.</p></div><div class="timeline-panel"><div class="timeline" role="group" aria-label="Explorar la memoria del territorio">${Object.keys(timelineStories).map(year => `<button data-year="${year}" class="${year === '1983' ? 'active' : ''}" aria-pressed="${year === '1983'}">${year}<span></span></button>`).join('')}<span class="timeline-marker" aria-hidden="true"></span></div><div class="timeline-story transition-host" aria-live="polite"><div class="transition-current"><span id="story-kicker" class="eyebrow">${initialStory.kicker}</span><h3 id="story-title">${initialStory.title}</h3><p id="story-text">${initialStory.text}</p><div id="story-sources" class="story-sources">${timelineSourceLinks(initialStory)}</div></div></div></div></div></section>

    <section class="project-section page-width" id="proyecto" aria-labelledby="project-title"><div class="project-label"><p class="eyebrow"><span class="section-number">03 /</span> EL PROYECTO</p><span class="project-seal" aria-hidden="true">${icon('drop')}<span>AGUA<br>TERRITORIO<br>MEMORIA</span></span></div><div class="project-content"><h2 id="project-title">¿Realmente podemos vivir<br><em>al margen de la naturaleza?</em></h2><div class="project-columns"><p>«La ilusión de habitar al margen» nace de esta pregunta. Exploramos cómo habitamos un territorio que alterna entre la escasez y el exceso de agua, como si la calma fuera su único estado posible.</p><p>Esta obra no busca culpar a quienes viven en Piura. Invita a pensar en la memoria colectiva, la prevención y la responsabilidad compartida. El peligro no es solo que el agua vuelva, sino que olvidemos que siempre fue parte del lugar.</p></div><button class="sources-button text-link">Conoce la investigación y sus fuentes ${icon('arrow')}</button><div class="project-meta"><span>ARTE Y TECNOLOGÍA</span><span>UNIVERSIDAD DE INGENIERÍA Y TECNOLOGÍA</span><span>LIMA, PERÚ · 2026</span></div></div></section>
    <section class="closing page-width"><span class="closing-mark" aria-hidden="true">≈</span><p>No estamos fuera del ciclo.<br><em>Somos parte de él.</em></p><a href="#inicio" aria-label="Volver al inicio">${icon('down')}</a></section>
  </main>
  <footer class="site-footer page-width"><a class="wordmark" href="#inicio">al margen<span class="brand-dot">°</span></a><p>Un proyecto en construcción. Una pregunta abierta.</p><button class="sources-button">Fuentes y créditos ${icon('arrow')}</button><span>© 2026</span></footer>
  <dialog id="content-dialog" class="content-dialog" aria-labelledby="dialog-title"><button class="dialog-close" aria-label="Cerrar ventana">${icon('close')}</button><div id="dialog-body"></div></dialog>
  <div id="toast" role="status" aria-live="polite"></div>
`;

initMotion();
initArtwork();
initArchive();
document.querySelectorAll('.sources-button').forEach(button => button.addEventListener('click', openSources));

const menu = document.querySelector('.mobile-menu');
const nav = document.querySelector('.desktop-nav');
menu.addEventListener('click', () => {
  const expanded = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(expanded));
  menu.setAttribute('aria-label', expanded ? 'Cerrar menú' : 'Abrir menú');
  menu.innerHTML = icon(expanded ? 'close' : 'menu');
  nav.classList.toggle('open', expanded);
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  menu.setAttribute('aria-expanded', 'false');
  menu.setAttribute('aria-label', 'Abrir menú');
  menu.innerHTML = icon('menu');
  nav.classList.remove('open');
}));

const navObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    document.querySelectorAll('.nav-link').forEach(link => {
      const active = link.hash === `#${entry.target.id}`;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  });
}, { rootMargin: '-10% 0px -65% 0px' });
document.querySelectorAll('#inicio, #experiencia, #archivo, #proyecto').forEach(section => navObserver.observe(section));

const yearButtons = [...document.querySelectorAll('[data-year]')];
const timeline = document.querySelector('.timeline');
const marker = document.querySelector('.timeline-marker');
let selectedYear = 0;
function positionYearMarker(immediate = false) {
  const button = yearButtons[selectedYear];
  const properties = { x: button.offsetLeft + button.offsetWidth / 2 - marker.offsetWidth / 2 };
  if (immediate) gsap.set(marker, properties);
  else tween(marker, { ...properties, duration: .9, ease: 'power3.inOut', overwrite: true });
}
new ResizeObserver(() => positionYearMarker(true)).observe(timeline);
yearButtons.forEach((button, index) => button.addEventListener('click', () => {
  if (selectedYear === index) return;
  const direction = index > selectedYear ? 1 : -1;
  selectedYear = index;
  yearButtons.forEach(item => {
    item.classList.toggle('active', item === button);
    item.setAttribute('aria-pressed', String(item === button));
  });
  const story = timelineStories[button.dataset.year];
  transitionContent(document.querySelector('.timeline-story'), () => {
    document.querySelector('#story-kicker').textContent = story.kicker;
    document.querySelector('#story-title').textContent = story.title;
    document.querySelector('#story-text').textContent = story.text;
    document.querySelector('#story-sources').innerHTML = timelineSourceLinks(story);
  }, { direction, distance: 56, duration: .85 });
  tween(timeline, { '--timeline-progress': String(index / (yearButtons.length - 1)), duration: .9, ease: 'power3.inOut', overwrite: true });
  positionYearMarker();
}));
