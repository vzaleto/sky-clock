export function getTimePhase() {
    const hours = new Date().getHours();
    if (hours >= 5 && hours < 12) return 'morning';
    if (hours >= 12 && hours < 17) return 'day';
    if (hours >= 17 && hours < 22) return 'evening';
    if (hours >= 22 && hours < 5) return 'night';
}

export function getMoonOrSun(sunrise, sunset) {
    console.log(sunrise, sunset)
    const now = new Date();
    const nowSunrise = new Date(sunrise);
    const nowSunset = new Date(sunset);
    if (now >= nowSunrise && now < nowSunset) {
        return 'sun'
    }
    return 'moon'

}

export function getMoonPhase(time) {
    console.log("getMoonPhase", time)
    const date = new Date(time)
    const day = date.getDate();
    console.log(day)
    if (day > 13 && day < 17) return 'full';
    if (day < 15) return 'waxing';
    return 'waning';
}

export function openClose(btn, panel) {
    btn.addEventListener('click', function () {
        panel.classList.toggle('hidden');
    })
}
export function moveCloud(windDirection, elem){
    console.log(elem)
    elem.forEach((elem)=>{
        if(windDirection > 90 && windDirection <270){
            elem.style.animationDirection = "normal"
        }else{
            elem.style.animationDirection = "reverse"
        }
    })
}
export function cloudSpeed(windSpeed){
    const root = document.documentElement;
    let maximumSpeed = 80;
    let minimumSpeed = 15;

    let duration = 80 - (windSpeed * 3)

    if(duration > maximumSpeed) return  duration = maximumSpeed;
    if(duration < minimumSpeed) return  duration = minimumSpeed;

    console.log(duration)
    root.style.setProperty("--cloud-speed", duration + "s");
}
// ======================================== kevin spacer ==================

export function capitalize(text) {
    return text ? text.charAt(0).toUpperCase() + text.slice(1) : text;
}

export function formatTime(date) {
    return date.toLocaleTimeString('ru-RU', {hour: '2-digit', minute: '2-digit'});
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

