const fallback = {
  latitude: 50.4501,
  longitude: 30.5234,
  label: 'Киев, Украина',
  accuracyKm: 30
};

export async function resolveLocation() {
  let location = null;

  // 1) Попытка IP (Cloudflare — без CORS!)
  location = await tryIPLookup();
  if (isValidCoords(location)) return location;

  // 2) Попытка геолокации браузера
  if (navigator.geolocation) {
    location = await tryBrowserGeo();
    if (isValidCoords(location)) return location;
  }

  // 3) Fallback
  return {
    ...fallback,
    warning: 'Определение местоположения не удалось — использован Киев.'
  };
}


// =======================
// IP через Cloudflare
// =======================
async function tryIPLookup() {
  try {
    const res = await fetch("https://api.ipinfo.io/lite/8.8.8.8?token=86f22440d40633");
    const text = await res.text();

    const data = Object.fromEntries(
      text.split("\n")
        .map(line => line.split("="))
        .filter(x => x.length === 2)
    );

    if (!data.loc) return null;

    const [lat, lon] = data.loc.split(",");

    if (!lat || !lon) return null;

    return {
      latitude: Number(lat),
      longitude: Number(lon),
      label: data.city || "Локация по IP",
      accuracyKm: 25
    };
  } catch {
    return null;
  }
}


// =======================
// Геолокация браузера
// =======================
async function tryBrowserGeo() {
  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        if (!pos?.coords) return resolve(null);

        const coarse = coarseCoords(pos.coords, 0.1);

        const label = await reverseGeocode(coarse)
          .catch(() => fallback.label);

        resolve({
          ...coarse,
          label,
          accuracyKm: 12
        });
      },
      () => resolve(null),
      { timeout: 8000 }
    );
  });
}


// =======================
// Валидация координат
// =======================
function isValidCoords(obj) {
  return (
    obj &&
    typeof obj.latitude === "number" &&
    typeof obj.longitude === "number" &&
    !Number.isNaN(obj.latitude) &&
    !Number.isNaN(obj.longitude)
  );
}


// =======================
// Квантование
// =======================
function coarseCoords(coords, step = 0.1) {
  const snap = (v) => Number((Math.round(v / step) * step).toFixed(3));
  return {
    latitude: snap(coords.latitude),
    longitude: snap(coords.longitude)
  };
}


// =======================
// Reverse geocode
// =======================
async function reverseGeocode({ latitude, longitude }) {
  const url =
    `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${latitude}&longitude=${longitude}&language=ru&format=json`;

  const response = await fetch(url);
  if (!response.ok) throw new Error('Geo API failed');

  const data = await response.json();
  const place = data.results?.[0];
  if (!place) throw new Error('Geo empty');

  return `${place.name}, ${place.country}`;
}
