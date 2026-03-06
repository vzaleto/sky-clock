import { dom } from './dom.js';
import { SkyRenderer } from './sky-renderer.js';
import { initClock } from './features/clock.js';
import { initFloatingClock } from './features/floating.js';
import { initAlarms } from './features/alarms.js';
import { initTimer } from './features/timer.js';
import {weatherInit} from './features/weather.js';
import { initPiP } from './features/pip.js';
import { initNotifications } from './features/notifications.js';
import {moveCloud, openClose} from "./utils.js";




 // const renderer = new SkyRenderer(dom.canvas);

openClose(dom.timerBtn, dom.timerPanel)
openClose(dom.alarmBtn, dom.alarmPanel)

initNotifications();
initClock();
initFloatingClock();
initPiP();
initAlarms();
initTimer();

weatherInit()