// runOnceForAllItems — recibe los 3 items juntos (IndexNow + Google + Bing)
const indexNowItems = $('🔵 IndexNow → Bing / Yandex / Yep').all();
const parseItems   = $('🔍 Parsear y preparar URLs').all();

const rawStatus   = indexNowItems[0]?.json?.statusCode;
const statusNum   = Number(rawStatus);
const statusStr   = rawStatus !== undefined ? String(rawStatus) : 'sin respuesta';
const total       = Number(parseItems[0]?.json?.total ?? 0);
const timestamp   = new Date().toLocaleString('es-ES', { timeZone: 'Europe/Madrid' });

const ok = statusNum === 200 || statusNum === 202;
const mensaje = ok
  ? total + ' URLs enviadas a buscadores correctamente'
  : 'IndexNow respondio ' + statusStr + ' — revisar configuracion';

return [{
  json: {
    timestamp:         timestamp,
    urls_enviadas:     total,
    indexnow_status:   statusStr,
    motores:           'Bing, Yandex, Yep, DuckDuckGo',
    google_ping:       'enviado',
    bing_ping:         'enviado',
    mensaje:           mensaje
  }
}];
