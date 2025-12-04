import { dom } from '../dom.js';

let pipWindow = null;
let pipElements = null;

const supportsPiP = () => typeof documentPictureInPicture?.requestWindow === 'function';

export function initPiP() {
  if (!dom.pinClock) return;
  if (supportsPiP()) {
    dom.pinClock.textContent = 'PiP окно';
    dom.pinClock.title = 'Открыть часы в отдельном PiP-окне';
  }
  dom.pinClock.addEventListener('click', async () => {
    if (!supportsPiP()) {
      fallbackPin();
      return;
    }
    if (pipWindow) {
      pipWindow.close();
      return;
    }
    await openPiPWindow();
  });
}

export function updatePiPClock(now) {
  if (!pipWindow || pipWindow.closed || !pipElements) return;
  const time = now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  const date = now.toLocaleDateString('ru-RU', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
  });
  pipElements.time.textContent = time;
  pipElements.date.textContent = date;

  const hours = now.getHours() % 12;
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  pipElements.hour.style.transform = `translate(-50%, -100%) rotate(${(hours + minutes / 60) * 30}deg)`;
  pipElements.minute.style.transform = `translate(-50%, -100%) rotate(${(minutes + seconds / 60) * 6}deg)`;
  pipElements.second.style.transform = `translate(-50%, -100%) rotate(${seconds * 6}deg)`;
}

async function openPiPWindow() {
  try {
    pipWindow = await documentPictureInPicture.requestWindow({
      width: 260,
      height: 300,
    });
  } catch (error) {
    console.warn('PiP window failed', error);
    fallbackPin();
    return;
  }
  renderPiPWindow();
  pipWindow.addEventListener(
    'pagehide',
    () => {
      pipWindow = null;
      pipElements = null;
      dom.pinClock.classList.remove('is-active');
    },
    { once: true },
  );
  dom.pinClock.classList.add('is-active');
}

function renderPiPWindow() {
  if (!pipWindow) return;
  const { document: pipDoc } = pipWindow;
  pipDoc.body.innerHTML = `
    <div class="pip-shell">
      <p style="display:none;" class="pip-chip">SkyClock</p>
       <p style="display:none;" class="pip-time">--:--</p>
      <div class="pip-analog">
        <div class="pip-face"></div>
        <span class="pip-hand pip-hour"></span>
        <span class="pip-hand pip-minute"></span>
        <span class="pip-hand pip-second"></span>
        <span class="pip-pin"></span>
      </div>
      <p style="display:none;" class="pip-date">--</p>
    </div>
  `;
  const style = pipDoc.createElement('style');
  style.textContent = `
    :root {
      color-scheme: dark;
    }
    body {
      margin: 0;
      font-family: 'Space Grotesk', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: radial-gradient(circle at 50% 20%, #1b2357, #060815 80%);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
    }
    .pip-shell {
      text-align: center;
      width: 100%;
    }
    .pip-chip {
      display: inline-flex;
      padding: 0.12rem 0.6rem;
      border-radius: 999px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-bottom: 0.3rem;
    }
    .pip-time {
      font-size: 2.4rem;
      margin: 0 0 0.5rem;
    }
    .pip-date {
      margin-top: 0.6rem;
      font-size: 0.95rem;
      text-transform: capitalize;
      color: rgba(255, 255, 255, 0.8);
    }
    .pip-analog {
      position: relative;
      width: 180px;
      height: 180px;
      margin: 0 auto;
      border-radius: 50%;
      border: 2px solid rgba(255, 255, 255, 0.2);
      background: radial-gradient(circle at 50% 30%, rgba(255,255,255,0.1), rgba(255,255,255,0.02) 60%, transparent);
      box-shadow: inset 0 0 25px rgba(0, 0, 0, 0.6);
    }
    .pip-face {
      position: absolute;
      inset: 12px;
      border-radius: 50%;
      border: 1px solid rgba(255, 255, 255, 0.08);
    }
    .pip-face::before {
      content: '';
      position: absolute;
      inset: -12px;
      border-radius: 50%;
      background-image: conic-gradient(
        rgba(255,255,255,0.12) 0deg 2deg,
        transparent 2deg 28deg
      );
      mask: radial-gradient(circle at center, transparent 70px, black 71px);
    }
    .pip-hand {
      position: absolute;
      left: 50%;
      bottom: 50%;
      width: 4px;
      border-radius: 999px;
      transform-origin: 50% 100%;
      transform: translate(-50%, -100%);
      background: #fff;
      transition: transform 0.2s ease;
    }
    .pip-hour {
      height: 45px;
      width: 5px;
      background: rgba(255,255,255,0.95);
      bottom:44px
    }
    .pip-minute {
      height: 70px;
      background: rgba(255,255,255,0.8);
      bottom: 24px;
    }
    .pip-second {
      height: 80px;
      width: 2px;
      background: #ff6b7c;
      bottom: 9px;
    }
    .pip-pin {
      position: absolute;
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: #fff;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      box-shadow: 0 0 10px rgba(255,255,255,0.4);
    }
    button {
      display: none;
    }
  `;
  pipDoc.head.appendChild(style);

  pipElements = {
    time: pipDoc.querySelector('.pip-time'),
    date: pipDoc.querySelector('.pip-date'),
    hour: pipDoc.querySelector('.pip-hour'),
    minute: pipDoc.querySelector('.pip-minute'),
    second: pipDoc.querySelector('.pip-second'),
  };
  requestAnimationFrame(() => updatePiPClock(new Date()));
}

function fallbackPin() {
  dom.floating.classList.add('is-visible');
  dom.floating.classList.toggle('is-pinned');
}

