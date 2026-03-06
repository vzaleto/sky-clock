export function location() {

    return new Promise((resolve, reject) => {

        if (navigator.geolocation) {
            // Если поддерживает, вызываем getCurrentPosition с тремя аргументами:
            // 1. success — функция, которая вызывается, если координаты получены
            // 2. error — функция, которая вызывается при ошибке
            // 3. options — задаем таймаут 8 секунд
            navigator.geolocation.getCurrentPosition(successCallback, errorCallback, {timeout: 8000})
        } else {
            console.warn('Geolocation browser error:');
            geoLocationByIp().then(function (result){
                resolve(result)
            })
        }

        // -------------------------------
        // Функция success — вызывается, если GPS вернул координаты
        // -------------------------------
        function successCallback(position) {
            const latitude = position.coords.latitude
            const longitude = position.coords.longitude;
            // -------------------------------
            // Функция error — вызывается, если GPS вернул ошибку
            // -------------------------------
            resolve({
                lat:latitude,
                lon:longitude
            })
        }
        // -------------------------------
        // Функция error — вызывается, если GPS вернул ошибку
        // -------------------------------
        function errorCallback(err) {
            console.warn('Geolocation error:', err);
            if (err.code === err.PERMISSION_DENIED) {
                console.warn('User denied geolocation. Using fallback.');
            } else if (err.code === err.POSITION_UNAVAILABLE) {
                console.warn('Position unavailable. Using fallback.');
            } else if (err.code === err.TIMEOUT) {
                console.warn('Geolocation timed out. Using fallback.');
            } else {
                console.warn('Geolocation error. Using fallback.');
            }
            // Теперь используем fallback: сначала пробуем IP
            geoLocationByIp().then(function (result){

                if(result){
                    resolve(result)
                }else{
                    resolve({lat: 50.4501, lon: 30.5234});
                }
            })

        }
    })
}

// https://api.ip2location.io/?key=67D4EB61C7FF989B1339DA0D6F473557&ip=188.163.50.254

export async function geoLocationByIp() {
    try {
        const response = await fetch(`http://ip-api.com/json/`);

        if (!response.ok) {
            throw new Error(`Could not find location for ${response.status}`);
        }
        const data = await response.json();

        return {
            lat: data.lat,
            lon: data.lon,
        }
    } catch (err) {
        console.error('Geolocation error:', err);
        return null
    }

}

export async function getCityName(lat,lon){

    try{
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=ru`);

        if(!response.ok){
            throw new Error(`Could not find location for ${response.status}`);
        }

        const data = await response.json();

        console.log(data)

        if(data.address.city ){
            return data.address.city
        }
        return "unknown city"
    }catch (error) {
        console.error(error);
       return "unknown city"
    }
}

// if(data.results && data.results.length > 0){
//     return data.results[0].name
// }