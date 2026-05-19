const CACHE_NAME = 'toolflow-turso-v1.0';
const CACHE_NAME = 'toolflow-turso-v1.1'; // Versão incrementada para forçar atualização
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './config.js', // Adicionar o novo arquivo de configuração
  'https://cdn.tailwindcss.com',
  'https://unpkg.com/lucide@latest',
  'https://unpkg.com/html5-qrcode',
  'https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/echarts.min.js',
  'https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css',
  'https://cdn.jsdelivr.net/npm/flatpickr@4.6.13/dist/flatpickr.min.js',
  'https://cdn.jsdelivr.net/npm/flatpickr/dist/l10n/pt.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.2/jspdf.plugin.autotable.min.js',
  'https://cdn.jsdelivr.net/npm/xlsx-js-style@1.2.0/dist/xlsx.bundle.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/qrious/4.0.2/qrious.min.js'
];

// Instalação e Cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      for (const url of ASSETS) {
        try {
          // Usamos 'no-cors' para CDNs externos que podem bloquear fetch programático
          const requestMode = url.startsWith('http') ? 'no-cors' : 'cors';
          const response = await fetch(url, { mode: requestMode });
          await cache.put(url, response);
        } catch (err) {
          console.warn(`SW: Falha ao cachear ${url}:`, err);
        }
      }
    })
  );
  self.skipWaiting();
});

// Ativação e Limpeza de Caches Antigos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)));
    })
  );
});

// Estratégia: Tenta Rede, se falhar, vai no Cache (Network First)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});