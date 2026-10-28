import { icon } from './icons.js';
import { animateEntry, setMotionPaused } from './motion.js';

export function initArtwork() {
  const artwork = document.querySelector('.artwork');
  const canvas = document.querySelector('#water-canvas');
  const ctx = canvas.getContext('2d');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const pauseButton = document.querySelector('#pause-art');
  const expandButton = document.querySelector('#expand-art');
  let paused = reducedMotion.matches;
  let inView = true;
  let stage = 2;
  let width = 1;
  let height = 1;
  let particles = [];
  let time = 0;
  let lastFrame = 0;
  let pointer = null;
  let lastPointerRipple = 0;
  let driftX = 0;
  let driftY = 0;
  const ripples = [];
  const stages = [
    { title: 'La calma también<br><em>es parte del ciclo.</em>', caption: 'LA CALMA', description: 'La tierra parece inmóvil. El ciclo no se detiene.', speed: .35 },
    { title: 'Lo que el territorio<br><em>no olvida.</em>', caption: 'LA MEMORIA', description: 'Las huellas del agua permanecen, aunque dejemos de mirarlas.', speed: .7 },
    { title: 'El agua siempre<br><em>regresa.</em>', caption: 'EL RETORNO', description: 'El paisaje cambia. Nuestra relación con él, también.', speed: 1.15 },
  ];

  function newParticle() {
    return { x: Math.random() * width, y: Math.random() * height, age: Math.random() * 160, life: 100 + Math.random() * 130 };
  }
  function resize() {
    const bounds = artwork.getBoundingClientRect();
    width = bounds.width;
    height = bounds.height;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    particles = Array.from({ length: width > 760 ? 650 : 260 }, newParticle);
    if (paused) drawStill();
  }
  function advance() {
    time += .006 * stages[stage].speed;
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = 'rgba(0,0,0,0.045)';
    ctx.fillRect(0, 0, width, height);
    ctx.globalCompositeOperation = 'source-over';
    ctx.lineWidth = .65;
    ctx.strokeStyle = stage === 0 ? 'rgba(243,233,193,.16)' : 'rgba(183,232,224,.25)';
    ctx.beginPath();
    particles.forEach((p, i) => {
      if (p.age++ > p.life || p.x < -10 || p.x > width + 10 || p.y < -10 || p.y > height + 10) {
        particles[i] = newParticle();
        particles[i].age = 0;
        return;
      }
      const nx = p.x / width;
      const ny = p.y / height;
      let angle = -.6 + Math.sin(nx * 6 + time) * .7 + Math.cos(ny * 6 - time * .6) * 1.3 + Math.sin((nx + ny) * 9) * .5;
      if (pointer) {
        const dx = pointer.x - p.x;
        const dy = pointer.y - p.y;
        const distance = Math.hypot(dx, dy);
        if (distance < 170) angle += Math.atan2(dy, dx) * (1 - distance / 170) * 1.5;
      }
      const speed = 1.1 + stages[stage].speed;
      ctx.moveTo(p.x, p.y);
      p.x += Math.cos(angle) * speed;
      p.y += Math.sin(angle) * speed;
      ctx.lineTo(p.x, p.y);
    });
    ctx.stroke();
    for (let i = ripples.length - 1; i >= 0; i--) {
      const r = ripples[i];
      r.radius += 1.7;
      r.opacity -= .004;
      if (r.opacity <= 0) { ripples.splice(i, 1); continue; }
      ctx.beginPath();
      ctx.ellipse(r.x, r.y, r.radius, r.radius * .48, -.5, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(228,243,221,${r.opacity})`;
      ctx.lineWidth = .65;
      ctx.stroke();
    }
  }
  function drawStill() {
    ctx.clearRect(0, 0, width, height);
  }
  function frame(timestamp) {
    requestAnimationFrame(frame);
    if (paused || !inView || document.hidden || timestamp - lastFrame < 32) return;
    lastFrame = timestamp;
    const targetX = pointer && !reducedMotion.matches ? (pointer.x / width - .5) * -24 : 0;
    const targetY = pointer && !reducedMotion.matches ? (pointer.y / height - .5) * -18 : 0;
    driftX += (targetX - driftX) * .065;
    driftY += (targetY - driftY) * .065;
    artwork.style.setProperty('--pointer-x', `${driftX.toFixed(2)}px`);
    artwork.style.setProperty('--pointer-y', `${driftY.toFixed(2)}px`);
    advance();
  }
  function updatePause() {
    setMotionPaused(paused);
    pauseButton.setAttribute('aria-pressed', String(paused));
    pauseButton.setAttribute('aria-label', paused ? 'Reanudar animación' : 'Pausar animación');
    pauseButton.innerHTML = icon(paused ? 'play' : 'pause');
    pauseButton.title = paused ? 'Reanudar el movimiento de la página' : 'Pausar el movimiento de la página';
  }
  pauseButton.addEventListener('click', () => { paused = !paused; updatePause(); });
  reducedMotion.addEventListener('change', event => { paused = event.matches; updatePause(); });
  artwork.addEventListener('pointermove', event => {
    const rect = artwork.getBoundingClientRect();
    pointer = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    if (!paused && event.pointerType !== 'touch' && event.timeStamp - lastPointerRipple > 160) {
      ripples.push({ ...pointer, radius: 3, opacity: .2 });
      lastPointerRipple = event.timeStamp;
      if (ripples.length > 18) ripples.shift();
    }
  });
  artwork.addEventListener('pointerleave', () => { pointer = null; });
  artwork.addEventListener('pointerdown', event => {
    if (event.target.closest('button') || paused) return;
    const rect = artwork.getBoundingClientRect();
    [4, 18, 32].forEach(radius => ripples.push({ x: event.clientX - rect.left, y: event.clientY - rect.top, radius, opacity: .3 }));
    while (ripples.length > 18) ripples.shift();
  });
  new ResizeObserver(resize).observe(artwork);
  new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    artwork.classList.toggle('is-offscreen', !inView);
  }).observe(artwork);

  const stageButtons = [...document.querySelectorAll('[data-stage]')];
  function setStage(next, focus = false) {
    const changed = stage !== next;
    stage = next;
    artwork.dataset.stage = String(stage);
    document.querySelector('#art-title').innerHTML = stages[stage].title;
    document.querySelector('.art-medium').innerHTML = `ESTUDIO GENERATIVO 001 <span> / </span> ${stages[stage].caption}`;
    document.querySelector('#cycle-description').textContent = stages[stage].description;
    document.querySelector('#cycle-description').setAttribute('aria-labelledby', `stage-${stage}`);
    if (changed) {
      animateEntry(document.querySelector('#art-title'), { distance: 18, duration: 550 });
      animateEntry(document.querySelector('#cycle-description'), { distance: 6, duration: 400 });
    }
    stageButtons.forEach((button, i) => {
      button.classList.toggle('selected', i === stage);
      button.setAttribute('aria-selected', String(i === stage));
      button.tabIndex = i === stage ? 0 : -1;
    });
    if (focus) stageButtons[stage].focus();
  }
  stageButtons.forEach((button, index) => {
    button.addEventListener('click', () => setStage(index));
    button.addEventListener('keydown', event => {
      const keys = { ArrowRight: (stage + 1) % 3, ArrowLeft: (stage + 2) % 3, Home: 0, End: 2 };
      if (event.key in keys) { event.preventDefault(); setStage(keys[event.key], true); }
    });
  });
  setStage(2);
  updatePause();
  resize();
  requestAnimationFrame(frame);

  function syncExpansion() {
    const expanded = document.fullscreenElement === artwork || artwork.classList.contains('is-expanded');
    expandButton.setAttribute('aria-pressed', String(expanded));
    expandButton.setAttribute('aria-label', expanded ? 'Salir de pantalla completa' : 'Ampliar experiencia');
  }
  expandButton.addEventListener('click', async () => {
    if (document.fullscreenElement === artwork) await document.exitFullscreen();
    else if (artwork.classList.contains('is-expanded')) artwork.classList.remove('is-expanded');
    else {
      try {
        if (!artwork.requestFullscreen) throw new Error('Fullscreen unsupported');
        await artwork.requestFullscreen();
      } catch { artwork.classList.add('is-expanded'); }
    }
    syncExpansion();
  });
  document.addEventListener('fullscreenchange', syncExpansion);
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && artwork.classList.contains('is-expanded')) { artwork.classList.remove('is-expanded'); syncExpansion(); expandButton.focus(); }
  });

  let audioContext;
  let gain;
  let soundOn = false;
  const soundButton = document.querySelector('.sound-button');
  soundButton.addEventListener('click', async () => {
    soundButton.disabled = true;
    try {
      if (!audioContext) {
        const Context = window.AudioContext || window.webkitAudioContext;
        if (!Context) throw new Error('Audio unavailable');
        audioContext = new Context();
        const buffer = audioContext.createBuffer(1, audioContext.sampleRate * 6, audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        let last = 0;
        for (let i = 0; i < data.length; i++) { last = (last + (Math.random() * 2 - 1) * .025) / 1.025; data[i] = last * 3; }
        const source = audioContext.createBufferSource();
        source.buffer = buffer;
        source.loop = true;
        const filter = audioContext.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 650;
        gain = audioContext.createGain();
        gain.gain.value = 0;
        source.connect(filter).connect(gain).connect(audioContext.destination);
        source.start();
      }
      await audioContext.resume();
      soundOn = !soundOn;
      gain.gain.setTargetAtTime(soundOn ? .3 : 0, audioContext.currentTime, .4);
      soundButton.innerHTML = `${icon(soundOn ? 'sound' : 'mute')}<span>${soundOn ? 'Desactivar sonido' : 'Activar sonido'}</span>`;
      soundButton.setAttribute('aria-label', soundOn ? 'Desactivar sonido ambiental' : 'Activar sonido ambiental');
      soundButton.setAttribute('aria-pressed', String(soundOn));
    } catch {
      const toast = document.querySelector('#toast');
      toast.textContent = 'Este navegador no permite iniciar el audio ambiental.';
      toast.classList.add('visible');
      setTimeout(() => toast.classList.remove('visible'), 4000);
    } finally { soundButton.disabled = false; }
  });
  document.addEventListener('visibilitychange', () => {
    if (!audioContext) return;
    if (document.hidden) audioContext.suspend().catch(() => {});
    else if (soundOn) audioContext.resume().catch(() => {});
  });
}
