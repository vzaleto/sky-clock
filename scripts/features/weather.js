import {geoLocationByIp, getCityName, location} from "../services/location.js";
import {decodeWeather, fetchWeather} from "../services/fetchWeather.js";
import {dom} from "../dom.js";
import {state} from "../state.js";
import {cloudSpeed, getMoonOrSun, getMoonPhase, getTimePhase, moveCloud} from "../utils.js";

export async function weatherInit() {

    const fetchAndREnder = async ()=>{

        try{
            const coords = await location();
            const city = await getCityName(coords.lat, coords.lon);
            const weather = await fetchWeather(coords);
            const weatherDecode = decodeWeather(weather.weatherCode, weather.clouds);
            console.log(weather)

            state.weather = weather;
            state.location = city;
            state.timePhase = getTimePhase();
            state.weatherDecode = weatherDecode;
            state.moonPhase = getMoonPhase(weather.time)

            renderWeather(state)
            moveCloud(state.weather.direction,dom.cloud)
            cloudSpeed(state.weather.wind)

        }catch (err){
            console.warn('Some error ',err)
        }

    }
    await fetchAndREnder()

    dom.refreshWeather.addEventListener('click', fetchAndREnder)
}



function renderWeather({location,weather,weatherDecode,timePhase,moonPhase}){
    dom.temp.textContent = `${Math.round(weather.temperature)} °C`
    dom.wind.textContent = `${(weather.wind / 3.6).toFixed(1)} м/с`;
    dom.visibility.textContent = `${weather.visibilityKm} км`;
    dom.phase.textContent = timePhase;
    dom.summary.textContent = weatherDecode.label;
    dom.location.textContent = location;
    document.body.dataset.weather = weatherDecode.kind;
    document.body.dataset.phase = timePhase;
    document.body.dataset.light = getMoonOrSun(weather.sunrise,weather.sunset);
    document.body.dataset.moon = moonPhase;
    dom.windArrow.style.transform = `rotate(${weather.windDirection + 180}deg)`;
}



// import { dom } from '../dom.js';
// import { state } from '../state.js';
// import { phaseLabel } from '../utils.js';
// import { resolveLocation } from '../services/location.js';
// import { fetchWeather } from '../services/fetchWeather.js';
//
// export function initWeather(renderer) {
//   const fetchAndRender = async () => {
//     dom.refreshWeather.disabled = true;
//     dom.refreshWeather.textContent = '…';
//     try {
//       const location = await resolveLocation();
//       state.location = location;
//       dom.location.textContent = location.label;
//       dom.accuracy.textContent = `точность ±${location.accuracyKm.toFixed(0)} км`;
//
//       const weather = await fetchWeather(location);
//       console.log(weather)
//       state.weather = weather;
//       state.timePhase = weather.timePhase;
//       document.body.dataset.weather = weather.kind;
//       document.body.dataset.phase = weather.timePhase;
//
//       dom.summary.textContent = weather.description;
//       dom.temp.textContent = `${Math.round(weather.temperature)} °C`;
//       dom.wind.textContent = `${(weather.wind / 3.6).toFixed(1)} м/с`;
//       dom.visibility.textContent = `${weather.visibilityKm} км`;
//       dom.phase.textContent = phaseLabel(weather.timePhase);
//       dom.hint.textContent = location.warning ? `${location.warning} ${weather.hint}` : weather.hint;
//
//       renderer.setScene({
//         timePhase: weather.timePhase,
//         weather: weather.kind,
//         visibility: weather.visibilityKm,
//         wind: weather.wind,
//         terrain: weather.terrain,
//       });
//     } catch (error) {
//       console.warn(error);
//       // dom.hint.textContent = 'Не удалось получить погоду. Используем офлайн-сцену.';
//       console.log('Не удалось получить погоду. Используем офлайн-сцену.')
//       renderer.setScene({ timePhase: state.timePhase, weather: 'clear' });
//     } finally {
//       dom.refreshWeather.disabled = false;
//       dom.refreshWeather.textContent = 'Обновить';
//     }
//   };
//
//   fetchAndRender();
//   dom.refreshWeather.addEventListener('click', fetchAndRender);
// }
//
