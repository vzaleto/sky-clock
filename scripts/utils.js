
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

export function openClose(btn, panel) {
    btn.addEventListener('click', function () {
        panel.classList.toggle('hidden');
         btn.classList.toggle('is-active');
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

    if(duration > maximumSpeed)   duration = maximumSpeed;
    if(duration < minimumSpeed)   duration = minimumSpeed;

    console.log(duration)
    root.style.setProperty("--cloud-speed", duration + "s");
}

export function getMoonPhase(time) {
    const date = new Date(time);
    const newMoon = new Date('2024-01-11T11:57:00Z');

    const days = (date - newMoon) / (1000 * 60 * 60 * 24);
    const cycle = 29.53;
    const phase = days % cycle;

    if (phase > 14 && phase < 16) return 'full';
    if (phase < 14) return 'waxing';
    return 'waning';
}

export function baloon(windSpeed){
    const root = document.documentElement;

}
// ======================================== kevin spacer ==================

export function capitalize(text) {
    return text ? text.charAt(0).toUpperCase() + text.slice(1) : text;
}

export function formatTime(date) {
    return date.toLocaleTimeString('ru-RU', {hour: '2-digit', minute: '2-digit',second: '2-digit',});
}

// export function phaseLabel(phase) {
//     return (
//         {
//             night: 'Ночь',
//             dawn: 'Рассвет',
//             day: 'День',
//             dusk: 'Закат',
//         }[phase] || 'День'
//     );
// }


export function nextAlarmTimestamp(timeValue) {
    const [hours, minutes] = timeValue.split(':').map(Number);
    const now = new Date();
    const target = new Date();
    target.setHours(hours, minutes, 0, 0);
    if (target <= now) target.setDate(target.getDate() + 1);
    return target.getTime();
}

// export function pickTimePhase(now, sunriseISO, sunsetISO) {
//     if (!sunriseISO || !sunsetISO) {
//         const hour = now.getHours();
//         if (hour < 5 || hour >= 22) return 'night';
//         if (hour < 9) return 'dawn';
//         if (hour >= 18) return 'dusk';
//         return 'day';
//     }
//     const sunrise = new Date(sunriseISO);
//     const sunset = new Date(sunsetISO);
//     const hour = now.getTime();
//     if (hour < sunrise.getTime() - 45 * 60 * 1000) return 'night';
//     if (hour < sunrise.getTime() + 60 * 60 * 1000) return 'dawn';
//     if (hour < sunset.getTime() - 60 * 60 * 1000) return 'day';
//     if (hour < sunset.getTime() + 45 * 60 * 1000) return 'dusk';
//     return 'night';
// }

// makeStars(phase) {
//   //   if (phase === 'day') return [];
//   //   const count = phase === 'night' ? 200 : 40;
//   //   return Array.from({ length: count }, () => ({
//   //     x: Math.random() * this.width,
//   //     y: Math.random() * (this.height * 0.7),
//   //     size: Math.random() * 1.5,
//   //     twinkle: Math.random(),
//   //   }));
//   // }
//if (!this.stars.length) return;
//     ctx.fillStyle = '#ffffff';
//     this.stars.forEach((star) => {
//       const twinkle = 0.3 + Math.sin(performance.now() * 0.001 + star.twinkle) * 0.3;
//       ctx.globalAlpha = twinkle;
//       ctx.beginPath();
//       ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
//       ctx.fill();
//     });
//     ctx.globalAlpha = 1;
//   }