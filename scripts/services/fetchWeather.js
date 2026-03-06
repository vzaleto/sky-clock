export async function fetchWeather({lat, lon}) {
    console.log("w")
    try {
        const urlSearchParams = new URLSearchParams({
            latitude: lat,
            longitude: lon,
            current_weather: true,
            hourly: 'visibility,cloudcover_mid',
            daily: 'sunrise,sunset',
            timezone: 'auto',
        })

        const url = `https://api.open-meteo.com/v1/forecast?${urlSearchParams.toString()}`

        const response = await fetch(url);

        if(!response.ok){
          throw new Error('weather API failed')
        }

   const data = await response.json();
        const currentHourIndex = 0;
        const clouds = data.hourly.cloudcover_mid[currentHourIndex] ?? 0;
        const visibility = data.hourly.visibility[currentHourIndex] ?? 1000;

        return {
            temperature:data.current_weather.temperature ,
            wind:data.current_weather.windspeed,
            windDirection:data.current_weather.winddirection,
            time:data.current_weather.time,
            clouds,
            visibilityKm: Math.round(visibility / 1000), // переводим в км
            weatherCode:data.current_weather.weathercode,
            sunrise:data.daily.sunrise[currentHourIndex],
            sunset:data.daily.sunset[currentHourIndex],

        }
    } catch (err) {
        console.log(err)

    }
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