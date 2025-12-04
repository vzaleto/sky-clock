import { pickTimePhase } from '../utils.js';

export async function fetchWeather({ latitude, longitude }) {
  const params = new URLSearchParams({
    latitude,
    longitude,
    current_weather: 'true',
    hourly: 'visibility,cloudcover_mid',
    daily: 'sunrise,sunset',
    timezone: 'auto',
  });
  const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`);
  if (!response.ok) throw new Error('Weather API failed');
  const data = await response.json();
  const current = data.current_weather;
  const sunrise = data.daily?.sunrise?.[0];
  const sunset = data.daily?.sunset?.[0];
  const visibility = data.hourly?.visibility?.[0] ?? 10_000;
  const cover = data.hourly?.cloudcover_mid?.[0] ?? 0;

  const info = decodeWeather(current.weathercode, cover);
  const terrain = detectTerrain(data.elevation, latitude);
  const timePhase = pickTimePhase(new Date(), sunrise, sunset);

  return {
    temperature: current.temperature,
    wind: current.windspeed,
    visibilityKm: Math.max(1, Math.round(visibility / 1000)),
    kind: info.kind,
    description: info.label,
    hint: info.hint,
    sunrise,
    sunset,
    terrain,
    timePhase,
  };
}

export function detectTerrain(elevation = 0, latitude = 0) {
  if (elevation < 40 && Math.abs(latitude) <= 60) return 'sea';
  if (elevation > 1100) return 'mountain';
  return 'plain';
}

export function decodeWeather(code, cover = 0) {
  const map = {
    0: { kind: 'clear', label: 'Ясно', hint: 'Небо открыто' },
    1: { kind: 'partly', label: 'Преимущественно ясно', hint: 'Лёгкие облака' },
    2: { kind: 'cloudy', label: 'Облачно', hint: 'Средняя облачность' },
    3: { kind: 'overcast', label: 'Пасмурно', hint: 'Плотная облачность' },
    45: { kind: 'fog', label: 'Туман', hint: 'Видимость снижена' },
    48: { kind: 'fog', label: 'Изморозь', hint: 'Холодный туман' },
    51: { kind: 'drizzle', label: 'Морось', hint: 'Лёгкий дождь' },
    53: { kind: 'drizzle', label: 'Морось', hint: 'Умеренный дождь' },
    55: { kind: 'drizzle', label: 'Морось', hint: 'Сильный дождь' },
    61: { kind: 'rain', label: 'Дождь', hint: 'Продолжительные осадки' },
    63: { kind: 'rain', label: 'Дождь', hint: 'Умеренный дождь' },
    65: { kind: 'rain', label: 'Ливень', hint: 'Сильный дождь' },
    71: { kind: 'snow', label: 'Снег', hint: 'Снегопад' },
    73: { kind: 'snow', label: 'Снег', hint: 'Умеренный снег' },
    75: { kind: 'snow', label: 'Снег', hint: 'Сильный снег' },
    95: { kind: 'storm', label: 'Гроза', hint: 'Возможны молнии' },
    96: { kind: 'storm', label: 'Гроза с градом', hint: 'Берегитесь града' },
    99: { kind: 'storm', label: 'Гроза с градом', hint: 'Град и молнии' },
  };
  return map[code] ?? { kind: cover > 70 ? 'overcast' : 'partly', label: 'Переменная облачность', hint: 'Комфортные условия' };
}

