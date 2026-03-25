import {dom} from "../dom.js";

const timeState = {
  duration:0,//продолжительность
  endTime:null,
  interval:null,
  running:false,
    remaining:0
}

export function initTimer(){
    dom.timerForm.addEventListener('submit', (event)=>{
        event.preventDefault();

        const hours = Number(dom.timerHours.value) || 0;
        const minutes = Number(dom.timerMinutes.value) || 0;
        const seconds = Number(dom.timerSeconds.value) || 0;

        console.log(hours + ':' + minutes + ':' + seconds)

        const duration = (hours * 3600000) + (minutes * 60000) + (seconds * 1000);


        if(hours || minutes || seconds){
            startTimer(duration);
            dom.pauseTimer.disabled = false;
        }


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

      if(timeState.remaining <= 0){
          timeState.remaining = 0;
          clearInterval(timeState.interval);
          timeState.running = false;
      }

    const totalSeconds = Math.floor(timeState.remaining / 1000);
    const seconds = totalSeconds % 60;
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const hours = Math.floor(totalSeconds / 3600);

dom.timerReadout.textContent = String(hours).padStart(2,'0') + ':' + String(minutes).padStart(2,'0') + ':' + String(seconds).padStart(2,'0')

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
