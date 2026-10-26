/**
 * Shared motion kit: hero intro, section reveal, theme toggle, phone menu and
 * reading progress. Each part activates only when its markup is on the page.
 * Animation itself lives in motion.css; this module only flips state.
 */
import { reducedMotion } from './reduced-motion';

const root = document.documentElement;

/* Intro: hero children fade up on the first visit of a session. */
const intro = document.querySelector<HTMLElement>('[data-intro]');
if (intro && !reducedMotion.matches) {
  let seen = true;
  try {
    seen = sessionStorage.getItem('intro-seen') !== null;
    sessionStorage.setItem('intro-seen', '1');
  } catch {
    // Storage unavailable: skip the intro rather than replay it on every page.
  }
  if (!seen) intro.dataset.intro = 'play';
}

/* Reveal: [data-reveal] sections fade up once, at 15% visibility. */
if (!reducedMotion.matches) {
  const reveal = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        (entry.target as HTMLElement).dataset.reveal = 'in';
        reveal.unobserve(entry.target);
      }
    },
    { threshold: 0.15 },
  );
  for (const section of document.querySelectorAll<HTMLElement>('[data-reveal]')) {
    section.dataset.reveal = 'out';
    reveal.observe(section);
  }
}

/* Theme toggle: circular reveal from the button where View Transitions exist. */
const themeColor = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
for (const button of document.querySelectorAll<HTMLElement>('.theme-toggle')) {
  button.addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    const apply = () => {
      root.dataset.theme = next;
      try {
        localStorage.setItem('theme', next);
      } catch {
        // Storage can be unavailable (private mode); the switch still applies.
      }
      if (themeColor) themeColor.content = getComputedStyle(root).getPropertyValue('--bg').trim();
    };
    if (!document.startViewTransition || reducedMotion.matches) return apply();
    const rect = button.getBoundingClientRect();
    root.style.setProperty('--reveal-x', `${rect.left + rect.width / 2}px`);
    root.style.setProperty('--reveal-y', `${rect.top + rect.height / 2}px`);
    document.startViewTransition(apply);
  });
}

/* Phone menu: Esc and clicks outside close it; motion.css animates the opening. */
const menuButton = document.querySelector<HTMLButtonElement>('.menu-button');
const drawer = document.getElementById('mobile-menu');
if (menuButton && drawer) {
  const setOpen = (open: boolean) => {
    drawer.hidden = !open;
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.textContent = open ? 'CLOSE' : 'MENU';
    if (open) drawer.querySelector('a')?.focus();
  };
  menuButton.addEventListener('click', () => setOpen(menuButton.getAttribute('aria-expanded') !== 'true'));
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || drawer.hidden) return;
    setOpen(false);
    menuButton.focus();
  });
  document.addEventListener('click', (event) => {
    const target = event.target as Node;
    if (!drawer.hidden && !drawer.contains(target) && !menuButton.contains(target)) setOpen(false);
  });
}

/* Reading progress: the bar's scaleX follows the scroll position. */
const progress = document.querySelector<HTMLElement>('.reading-progress');
if (progress) {
  let queued = false;
  const measure = () => {
    queued = false;
    const range = root.scrollHeight - innerHeight;
    progress.style.setProperty('--progress', String(range > 0 ? Math.min(1, scrollY / range) : 0));
  };
  const schedule = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(measure);
  };
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule);
  measure();
}
