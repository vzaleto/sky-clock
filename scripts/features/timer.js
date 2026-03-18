import {dom} from "../dom.js";

const timeState = {
  duration:0,//продолжительность
  endTime:null,
  interval:null,
  running:false,
    remaining:0
}
const seconds = 1000;
const minutes = Math.floor( 60 * seconds);
const hours = Math.floor( 60 * minutes);


export function initTimer(){
    dom.timerForm.addEventListener('submit', (event)=>{
        event.preventDefault();
        const hours = Number(dom.timerHours.value) || 0;
        const minutes = Number(dom.timerMinutes.value) || 0;
        const seconds = Number(dom.timerSeconds.value) || 0;

        console.log(hours + ':' + minutes + ':' + seconds)

        const duration = (hours * 3600000) + (minutes * 60000) + (seconds * 1000);

        console.log(duration)
        startTimer(duration);

         dom.timerHours.value = "";
        dom.timerMinutes.value = "";
        dom.timerSeconds.value = "";
    } );

    dom.pauseTimer.addEventListener('click',()=>{

        if(timeState.running){
            pausedTimer();
            dom.pauseTimer.textContent = 'resuming'
        }else{
            dom.pauseTimer.textContent = 'paused'
            resumedTimer()
        }
    }  );

    dom.resetTimer.addEventListener('click', resetTimer)
}


export function startTimer(duration){

  if(timeState.interval){
    clearInterval(timeState.interval);
    timeState.interval = null
  }
    timeState.running = true;

  const dateNow = Date.now();

  timeState.endTime = duration + dateNow;

  timeState.interval = setInterval(()=>{

    timeState.remaining =  timeState.endTime - Date.now();

    const totalSeconds = Math.floor(timeState.remaining / 1000);
    const seconds = totalSeconds % 60;
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const hours = Math.floor(totalSeconds / 3600);

    console.log(String(hours).padStart(2,'0') + ':' + String(minutes).padStart(2,'0') + ':' + String(seconds).padStart(2,'0'));
dom.timerReadout.textContent = String(hours).padStart(2,'0') + ':' + String(minutes).padStart(2,'0') + ':' + String(seconds).padStart(2,'0')
    if(timeState.remaining <= 0){
        timeState.remaining = 0;
      clearInterval(timeState.interval);
      timeState.running = false;
    }
  },1000)
}

function pausedTimer(){
    console.log("pausedTimer", timeState.remaining);
  timeState.duration = timeState.remaining;
  clearInterval(timeState.interval);
    timeState.interval = null
    timeState.running = false;
}
function resumedTimer(){
    console.log('timeState.duration',timeState.duration)
  startTimer(timeState.duration);
}
function resetTimer(){
    clearInterval(timeState.interval);
    timeState.interval = null;

    timeState.running = false;
    timeState.remaining = 0;
    timeState.duration=0;
    timeState.endTime = null;
    dom.timerReadout.textContent= '00:00:00';

}






// import { dom } from '../dom.js';
// import { state } from '../state.js';
// import { formatTime } from '../utils.js';
// import { playAlarmTone, showAlarmToast } from './notifications.js';
//
// export function initTimer() {
//   const updateReadout = () => {
//     const { remaining, duration } = state.timer;
//     const totalSeconds = Math.max(0, Math.floor(remaining / 1000));
//     const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
//     const seconds = String(totalSeconds % 60).padStart(2, '0');
//     dom.timerReadout.textContent = `${minutes}:${seconds}`;
//     const progress = duration ? 100 - (remaining / duration) * 100 : 0;
//     dom.timerProgress.style.width = `${Math.min(100, Math.max(0, progress))}%`;
//     console.log(state.timer);
//     setLocalStation(state.timer)
//   };
//
//   const stopTicker = () => {
//     if (state.timer.ticker) {
//       clearInterval(state.timer.ticker);
//       state.timer.ticker = null;
//     }
//   };
//
//   const startTicker = () => {
//     stopTicker();
//     state.timer.ticker = setInterval(() => {
//       state.timer.remaining -= 200;
//       if (state.timer.remaining <= 0) {
//         state.timer.remaining = 0;
//         stopTicker();
//         state.timer.running = false;
//         showAlarmToast('Таймер завершён', formatTime(new Date()));
//         playAlarmTone();
//       }
//       updateReadout();
//     }, 200);
//   };
//
//   dom.timerForm.addEventListener('submit', (event) => {
//     event.preventDefault();
//     const minutes = Math.max(0, Number(dom.timerMinutes.value) || 0);
//     const seconds = Math.max(0, Math.min(59, Number(dom.timerSeconds.value) || 0));
//     const duration = (minutes * 60 + seconds) * 1000;
//     if (!duration) return;
//     state.timer.duration = duration;
//     state.timer.remaining = duration;
//     state.timer.running = true;
//
//     startTicker();
//     updateReadout();
//   });
//
//   dom.pauseTimer.addEventListener('click', () => {
//     if (!state.timer.running) return;
//     state.timer.running = false;
//     stopTicker();
//   });
//
//   dom.resetTimer.addEventListener('click', () => {
//     stopTicker();
//     state.timer.running = false;
//     state.timer.remaining = state.timer.duration;
//     updateReadout();
//   });
//
//   updateReadout();
//
//   function setLocalStation(timer){
//    return localStorage.setItem('timer', JSON.stringify(timer))
//   }
//   function getLocalStation(){
//     return JSON.parse(localStorage.getItem('timer'))
//   }
// }
//
