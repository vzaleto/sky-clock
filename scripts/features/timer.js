import { dom } from '../dom.js';
import { state } from '../state.js';
import { formatTime } from '../utils.js';
import { playAlarmTone, showAlarmToast } from './notifications.js';

export function initTimer() {
  const updateReadout = () => {
    const { remaining, duration } = state.timer;
    const totalSeconds = Math.max(0, Math.floor(remaining / 1000));
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    dom.timerReadout.textContent = `${minutes}:${seconds}`;
    const progress = duration ? 100 - (remaining / duration) * 100 : 0;
    dom.timerProgress.style.width = `${Math.min(100, Math.max(0, progress))}%`;
  };

  const stopTicker = () => {
    if (state.timer.ticker) {
      clearInterval(state.timer.ticker);
      state.timer.ticker = null;
    }
  };

  const startTicker = () => {
    stopTicker();
    state.timer.ticker = setInterval(() => {
      state.timer.remaining -= 200;
      if (state.timer.remaining <= 0) {
        state.timer.remaining = 0;
        stopTicker();
        state.timer.running = false;
        showAlarmToast('Таймер завершён', formatTime(new Date()));
        playAlarmTone();
      }
      updateReadout();
    }, 200);
  };

  dom.timerForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const minutes = Math.max(0, Number(dom.timerMinutes.value) || 0);
    const seconds = Math.max(0, Math.min(59, Number(dom.timerSeconds.value) || 0));
    const duration = (minutes * 60 + seconds) * 1000;
    if (!duration) return;
    state.timer.duration = duration;
    state.timer.remaining = duration;
    state.timer.running = true;
    startTicker();
    updateReadout();
  });

  dom.pauseTimer.addEventListener('click', () => {
    if (!state.timer.running) return;
    state.timer.running = false;
    stopTicker();
  });

  dom.resetTimer.addEventListener('click', () => {
    stopTicker();
    state.timer.running = false;
    state.timer.remaining = state.timer.duration;
    updateReadout();
  });

  updateReadout();
}

