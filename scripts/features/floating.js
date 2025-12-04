import { dom } from '../dom.js';

export function initFloatingClock() {
  dom.toggleFloating.addEventListener('click', () => {
    dom.floating.classList.toggle('is-visible');
  });

  dom.closeFloating.addEventListener('click', () => {
    dom.floating.classList.remove('is-visible');
  });

  dom.floatAlwaysOnTop.addEventListener('click', () => {
    dom.floating.classList.toggle('is-pinned');
  });

  enableDrag(dom.floating, dom.floatingHandle);
}

function enableDrag(element, handle) {
  if (!element || !handle) return;
  let startX = 0;
  let startY = 0;
  let startLeft = 0;
  let startTop = 0;
  let dragging = false;

  handle.addEventListener('pointerdown', (event) => {
    dragging = true;
    startX = event.clientX;
    startY = event.clientY;
    const rect = element.getBoundingClientRect();
    startLeft = rect.left;
    startTop = rect.top;
    handle.setPointerCapture(event.pointerId);
  });

  handle.addEventListener('pointermove', (event) => {
    if (!dragging) return;
    const dx = event.clientX - startX;
    const dy = event.clientY - startY;
    element.style.left = `${startLeft + dx}px`;
    element.style.top = `${startTop + dy}px`;
  });

  handle.addEventListener('pointerup', () => {
    dragging = false;
  });
}

