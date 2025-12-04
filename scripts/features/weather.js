import { dom } from '../dom.js';
import { state } from '../state.js';
import { phaseLabel, terrainLabel } from '../utils.js';
import { resolveLocation } from '../services/location.js';
import { fetchWeather } from '../services/weather-api.js';

export function initWeather(renderer) {
  const fetchAndRender = async () => {
    dom.refreshWeather.disabled = true;
    dom.refreshWeather.textContent = '…';
    try {
      const location = await resolveLocation();
      state.location = location;
      dom.location.textContent = location.label;
      dom.accuracy.textContent = `точность ±${location.accuracyKm.toFixed(0)} км`;

      const weather = await fetchWeather(location);
      state.weather = weather;
      state.timePhase = weather.timePhase;
      dom.summary.textContent = weather.description;
      dom.temp.textContent = `${Math.round(weather.temperature)} °C`;
      dom.wind.textContent = `${(weather.wind / 3.6).toFixed(1)} м/с`;
      dom.visibility.textContent = `${weather.visibilityKm} км`;
      dom.terrain.textContent = terrainLabel(weather.terrain);
      dom.phase.textContent = phaseLabel(weather.timePhase);
      dom.hint.textContent = location.warning ? `${location.warning} ${weather.hint}` : weather.hint;

      renderer.setScene({
        timePhase: weather.timePhase,
        weather: weather.kind,
        visibility: weather.visibilityKm,
        wind: weather.wind,
        terrain: weather.terrain,
      });
    } catch (error) {
      console.warn(error);
      dom.hint.textContent = 'Не удалось получить погоду. Используем офлайн-сцену.';
      renderer.setScene({ timePhase: state.timePhase, weather: 'clear' });
    } finally {
      dom.refreshWeather.disabled = false;
      dom.refreshWeather.textContent = 'Обновить';
    }
  };

  fetchAndRender();
  dom.refreshWeather.addEventListener('click', fetchAndRender);
}

