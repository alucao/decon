
import { precacheAndRoute } from 'workbox-precaching';
// import { storeDataInPouchDB, getCachedDataFromPouchDB } from './pouchdb-utils';

// import { populateDb } from './api/data-gatherer';
import { getCategories } from './api/categories';
import { getConfig } from './api/config';
import { getLocations } from './api/locations';
import { getMessages } from './api/messages';
import { getPosts } from './api/posts';
import { getSubcategories } from './api/subcategories';
import { getSublocations } from './api/sublocations';
import { getUser } from './api/users';

// importScripts('https://cdn.jsdelivr.net/npm/pouchdb@7.3.1/dist/pouchdb.min.js');


self.addEventListener('fetch', (event) => {
  event.respondWith((async () => {

    console.log('service-worker: ' + event.request.url);
    if (!event.request.url.includes("/api/")) {
      return fetch(event.request);
    }
    if (event.request.url.includes("blockfrost.")) {
      return fetch(event.request);
    }
    if (event.request.url.includes("koios.rest")) {
      return await fetch(event.request);
    }

    console.log('Service Worker intercepted a fetch event:', event.request.url);

    let data = {};

    if (event.request.url.includes("/api/categories")) {
      data = await getCategories();
    } else if (event.request.url.includes("/api/config")) {
      data = await getConfig();
    } else if (event.request.url.includes("/api/location")) {
      data = await getLocations();
    } else if (event.request.url.includes("/api/messages")) {
      data = await getMessages();
    } else if (event.request.url.includes("/api/posts")) {
      data = await getPosts();
    } else if (event.request.url.includes("/api/subcategories")) {
      data = await getSubcategories();
    } else if (event.request.url.includes("/api/sublocation")) {
      data = await getSublocations();
    } else if (event.request.url.includes("/api/users")) {
      data = await getUser();
    } else {
      console.log("NO ENDPOINT FOUND FOR: " + event.request.url);
    }

    console.log(JSON.stringify(data));
    const response = new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

    return response;

  })());
});


    /* event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    ); */

/*let page = 1;

self.addEventListener('activate', (event) => {
  event.waitUntil(
    async () => {
      console.log("ACTIVATE");
      page = await populateDb(page);
    });
});*/


precacheAndRoute(self.__WB_MANIFEST);
