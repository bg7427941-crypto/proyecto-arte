const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
const activeAnimations = new Set();
const elementAnimations = new WeakMap();
const observed = new Set();
let revealObserver;

export function motionAllowed() {
  return !preference.matches && !document.documentElement.classList.contains('motion-paused');
}

// Effects are progressive enhancement: cancelling always restores readable content.
export function animateEntry(element, { distance = 24, duration = 650, delay = 0 } = {}) {
  if (!element) return;
  elementAnimations.get(element)?.cancel();
  if (!motionAllowed() || !element.animate) return;
  const animation = element.animate([
    { opacity: 0, translate: `0 ${distance}px` },
    { opacity: 1, translate: '0 0' },
  ], { duration, delay, easing: 'cubic-bezier(.22, 1, .36, 1)', fill: 'backwards' });
  activeAnimations.add(animation);
  elementAnimations.set(element, animation);
  const release = () => {
    activeAnimations.delete(animation);
    if (elementAnimations.get(element) === animation) elementAnimations.delete(element);
  };
  animation.finished.then(release, release);
}

function settleAnimations() {
  activeAnimations.forEach(animation => animation.cancel());
  activeAnimations.clear();
}

export function setMotionPaused(paused) {
  document.documentElement.classList.toggle('motion-paused', paused);
  if (paused) settleAnimations();
}

export function observeReveals(elements, stagger = 0) {
  if (!revealObserver) return;
  for (const element of observed) {
    if (!element.isConnected) {
      revealObserver.unobserve(element);
      observed.delete(element);
      elementAnimations.get(element)?.cancel();
    }
  }
  [...elements].forEach((element, index) => {
    element.dataset.revealDelay = String(Math.min(index * stagger, 240));
    observed.add(element);
    revealObserver.observe(element);
  });
}

export function initMotion() {
  if ('IntersectionObserver' in window) {
    revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        revealObserver.unobserve(entry.target);
        observed.delete(entry.target);
        animateEntry(entry.target, { delay: Number(entry.target.dataset.revealDelay || 0) });
      });
    }, { threshold: .12, rootMargin: '0px 0px -24px 0px' });
    observeReveals(document.querySelectorAll('.intro .eyebrow-row, .intro h1, .intro-aside'), 120);
    observeReveals(document.querySelectorAll(
      '.section-heading, .archive-toolbar, .archive-foot, .memory-layout > div, .project-label, .project-content, .closing, .site-footer'
    ));
  }

  const progress = document.querySelector('.reading-progress');
  let scheduled = false;
  const updateProgress = () => {
    scheduled = false;
    const available = document.documentElement.scrollHeight - window.innerHeight;
    const value = available > 0 ? Math.min(1, Math.max(0, window.scrollY / available)) : 0;
    progress.style.setProperty('--reading-progress', String(value));
  };
  const scheduleProgress = () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(updateProgress);
  };
  window.addEventListener('scroll', scheduleProgress, { passive: true });
  window.addEventListener('resize', scheduleProgress);
  new ResizeObserver(scheduleProgress).observe(document.body);
  updateProgress();
  preference.addEventListener('change', () => { if (preference.matches) settleAnimations(); });
  document.addEventListener('visibilitychange', () => {
    document.documentElement.classList.toggle('motion-backgrounded', document.hidden);
    if (document.hidden) settleAnimations();
  });
}
