import { dom } from '../dom.js';
import { state } from '../state.js';
import { capitalize} from '../utils.js';
import { updatePiPClock } from './pip.js';

export function initClock() {
  updateClock();
  setInterval(() => updateClock(), 1000);
}

function updateClock() {
  const now = new Date();
  const timeString = now.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
 
  dom.floatingTime.textContent = timeString;

  const dateString = now.toLocaleDateString('ru-RU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
  const capitalizedDate = capitalize(dateString);
  dom.date.textContent = capitalizedDate;
  dom.floatingDate.textContent = capitalizedDate;

  updateAnalogClock(now);
  updatePiPClock(now);
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

