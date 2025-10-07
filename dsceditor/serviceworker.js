/*
  DSC Studio
  Copyright (C) 2022-2025 nastys

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU Affero General Public License as
  published by the Free Software Foundation, either version 3 of the
  License, or (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU Affero General Public License for more details.

  You should have received a copy of the GNU Affero General Public License
  along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/
const cacheName = "dsceditor-static-v39";

const contentToCache = [
  "./",
  "./db_dt2.js",
  "./db_ft.js",
  "./db_pd1.js",
  "./db_pd2.js",
  "./db.js",
  "./defs_ft.js",
  "./dex_worker_write.js",
  "./dsc_worker_read.js",
  "./dsc_worker_write.js",
  "./dsc.js",
  "./editor_util.js",
  "./editor.js",
  "./fmt.js",
  "./fmtlist.js",
  "./idswap.js",
  "./index.html",
  "./LICENSE",
  "./lrc_worker_read.js",
  "./manifest.json",
  "./menu.js",
  "./preview_worker.js",
  "./preview.js",
  "./styles.css",
  "./icons/Bookmark.svg",
  "./icons/ClearBookmark.svg",
  "./icons/dsc_file.webp",
  "./icons/dsc256.png",
  "./icons/dsc512.png",
  "./icons/GoToCurrentLine.svg",
  "./icons/GoToNextInList.svg",
  "./icons/GoToPreviousInList.svg",
  "./icons/icon_chainl.svg",
  "./icons/icon_chainr.svg",
  "./icons/icon_circle.svg",
  "./icons/icon_cross.svg",
  "./icons/icon_slidel.svg",
  "./icons/icon_slider.svg",
  "./icons/icon_square.svg",
  "./icons/icon_triangle.svg",
  "./icons/InsertClause.svg",
  "./icons/m_circle.png",
  "./icons/m_cross.png",
  "./icons/m_square.png",
  "./icons/m_triangle.png",
  "./icons/MergeFile.svg",
  "./icons/NextBookmark.svg",
  "./icons/OpenFile.svg",
  "./icons/pokeslow-a.png",
  "./icons/pokeslow-a2.png",
  "./icons/pokeslow.png",
  "./icons/PreviousBookmark.svg",
  "./icons/Redo.svg",
  "./icons/Run.svg",
  "./icons/RunAll.svg",
  "./icons/Save.svg",
  "./icons/SaveAs.svg",
  "./icons/Search.svg",
  "./icons/Sound.svg",
  "./icons/target_chainl.svg",
  "./icons/target_chainr.svg",
  "./icons/target_circle.svg",
  "./icons/target_cross.svg",
  "./icons/target_slidel.svg",
  "./icons/target_slider.svg",
  "./icons/target_square.svg",
  "./icons/target_triangle.svg",
  "./icons/target_unknown.png",
  "./icons/Undo.svg",
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
      //console.log(`[${cacheName}] Fetching resource: ${e.request.url}`);
      if (r) {
        return r;
      }
      const response = await fetch(e.request);
      const cache = await caches.open(cacheName);
      console.log(`[${cacheName}] Caching new resource: ${e.request.url}`);
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
      //await skipWaiting();
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
          // console.log("Claiming clients...");
          // clients.claim();
          return caches.delete(key);
        })
      );
    })
  );
});

self.addEventListener('message', event => {
  if (event.data === 'skipWaiting') {
    skipWaiting();
    console.log("Skipped waiting.");
  }
});