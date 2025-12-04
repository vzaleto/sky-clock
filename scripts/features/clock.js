import { dom } from '../dom.js';
import { state } from '../state.js';
import { capitalize, phaseLabel, pickTimePhase } from '../utils.js';
import { updatePiPClock } from './pip.js';

export function initClock(renderer) {
  updateClock(renderer);
  setInterval(() => updateClock(renderer), 1000);
}

function updateClock(renderer) {
  const now = new Date();
  const timeString = now.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
    second: undefined,
  });
 
  dom.floatingTime.textContent = timeString;

  const dateString = now.toLocaleDateString('ru-RU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
  const capitalizedDate = capitalize(dateString);
  // dom.date.textContent = capitalizedDate;
  dom.floatingDate.textContent = capitalizedDate;

  updateAnalogClock(now);
  updatePiPClock(now);

  if (state.weather) {
    const phase = pickTimePhase(now, state.weather.sunrise, state.weather.sunset);
    if (phase !== state.timePhase) {
      state.timePhase = phase;
      dom.phase.textContent = phaseLabel(phase);
      renderer.setScene({ timePhase: phase });
    }
  }
}

function updateAnalogClock(now) {
  if (!dom.hourHand || !dom.minuteHand || !dom.secondHand) return;
  const hours = now.getHours() % 12;
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  const hourAngle = (hours + minutes / 60) * 30;
  const minuteAngle = (minutes + seconds / 60) * 6;
  const secondAngle = seconds * 6;

  dom.hourHand.style.transform = `translate(-50%, -100%) rotate(${hourAngle}deg)`;
  dom.minuteHand.style.transform = `translate(-50%, -100%) rotate(${minuteAngle}deg)`;
  dom.secondHand.style.transform = `translate(-50%, -100%) rotate(${secondAngle}deg)`;
}

