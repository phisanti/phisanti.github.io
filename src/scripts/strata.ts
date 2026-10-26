/**
 * Strata field: horizontal lines that undulate slowly and bend away from the
 * pointer. Each line is two summed sines (periods ~30 s and ~39 s, amplitude
 * 14px). The loop runs only while the canvas is on screen and the tab is
 * visible; under reduced motion a single static frame is drawn.
 */
import { reducedMotion } from './reduced-motion';

export function initStrata(canvas: HTMLCanvasElement, host: HTMLElement) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const root = document.documentElement;
  const still = reducedMotion.matches;
  const dpr = Math.min(2, devicePixelRatio || 1);
  const far = -1e4;
  let width = 0, height = 0, lines = 30;
  let line = '', accent = '';
  let pointerX = far, pointerY = far, pushX = far, pushY = far;
  let onScreen = true, frame = 0;

  const readColors = () => {
    const style = getComputedStyle(root);
    line = style.getPropertyValue('--line').trim();
    accent = style.getPropertyValue('--line-acc').trim();
  };

  const draw = (t: number) => {
    pushX += (pointerX - pushX) * 0.08;
    pushY += (pointerY - pushY) * 0.08;
    ctx.clearRect(0, 0, width, height);
    const gap = (height + 40) / lines;
    for (let i = 0; i < lines; i++) {
      const y0 = -20 + (i + 0.5) * gap;
      const strong = i % 6 === 3;
      ctx.beginPath();
      for (let x = -10; x <= width + 10; x += 8) {
        const dx = x - pushX, dy = y0 - pushY;
        const push = 26 * Math.exp(-(dx * dx + dy * dy) / (2 * 95 * 95));
        const y = y0
          + 9 * Math.sin(x * 0.0062 + t * 0.21 + i * 0.37)
          + 5 * Math.sin(x * 0.013 - t * 0.16 + i * 0.91)
          + Math.sign(dy || 1) * push;
        if (x < 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = strong ? `rgba(${accent}, .42)` : `rgba(${line}, .13)`;
      ctx.lineWidth = strong ? 1.3 : 1;
      ctx.stroke();
    }
  };

  const now = () => (still ? 0 : performance.now() / 1000);

  const resize = () => {
    width = canvas.offsetWidth;
    height = canvas.offsetHeight;
    lines = width < 768 ? 18 : 30;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw(now());
  };

  readColors();
  resize();
  new ResizeObserver(resize).observe(canvas);
  new MutationObserver(() => {
    readColors();
    draw(now());
  }).observe(root, { attributes: true, attributeFilter: ['data-theme'] });
  if (still) return;

  host.addEventListener('pointermove', (event) => {
    const rect = canvas.getBoundingClientRect();
    pointerX = event.clientX - rect.left;
    pointerY = event.clientY - rect.top;
  });
  host.addEventListener('pointerleave', () => (pointerX = pointerY = far));

  const loop = (ms: number) => {
    draw(ms / 1000);
    frame = requestAnimationFrame(loop);
  };
  const update = () => {
    cancelAnimationFrame(frame);
    if (onScreen && !document.hidden) frame = requestAnimationFrame(loop);
  };
  new IntersectionObserver(([entry]) => {
    onScreen = entry.isIntersecting;
    update();
  }).observe(canvas);
  document.addEventListener('visibilitychange', update);
}
