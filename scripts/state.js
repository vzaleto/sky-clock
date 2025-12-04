export const state = {
  location: null,
  weather: null,
  timePhase: 'day',
  alarms: [],
  timer: {
    duration: 30_000,
    remaining: 30_000,
    ticker: null,
    running: false,
  },
  toastTimer: null,
};

