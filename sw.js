/* Taste Experience Hybrid — offline shell (UI + qrcode lib). Upload API tetap lewat jaringan. */
var CACHE = "te-hybrid-v1";
var PRECACHE = ["./", "./index.html", "./manifest.webmanifest", "./lib/qrcode.js", "./icons/icon-192.png", "./icons/icon-512.png"];

self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (c) {
      return c.addAll(PRECACHE);
    }).then(function () {
      return self.skipWaiting();
    })
  );
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) {
        return caches.delete(k);
      }));
    }).then(function () {
      return self.clients.claim();
    })
  );
});

self.addEventListener("fetch", function (e) {
  if (e.request.method !== "GET") return;
  var url = new URL(e.request.url);
  if (url.origin !== self.location.origin) return;

  e.respondWith(
    caches.match(e.request).then(function (cached) {
      if (cached) return cached;
      return fetch(e.request).then(function (res) {
        if (!res || res.status !== 200 || res.type !== "basic") return res;
        var clone = res.clone();
        caches.open(CACHE).then(function (c) {
          c.put(e.request, clone);
        });
        return res;
      }).catch(function () {
        if (e.request.mode === "navigate") return caches.match("./index.html");
        return cached;
      });
    })
  );
});