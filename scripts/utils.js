export function capitalize(text) {
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : text;
}

export function formatTime(date) {
  return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
}

export function phaseLabel(phase) {
  return (
    {
      night: 'Ночь',
      dawn: 'Рассвет',
      day: 'День',
      dusk: 'Закат',
    }[phase] || 'День'
  );
}

export function terrainLabel(key) {
  return (
    {
      sea: 'Побережье',
      mountain: 'Горы',
      plain: 'Равнина',
    }[key] || 'Равнина'
  );
}

export function nextAlarmTimestamp(timeValue) {
  const [hours, minutes] = timeValue.split(':').map(Number);
  const now = new Date();
  const target = new Date();
  target.setHours(hours, minutes, 0, 0);
  if (target <= now) target.setDate(target.getDate() + 1);
  return target.getTime();
}

export function pickTimePhase(now, sunriseISO, sunsetISO) {
  if (!sunriseISO || !sunsetISO) {
    const hour = now.getHours();
    if (hour < 5 || hour >= 22) return 'night';
    if (hour < 9) return 'dawn';
    if (hour >= 18) return 'dusk';
    return 'day';
  }
  const sunrise = new Date(sunriseISO);
  const sunset = new Date(sunsetISO);
  const hour = now.getTime();
  if (hour < sunrise.getTime() - 45 * 60 * 1000) return 'night';
  if (hour < sunrise.getTime() + 60 * 60 * 1000) return 'dawn';
  if (hour < sunset.getTime() - 60 * 60 * 1000) return 'day';
  if (hour < sunset.getTime() + 45 * 60 * 1000) return 'dusk';
  return 'night';
}

