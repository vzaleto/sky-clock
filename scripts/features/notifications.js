import { dom } from '../dom.js';
import { state } from '../state.js';

let audioCtx;

export function initNotifications() {
  dom.dismissAlarm.addEventListener('click', () => {
    dom.alarmToast.classList.remove('is-visible');
  });
}

export function showAlarmToast(label, time) {
  dom.alarmToastText.textContent = `${label} (${time})`;
  dom.alarmToast.classList.add('is-visible');
  clearTimeout(state.toastTimer);
  state.toastTimer = setTimeout(() => {
    dom.alarmToast.classList.remove('is-visible');
  }, 5000);
}

export function playAlarmTone() {
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const duration = 1.2;
    const oscillator = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    oscillator.type = 'triangle';
    oscillator.frequency.value = 640;
    gain.gain.value = 0.001;
    gain.gain.exponentialRampToValueAtTime(0.4, audioCtx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
    oscillator.connect(gain).connect(audioCtx.destination);
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + duration);
  } catch (error) {
    console.warn('Web Audio недоступен', error);
  }
}

