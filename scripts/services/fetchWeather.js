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
    0: { kind: 'clear', label: 'Clear', hint: 'Небо открыто' },
    1: { kind: 'partly', label: 'Mostly clear', hint: 'Лёгкие облака' },
    2: { kind: 'cloudy', label: 'Cloudy', hint: 'Средняя облачность' },
    3: { kind: 'overcast', label: 'Cloudy', hint: 'Плотная облачность' },
    45: { kind: 'fog', label: 'Fog', hint: 'Видимость снижена' },
    48: { kind: 'fog', label: 'Rimo', hint: 'Холодный туман' },
    51: { kind: 'drizzle', label: 'Drizzle', hint: 'Лёгкий дождь' },
    53: { kind: 'drizzle', label: 'Drizzle', hint: 'Умеренный дождь' },
    55: { kind: 'drizzle', label: 'Drizzle', hint: 'Сильный дождь' },
    61: { kind: 'rain', label: 'Rain', hint: 'Продолжительные осадки' },
    63: { kind: 'rain', label: 'Rain', hint: 'Умеренный дождь' },
    65: { kind: 'rain', label: 'Downpour', hint: 'Сильный дождь' },
    71: { kind: 'snow', label: 'Snow', hint: 'Снегопад' },
    73: { kind: 'snow', label: 'Snow', hint: 'Умеренный снег' },
    75: { kind: 'snow', label: 'Snow', hint: 'Сильный снег' },
    95: { kind: 'storm', label: 'Thunderstorm', hint: 'Возможны молнии' },
    96: { kind: 'storm', label: 'Thunderstorm with hail', hint: 'Берегитесь града' },
    99: { kind: 'storm', label: 'Thunderstorm with hail', hint: 'Град и молнии' },
  };
  return map[code] ?? { kind: cover > 70 ? 'overcast' : 'partly', label: 'Cloudy', hint: 'Comfortable condition' };
}