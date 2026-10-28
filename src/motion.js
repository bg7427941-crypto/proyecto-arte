import { gsap } from 'gsap';

const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
const activeAnimations = new Set();
const activeTweens = new Set();
const contentTransitions = new WeakMap();
const elementAnimations = new WeakMap();
const observed = new Set();
let revealObserver;

export function motionAllowed() {
  const root = document.documentElement;
  return (!preference.matches || root.classList.contains('motion-override')) && !root.classList.contains('motion-paused');
}

// Register finite GSAP effects so pause / reduced motion always reach a readable end state.
export function tween(target, options) {
  const { onComplete, onInterrupt, ...properties } = options;
  if (!motionAllowed()) {
    gsap.set(target, { ...properties, duration: 0, delay: 0 });
    onComplete?.();
    return null;
  }
  let animation;
  animation = gsap.to(target, {
    ...properties,
    onComplete: () => { activeTweens.delete(animation); onComplete?.(); },
    onInterrupt: () => { activeTweens.delete(animation); onInterrupt?.(); },
  });
  if (animation.isActive() || animation.progress() < 1) activeTweens.add(animation);
  return animation;
}

// Retain the outgoing view while the new one enters; each host owns its interruption cleanup.
export function transitionContent(host, update, { direction = 1, distance = 48, duration = .8 } = {}) {
  const current = host.querySelector(':scope > .transition-current');
  if (!current) { update(); return; }
  const previousHeight = host.getBoundingClientRect().height;
  const previousStyle = getComputedStyle(current);
  const opacity = previousStyle.opacity;
  const transform = previousStyle.transform;
  const leaving = current.cloneNode(true);
  contentTransitions.get(host)?.();
  update();
  if (!motionAllowed()) return;

  leaving.classList.replace('transition-current', 'transition-leaving');
  leaving.removeAttribute('id');
  leaving.querySelectorAll('[id]').forEach(element => element.removeAttribute('id'));
  leaving.setAttribute('aria-hidden', 'true');
  leaving.inert = true;
  host.append(leaving);
  const style = getComputedStyle(host);
  const padding = parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
  const nextHeight = Math.max(current.offsetHeight + padding, parseFloat(style.minHeight) || 0);
  const owned = [];
  const cleanup = () => {
    owned.forEach(animation => animation?.kill());
    leaving.remove();
    gsap.set(current, { clearProps: 'transform,opacity' });
    gsap.set(host, { clearProps: 'height' });
    if (contentTransitions.get(host) === cleanup) contentTransitions.delete(host);
  };
  contentTransitions.set(host, cleanup);
  gsap.set(leaving, { opacity, transform });
  gsap.set(host, { height: previousHeight });
  gsap.set(current, { opacity: 0, x: direction * distance });
  owned.push(tween(leaving, { x: `-=${direction * distance}`, opacity: 0, duration: duration * .55, ease: 'power2.inOut', onComplete: () => leaving.remove() }));
  owned.push(tween(host, { height: nextHeight, duration, ease: 'power3.inOut' }));
  owned.push(tween(current, { x: 0, opacity: 1, delay: duration * .4, duration, ease: 'power3.out', onComplete: cleanup }));
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
  [...activeTweens].forEach(animation => { animation.totalProgress(1); animation.kill(); });
  activeTweens.clear();
}

export function setMotionPaused(paused, { userInitiated = false } = {}) {
  const root = document.documentElement;
  root.classList.toggle('motion-override', userInitiated && !paused && preference.matches);
  root.classList.toggle('motion-paused', paused);
  const notice = document.querySelector('.motion-notice');
  if (notice) notice.hidden = !preference.matches || root.classList.contains('motion-override');
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
