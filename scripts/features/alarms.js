import { dom } from '../dom.js';
import { state } from '../state.js';
import { nextAlarmTimestamp } from '../utils.js';
import { playAlarmTone, showAlarmToast } from './notifications.js';

export function initAlarms() {
  dom.alarmForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const timeValue = dom.alarmTime.value;
    if (!timeValue) return;
    const label = dom.alarmLabel.value.trim() || 'Будильник';
    const nextTrigger = nextAlarmTimestamp(timeValue);
    const alarm = {
      id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
      time: timeValue,
      label,
      enabled: true,
      nextTrigger,
    };
    state.alarms.push(alarm);
    dom.alarmForm.reset();
    renderAlarms();
  });

  dom.alarmsList.addEventListener('change', (event) => {
    if (!event.target.classList.contains('alarm-toggle')) return;
    const row = event.target.closest('.alarm-row');
    const id = row?.dataset.id;
    const alarm = state.alarms.find((item) => item.id === id);
    if (alarm) {
      alarm.enabled = event.target.checked;
      alarm.nextTrigger = nextAlarmTimestamp(alarm.time);
    }
  });

  dom.alarmsList.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-action="delete"]');
    if (!button) return;
    const row = button.closest('.alarm-row');
    const id = row?.dataset.id;
    state.alarms = state.alarms.filter((item) => item.id !== id);
    renderAlarms();
  });

  setInterval(checkAlarms, 1000);
}

function renderAlarms() {
  dom.alarmsList.innerHTML = '';
  if (!state.alarms.length) {
    dom.alarmsList.classList.add('empty');
    dom.alarmsList.innerHTML = '<p>Будильников пока нет</p>';
    return;
  }
  dom.alarmsList.classList.remove('empty');

  state.alarms
    .slice()
    .sort((a, b) => a.nextTrigger - b.nextTrigger)
    .forEach((alarm) => {
      const fragment = dom.alarmTemplate.content.cloneNode(true);
      const row = fragment.querySelector('.alarm-row');
      row.dataset.id = alarm.id;
      fragment.querySelector('.alarm-time').textContent = alarm.time;
      fragment.querySelector('.alarm-label').textContent = alarm.label;
      fragment.querySelector('.alarm-toggle').checked = alarm.enabled;
      dom.alarmsList.appendChild(fragment);
    });
}

function checkAlarms() {
  if (!state.alarms.length) return;
  const now = Date.now();
  state.alarms.forEach((alarm) => {
    if (!alarm.enabled) return;
    if (Math.abs(alarm.nextTrigger - now) <= 1000) {
      alarm.enabled = false;
      showAlarmToast(alarm.label, alarm.time);
      playAlarmTone();
      alarm.nextTrigger = nextAlarmTimestamp(alarm.time);
      renderAlarms();
    }
  });
}

