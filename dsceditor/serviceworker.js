const cacheName = "dsceditor-static-v2";

const contentToCache = [
  "./",
  "./db_dt2.js",
  "./db_ft.js",
  "./db.js",
  "./dsc_worker_read.js",
  "./dsc_worker_write.js",
  "./dsc.js",
  "./editor_util.js",
  "./editor.js",
  "./fmt.js",
  "./fmtlist.js",
  "./idswap.js",
  "./index.html",
  "./manifest.json",
  "./menu.js",
  "./preview_worker.js",
  "./preview.js",
  "./styles.css",
  "./icons/Search.svg",
  "./icons/NextBookmark.svg",
  "./icons/icon_triangle.svg",
  "./icons/target_slider.svg",
  "./icons/icon_slider.svg",
  "./icons/m_square.png",
  "./icons/icon_cross.svg",
  "./icons/target_triangle.svg",
  "./icons/icon_circle.svg",
  "./icons/RunAll.svg",
  "./icons/target_chainl.svg",
  "./icons/target_cross.svg",
  "./icons/pokeslow-a.png",
  "./icons/dsc256.png",
  "./icons/icon_chainl.svg",
  "./icons/pokeslow-a2.png",
  "./icons/target_circle.svg",
  "./icons/m_triangle.png",
  "./icons/dsc512.png",
  "./icons/Save.svg",
  "./icons/target_chainr.svg",
  "./icons/PreviousBookmark.svg",
  "./icons/Redo.svg",
  "./icons/target_unknown.png",
  "./icons/icon_chainr.svg",
  "./icons/m_circle.png",
  "./icons/SaveAs.svg",
  "./icons/icon_square.svg",
  "./icons/Undo.svg",
  "./icons/ClearBookmark.svg",
  "./icons/target_slidel.svg",
  "./icons/pokeslow.png",
  "./icons/icon_slidel.svg",
  "./icons/Bookmark.svg",
  "./icons/m_cross.png",
  "./icons/OpenFile.svg",
  "./icons/target_square.svg",
  "./icons/Run.svg",
  "./sounds/hit.flac",
  "./node_modules/monaco-editor/min/vs/base/browser/ui/codicons/codicon/codicon.ttf",
  "./node_modules/monaco-editor/min/vs/editor/editor.main.js",
  "./node_modules/monaco-editor/min/vs/loader.js",
  "./node_modules/monaco-editor/min/vs/editor/editor.main.css",
  "./node_modules/monaco-editor/min/vs/editor/editor.main.nls.js",
  "./node_modules/monaco-editor/min/vs/base/worker/workerMain.js",
  "../favicon.ico",
];

self.addEventListener('fetch', function (e) {
  e.respondWith(
    (async () => {
      const r = await caches.match(e.request);
      //console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
      if (r) {
        return r;
      }
      const response = await fetch(e.request);
      const cache = await caches.open(cacheName);
      console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
      cache.put(e.request, response.clone());
      return response;
    })()
  );
});

self.addEventListener("install", (e) => {
  e.waitUntil(
    (async () => {
      const cache = await caches.open(cacheName);
      console.log(`Installing ${cacheName}...`);
      await cache.addAll(contentToCache);
      console.log("Installation complete.");
    })()
  );
});

self.addEventListener("activate", (e) => {
  console.log(`Running ${cacheName}`);
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key === cacheName) {
            return;
          }
          console.log(`Cleaning up ${key}...`);
          return caches.delete(key);
        })
      );
    })
  );
});