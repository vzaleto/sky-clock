import { dom } from './dom.js';

import { initClock } from './features/clock.js';

import { initAlarms } from './features/alarms.js';
import { initTimer } from './features/timer.js';
import {weatherInit} from './features/weather.js';
import { initPiP } from './features/pip.js';
import { initNotifications } from './features/notifications.js';
import {getMoonPhase, moveCloud, openClose} from "./utils.js";


openClose(dom.timerBtn, dom.timerPanel)
openClose(dom.alarmBtn, dom.alarmPanel)


initPiP();
initClock();
initTimer()
weatherInit()

initNotifications();
getMoonPhase(new Date())
initAlarms();







