import { dom } from './dom.js';
import { SkyRenderer } from './sky-renderer.js';
import { initClock } from './features/clock.js';
import { initFloatingClock } from './features/floating.js';
import { initAlarms } from './features/alarms.js';
import { initTimer } from './features/timer.js';
import { initWeather } from './features/weather.js';
import { initPiP } from './features/pip.js';
import { initNotifications } from './features/notifications.js';
import { SkyRendererWebGL } from './sky-renderer-webgl.js';
import {BeautifulSky} from './beautifulSky.js'

const renderer = new BeautifulSky(dom.canvas);

initNotifications();
initClock(renderer);
initFloatingClock();
initPiP();
initAlarms();
initTimer();
initWeather(renderer);
