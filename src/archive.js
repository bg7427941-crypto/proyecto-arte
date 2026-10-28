import { icon } from './icons.js';
import { documentaryRecords } from './documentary.js';
import { researchRecords, researchSources } from './research.js';
import { observeReveals, transitionContent } from './motion.js';

const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const originals = [...documentaryRecords, ...researchRecords].sort((a, b) => Number(a.year) - Number(b.year));
const periodLabels = { '1983': '1982–1983', '1998': '1997–1998' };

let records = [];
let filter = 'Todo';
let period = 'Todo';
let dbPromise;
let modalCleanup;
const objectUrls = new Map();
let toastTimer;
function notify(message) {
  const toast = document.querySelector('#toast');
  toast.textContent = message;
  toast.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('visible'), 4500);
}

function database() {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    if (!window.indexedDB) { reject(new Error('No local storage')); return; }
    const request = indexedDB.open('al-margen-archive', 1);
    request.onupgradeneeded = () => { request.result.createObjectStore('media', { keyPath: 'id' }); };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    request.onblocked = () => reject(new Error('Database blocked'));
  });
  return dbPromise;
}
async function readMedia() {
  const db = await database();
  return new Promise((resolve, reject) => {
    const request = db.transaction('media').objectStore('media').getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
async function writeMedia(action, value) {
  const db = await database();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('media', 'readwrite');
    const store = tx.objectStore('media');
    if (action === 'put') store.put(value);
    else store.delete(value);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error || new Error('Storage aborted'));
  });
}
function mediaUrl(record) {
  if (!record.file) return record.image;
  if (!objectUrls.has(record.id)) objectUrls.set(record.id, URL.createObjectURL(record.file));
  return objectUrls.get(record.id);
}

function render({ reveal = true } = {}) {
  const all = [...originals, ...records];
  document.querySelector('#archive-count').textContent = all.length;
  const periodSelect = document.querySelector('#archive-period');
  const years = [...new Set(all.map(record => record.year).filter(Boolean))].sort();
  if (period !== 'Todo' && !years.includes(period)) period = 'Todo';
  periodSelect.innerHTML = `<option value="Todo">Todos los años</option>${years.map(year => `<option value="${escapeHtml(year)}">${periodLabels[year] || escapeHtml(year)}</option>`).join('')}`;
  periodSelect.value = period;
  const visible = all.filter(record => (filter === 'Todo' || record.category === filter) && (period === 'Todo' || record.year === period));
  document.querySelector('#archive-result').textContent = `${visible.length} de ${all.length} registros · ${filter === 'Todo' ? 'Todos los temas' : filter} · ${period === 'Todo' ? 'Todos los años' : periodLabels[period] || period}`;
  document.querySelector('#archive-grid').innerHTML = visible.length ? visible.map(record => `
    <button class="archive-card" data-record="${escapeHtml(record.id)}" data-kind="${record.kind || 'local'}">
      <div class="card-image">
        ${record.kind === 'research' ? `<div class="research-cover" aria-hidden="true"><span>${escapeHtml(record.period || record.year)}</span><p>${escapeHtml(record.location)}</p><small>UNA HUELLA EN EL ARCHIVO</small></div>` : record.file?.type.startsWith('video/') ? `<video src="${mediaUrl(record)}" poster="/images/video-cover.svg" preload="metadata" muted playsinline aria-hidden="true"></video>` : `<img src="${mediaUrl(record)}" alt="" loading="lazy" width="600" height="365">`}
        <span class="card-type">${icon(record.file?.type.startsWith('video/') ? 'play' : 'image')}${record.file ? record.file.type.startsWith('video/') ? 'VIDEO AÑADIDO' : 'IMAGEN AÑADIDA' : record.kind === 'documentary' ? 'FOTOGRAFÍA DOCUMENTAL' : 'FICHA DOCUMENTAL'}</span>
        <span class="card-open">${icon('arrow')}</span>
      </div>
      <div class="card-meta"><span>${escapeHtml(record.category)}</span><span class="meta-dot"></span><span>${escapeHtml(record.location)}</span></div>
      <h3>${escapeHtml(record.title)}</h3><p class="card-subtitle">${escapeHtml(record.subtitle || record.description || record.year || 'Archivo de la comunidad').slice(0, 180)}</p>
      ${record.credit ? `<p class="card-credit">${escapeHtml(record.cardCredit || `${record.kind === 'documentary' ? 'Foto: ' : 'Fuente: '}${record.credit}${record.license ? ` · ${record.license.name}` : ''}`)}</p>` : ''}
    </button>`).join('') : '<p class="empty-state">No hay registros para esta combinación. Prueba con otro tema o con todos los años.</p>';
  if (reveal) observeReveals(document.querySelectorAll('.archive-card'), 80);
  document.querySelectorAll('[data-record]').forEach(button => button.addEventListener('click', () => {
    const record = all.find(item => item.id === button.dataset.record);
    if (record) openDetail(record);
  }));
}

function openDialog(content) {
  const dialog = document.querySelector('#content-dialog');
  if (modalCleanup) { modalCleanup(); modalCleanup = null; }
  document.querySelector('#dialog-body').innerHTML = content;
  if (!dialog.open) dialog.showModal();
  dialog.scrollTop = 0;
}
function sourceLinks(sources) {
  return sources.map(source => `<a href="${source.url}" target="_blank" rel="noopener noreferrer">${escapeHtml(source.label)} ${icon('arrow')}</a>`).join('');
}
function openDetail(record) {
  const isVideo = record.file?.type.startsWith('video/');
  openDialog(`
    ${record.kind === 'research' ? `<div class="research-cover research-detail"><span>${escapeHtml(record.period || record.year)}</span><p>${escapeHtml(record.location)}</p><small>FICHA DOCUMENTAL / LECTURA DE FUENTES</small></div>` : `<div class="detail-media">${isVideo ? `<video src="${mediaUrl(record)}" controls playsinline preload="metadata"></video>` : `<img src="${mediaUrl(record)}" alt="${escapeHtml(record.alt || record.title)}">`}</div>`}
    ${record.caption ? `<p class="photo-caption">${escapeHtml(record.caption)}</p>` : ''}
    <div class="dialog-padding"><p class="eyebrow">ARCHIVO VIVO / ${escapeHtml(record.category.toUpperCase())}</p>
      <h2 id="dialog-title">${escapeHtml(record.title)}</h2>
      <p class="detail-meta">${escapeHtml(record.location)}${record.displayDate || record.year ? ` · ${escapeHtml(record.displayDate || record.year)}` : ''}</p>
      ${record.description ? record.description.split('\n\n').map(paragraph => `<p class="dialog-copy">${escapeHtml(paragraph)}</p>`).join('') : '<p class="dialog-copy">Fragmento compartido para ampliar la memoria del territorio.</p>'}
      <p class="detail-disclosure">${escapeHtml(record.disclosure || 'Material añadido en este navegador. Su contexto y autoría los proporciona la persona que lo incorpora; no ha sido verificado por el equipo del proyecto.')}</p>
      ${record.credit ? `<p class="dialog-copy photo-credit">Autoría / fuente: ${record.originalUrl ? `<a href="${escapeHtml(record.originalUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(record.credit)}</a>` : escapeHtml(record.credit)}${record.license ? ` · <a href="${record.license.url}" target="_blank" rel="noopener noreferrer">${record.license.name}</a>` : ''}</p>` : ''}
      ${record.sources ? `<div class="detail-sources"><h3>PARA SEGUIR INVESTIGANDO</h3>${sourceLinks(record.sources)}</div>` : ''}
      ${record.file ? '<button class="delete-button" id="delete-media">Eliminar este archivo de mi navegador</button><div id="delete-area"></div>' : ''}
    </div>`);
  if (record.file) document.querySelector('#delete-media').addEventListener('click', () => {
    document.querySelector('#delete-area').innerHTML = '<div class="delete-confirm">Se eliminará de este navegador. El archivo original no se modifica.<br><button id="confirm-delete">Sí, eliminar</button><button id="cancel-delete">Conservar</button></div>';
    document.querySelector('#cancel-delete').addEventListener('click', () => { document.querySelector('#delete-area').innerHTML = ''; document.querySelector('#delete-media').focus(); });
    document.querySelector('#confirm-delete').addEventListener('click', async event => {
      event.currentTarget.disabled = true;
      try {
        await writeMedia('delete', record.id);
        records = records.filter(item => item.id !== record.id);
        const url = objectUrls.get(record.id);
        document.querySelector('#content-dialog').close();
        if (url) { URL.revokeObjectURL(url); objectUrls.delete(record.id); }
        render();
        notify('Archivo eliminado de este navegador.');
      } catch {
        document.querySelector('#confirm-delete').disabled = false;
        notify('No se pudo eliminar. El archivo se ha conservado.');
      }
    });
  });
}

function openUpload() {
  openDialog(`<div class="dialog-padding"><p class="eyebrow">UN ARCHIVO EN CONSTRUCCIÓN</p><h2 id="dialog-title">Cada fragmento <em>cuenta.</em></h2><p class="dialog-copy">Añade una imagen o un video de los casos del proyecto. Ayúdanos a recordar dónde, cuándo y quién está detrás de cada registro.</p>
    <form id="upload-form" class="upload-form">
      <label class="file-drop" id="file-drop">${icon('upload')}<strong id="file-label">Elige un archivo o arrástralo aquí</strong><small>JPG, PNG, WebP, GIF, AVIF · MP4, WebM · Máximo 50 MB</small><input type="file" name="file" id="media-file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif,video/mp4,video/webm" required aria-label="Seleccionar imagen o video"></label>
      <div id="upload-preview"></div><p class="form-error" id="file-error" role="alert"></p>
      <label>Título del fragmento<input name="title" required maxlength="90" placeholder="¿Qué nos cuenta esta imagen?"></label>
      <div class="form-grid"><label>Lugar<input name="location" required maxlength="70" placeholder="Por ejemplo, Catacaos"></label><label>Tema<select name="category" aria-label="Tema"><option>Territorio</option><option>Memoria</option><option>Prevención</option></select></label></div>
      <div class="form-grid"><label>Año del registro (opcional)<input name="year" inputmode="numeric" pattern="[0-9]{4}" maxlength="4" placeholder="2017"></label><label>Autoría o fuente<input name="credit" required maxlength="150" placeholder="Nombre, medio o archivo de origen"></label></div>
      <label>Contexto (opcional)<textarea name="description" maxlength="1500" placeholder="¿Qué ocurrió? ¿Qué deberíamos recordar?"></textarea></label>
      <p class="form-hint">Añade solo material propio o que tengas permiso para utilizar. Conserva la autoría y evita exponer datos personales sin consentimiento.</p>
      <div class="upload-actions"><button type="submit" class="primary-button" id="save-media">Añadir al archivo ${icon('plus')}</button><p class="form-hint">Se guarda solo en este navegador. No se publica ni se comparte con el equipo. Borrar los datos del sitio elimina el archivo local.</p></div>
      <p class="form-error" id="save-error" role="alert"></p>
    </form></div>`);
  const form = document.querySelector('#upload-form');
  const input = document.querySelector('#media-file');
  const drop = document.querySelector('#file-drop');
  let selectedFile;
  let previewUrl;
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif', 'video/mp4', 'video/webm'];
  modalCleanup = () => {
    document.querySelector('#upload-preview video')?.pause();
    if (previewUrl) URL.revokeObjectURL(previewUrl);
  };
  function chooseFile(file) {
    selectedFile = null;
    document.querySelector('#upload-preview').innerHTML = '';
    document.querySelector('#file-error').textContent = '';
    input.setCustomValidity('');
    if (previewUrl) { URL.revokeObjectURL(previewUrl); previewUrl = null; }
    if (!file) return;
    let error;
    if (!allowed.includes(file.type)) error = 'Elige una imagen JPG, PNG, WebP, GIF o AVIF, o un video MP4 o WebM.';
    else if (file.size > 50 * 1024 * 1024) error = 'El archivo supera los 50 MB. Prueba con una versión más ligera.';
    else if (file.size === 0) error = 'El archivo está vacío. Elige otro archivo.';
    if (error) {
      input.setCustomValidity(error);
      document.querySelector('#file-error').textContent = error;
      document.querySelector('#file-label').textContent = 'Elige otro archivo';
      return;
    }
    selectedFile = file;
    previewUrl = URL.createObjectURL(file);
    document.querySelector('#file-label').textContent = file.name;
    document.querySelector('#upload-preview').innerHTML = file.type.startsWith('video/') ? `<video class="upload-preview" src="${previewUrl}" controls playsinline preload="metadata"></video>` : `<img class="upload-preview" src="${previewUrl}" alt="Vista previa del archivo seleccionado">`;
    document.querySelector('.upload-preview').addEventListener('error', () => {
      if (!form.isConnected) return;
      selectedFile = null;
      const message = 'No se pudo leer este archivo. Comprueba su formato o elige otro.';
      input.setCustomValidity(message);
      document.querySelector('#file-error').textContent = message;
    });
  }
  input.addEventListener('change', () => chooseFile(input.files[0]));
  ['dragenter', 'dragover'].forEach(name => drop.addEventListener(name, event => { event.preventDefault(); drop.classList.add('dragover'); }));
  drop.addEventListener('dragleave', () => drop.classList.remove('dragover'));
  drop.addEventListener('drop', event => {
    event.preventDefault();
    drop.classList.remove('dragover');
    const file = event.dataTransfer.files[0];
    if (!file) return;
    const transfer = new DataTransfer();
    transfer.items.add(file);
    input.files = transfer.files;
    chooseFile(file);
  });
  form.addEventListener('submit', async event => {
    event.preventDefault();
    const data = new FormData(form);
    const title = String(data.get('title')).trim();
    const location = String(data.get('location')).trim();
    const credit = String(data.get('credit')).trim();
    const error = document.querySelector('#save-error');
    if (!selectedFile) { error.textContent = 'Selecciona primero una imagen o un video válido.'; return; }
    if (!title || !location || !credit) { error.textContent = 'Completa el título, el lugar y la autoría con algo más que espacios.'; return; }
    const button = document.querySelector('#save-media');
    button.disabled = true;
    button.textContent = 'Guardando…';
    const record = {
      id: crypto.randomUUID(), title, location, credit,
      category: data.get('category'), year: String(data.get('year')).trim(),
      description: String(data.get('description')).trim(),
      file: selectedFile, createdAt: Date.now(),
    };
    try {
      await writeMedia('put', record);
      records.push(record);
      filter = 'Todo';
      period = 'Todo';
      updateFilters();
      document.querySelector('#content-dialog').close();
      render();
      notify('Fragmento guardado en este navegador.');
    } catch (failure) {
      button.disabled = false;
      button.innerHTML = `Añadir al archivo ${icon('plus')}`;
      error.textContent = failure?.name === 'QuotaExceededError' ? 'No queda espacio en este navegador. Usa un archivo más pequeño o elimina otro fragmento.' : 'El navegador no permite guardar el archivo. Comprueba que el almacenamiento local esté habilitado e inténtalo de nuevo.';
    }
  });
}

function updateFilters() {
  document.querySelectorAll('[data-filter]').forEach(button => {
    const active = button.dataset.filter === filter;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
}

export function openSources() {
  openDialog(`<div class="dialog-padding"><p class="eyebrow">EL PROYECTO / FUENTES Y CRÉDITOS</p><h2 id="dialog-title">Detrás de <em>la pregunta.</em></h2><p class="dialog-copy">La página interpreta los dos documentos del equipo y amplía el recorrido a Tumbes, Piura, Lambayeque y La Libertad. Reúne fotografías y fichas documentales sobre 1982–1983, 1997–1998, 2017 y las lluvias de 2023. Los textos son una síntesis editorial; cada caso conserva sus referencias.</p>
    <ul class="source-list">
      <li><span>DOCUMENTO BASE · PDF</span><a href="/docs/la-ilusion-de-habitar-al-margen.pdf" target="_blank" rel="noopener">La ilusión de habitar al margen ${icon('arrow')}</a><p>Análisis cultural e institucional ante el fenómeno El Niño en la costa norte. Equipo del proyecto, 2026.</p></li>
      <li><span>INVESTIGACIÓN INICIAL · PDF</span><a href="/docs/calentamiento-global-y-vulnerabilidad-en-piura.pdf" target="_blank" rel="noopener">Calentamiento global y vulnerabilidad en Piura ${icon('arrow')}</a><p>Impacto de El Niño en las comunidades y desafíos para la prevención. Equipo del proyecto, 2026.</p></li>
      <li><span>GESTIÓN DEL RIESGO · 2024</span><a href="https://doi.org/10.18800/kawsaypacha.202402.D002" target="_blank" rel="noopener noreferrer">Prada-Álvarez y Arrieta-Padilla ${icon('arrow')}</a><p>Análisis de la Gestión del Riesgo de Desastres en el departamento de Piura para hacer frente al Fenómeno El Niño. Revista Kawsaypacha, 14.</p></li>
      <li><span>EL FENÓMENO · 2014</span><a href="https://www.minam.gob.pe/wp-content/uploads/2014/07/Dossier-El-Ni%C3%B1o-Final_web.pdf" target="_blank" rel="noopener noreferrer">SENAMHI y MINAM · El fenómeno El Niño en el Perú ${icon('arrow')}</a><p>Referencia técnica incluida en la investigación.</p></li>
      <li><span>EL CICLO DEL AGUA</span><a href="https://www.usgs.gov/special-topics/water-science-school/science/el-ciclo-del-agua-water-cycle-spanish" target="_blank" rel="noopener noreferrer">U.S. Geological Survey ${icon('arrow')}</a><p>Referencia conceptual sobre el movimiento continuo del agua.</p></li>
    </ul>
    <p class="detail-disclosure">Los PDF incluyen también referencias periodísticas de 2026 que no se han verificado de forma independiente para esta página. No se presentan sus cifras como datos comprobados ni se ofrece un pronóstico de El Niño.</p>
    <div class="detail-sources"><h3>FUENTES DEL RECORRIDO · 1982–2023</h3>${sourceLinks(Object.values(researchSources))}<p class="dialog-copy">La investigación de León Altuna aporta el contexto de Tumbes y Piura en 1982–1983 y 1997–1998. INDECI documenta los daños de 1997–1998. SENAMHI y la cobertura del río Moche contextualizan las lluvias de marzo de 2023. Yaku y El Niño son fenómenos distintos.</p></div>
    <div class="detail-sources"><h3>FOTOGRAFÍAS Y FICHAS DEL ARCHIVO</h3><p class="dialog-copy">Las fotografías de Piura en 2017 y Tumbes en 2023 proceden del Ministerio de Defensa del Perú, con licencia <a href="https://creativecommons.org/licenses/by/2.0/" target="_blank" rel="noopener noreferrer">CC BY 2.0</a>. El registro del antiguo puente Bolognesi se atribuye a Alfredobi y está declarado de dominio público en Commons; su fecha de toma no está indicada. Las tres fichas de fuentes usan composiciones tipográficas identificadas como tales. Cada entrada conserva su propia procedencia.</p>${sourceLinks(originals.map(record => ({label: `${record.title} · ${record.displayDate}`, url: record.originalUrl})))}</div>
    <div class="credits"><h3>Arte y Tecnología · UTEC · 2026</h3><p>Sebastian Daniel Cangalaya Martinez · Jenny Melisa Díaz Alarcón · Bruno William Garcia López · Diego Leonel Cardenas Quijaite · Giovanni Ticse (investigación inicial).</p><p>Docente: Isabel del Carmen Collazos Ticona.</p><p>Imágenes de paisaje: estudios artísticos generados con IA. Animación creada para esta experiencia. El paisaje interactivo de portada es una interpretación artística. Las cinco fotografías del Archivo vivo conservan su autoría y sus condiciones de uso; las fichas documentales indican sus fuentes. Audio: textura ambiental sintetizada, no grabación de campo.</p><p>Referencia propuesta por el equipo: <a href="https://refikanadol.com/works/unsupervised/" target="_blank" rel="noopener noreferrer"><u>Unsupervised, Refik Anadol</u></a>. Esta página es una interpretación independiente y no reproduce la obra ni sus recursos.</p><p>El archivo añadido por visitantes se conserva únicamente en su propio navegador. No existe publicación compartida en esta versión.</p></div>
  </div>`);
}

export function initArchive() {
  const dialog = document.querySelector('#content-dialog');
  document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    const rect = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
  });
  dialog.addEventListener('close', () => {
    if (modalCleanup) { modalCleanup(); modalCleanup = null; }
    document.querySelector('#dialog-body video')?.pause();
    document.querySelector('#dialog-body').innerHTML = '';
  });
  document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
    if (filter === button.dataset.filter) return;
    const buttons = [...document.querySelectorAll('[data-filter]')];
    const previousIndex = buttons.findIndex(item => item.dataset.filter === filter);
    const direction = buttons.indexOf(button) > previousIndex ? 1 : -1;
    filter = button.dataset.filter;
    updateFilters();
    transitionContent(document.querySelector('.archive-transition'), () => render({ reveal: false }), { direction, distance: 36, duration: .7 });
  }));
  document.querySelectorAll('.add-media').forEach(button => button.addEventListener('click', openUpload));
  document.querySelector('#archive-period').addEventListener('change', event => {
    period = event.target.value;
    transitionContent(document.querySelector('.archive-transition'), () => render({ reveal: false }), { distance: 36, duration: .7 });
  });
  render();
  readMedia().then(saved => { records = saved.sort((a, b) => a.createdAt - b.createdAt); render(); }).catch(() => {
    notify('El almacenamiento local no está disponible. Puedes explorar las fotografías documentales.');
  });
  window.addEventListener('pagehide', event => {
    if (!event.persisted) objectUrls.forEach(url => URL.revokeObjectURL(url));
  });
}
