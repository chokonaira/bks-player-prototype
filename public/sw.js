const AUDIO_CACHE = "bks-audio-saved-v1"; // explicit saves via the offline toggle
const AUDIO_RUNTIME = "bks-audio-runtime-v1"; // playback caching, never counts as saved
const LEGACY_AUDIO_CACHE = "bks-audio-v1";
const STATIC_CACHE = "bks-static-v1";
const PAGE_CACHE = "bks-pages-v1";

self.addEventListener("install", (e) => {
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(Promise.all([
    caches.delete(LEGACY_AUDIO_CACHE),
    self.clients.claim(),
  ]));
});

// serve audio from cache with Range support so seeking works offline;
// explicit saves win, then the runtime playback cache, then the network
async function audioResponse(request) {
  const saved = await caches.open(AUDIO_CACHE);
  let cached = await saved.match(request.url);
  if (!cached) {
    const runtime = await caches.open(AUDIO_RUNTIME);
    cached = await runtime.match(request.url);
    if (!cached) {
      // fetch the FULL file (no range header) so the cached copy is complete
      const full = await fetch(request.url);
      if (full.ok && full.status === 200) {
        await runtime.put(request.url, full.clone());
        cached = full;
      } else {
        return full;
      }
    }
  }
  const range = request.headers.get("range");
  if (!range) return cached.clone();
  const buf = await cached.clone().arrayBuffer();
  const m = /bytes=(\d+)-(\d+)?/.exec(range);
  const start = m ? Number(m[1]) : 0;
  const end = m && m[2] ? Number(m[2]) : buf.byteLength - 1;
  return new Response(buf.slice(start, end + 1), {
    status: 206,
    headers: {
      "Content-Type": "audio/mpeg",
      "Content-Range": `bytes ${start}-${end}/${buf.byteLength}`,
      "Content-Length": String(end - start + 1),
      "Accept-Ranges": "bytes",
    },
  });
}

self.addEventListener("fetch", (e) => {
  const req = e.request;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;

  if (url.pathname.startsWith("/audio/")) {
    e.respondWith(audioResponse(req));
    return;
  }

  if (req.mode === "navigate") {
    e.respondWith(
      fetch(req)
        .then((r) => {
          const copy = r.clone();
          caches.open(PAGE_CACHE).then((c) => c.put(req, copy));
          return r;
        })
        .catch(async () => (await caches.match(req)) || (await caches.match("/")))
    );
    return;
  }

  if (
    url.pathname.startsWith("/_next/static") ||
    ["style", "script", "font", "image"].includes(req.destination)
  ) {
    e.respondWith(
      caches.open(STATIC_CACHE).then(async (c) => {
        const hit = await c.match(req);
        const net = fetch(req)
          .then((r) => {
            if (r.ok) c.put(req, r.clone());
            return r;
          })
          .catch(() => hit);
        return hit || net;
      })
    );
  }
});
