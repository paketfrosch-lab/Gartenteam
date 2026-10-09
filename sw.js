/* Gartenteam: öffentliche App-Oberfläche; keine API- oder Anmeldedaten im Cache. */
const CACHE='gartenteam-shell-v11';
const SHELL=['/','/manifest.webmanifest','/icon-192.png','/icon-512.png'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(SHELL)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(names=>Promise.all(names.filter(name=>name.startsWith('gartenteam-')&&name!==CACHE).map(name=>caches.delete(name)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',event=>{
 const req=event.request,url=new URL(req.url);
 if(req.method!=='GET'||url.origin!==self.location.origin)return;
 if(req.mode==='navigate'){
  event.respondWith(fetch(req,{cache:'no-store'}).then(response=>{if(response.ok){const copy=response.clone();event.waitUntil(caches.open(CACHE).then(cache=>cache.put('/',copy)));}return response;}).catch(()=>caches.match('/').then(response=>response||new Response('Bitte Internetverbindung herstellen.',{status:503,headers:{'Content-Type':'text/plain;charset=utf-8'}}))));
  return;
 }
 if(SHELL.includes(url.pathname))event.respondWith(fetch(req).catch(()=>caches.match(req)));
});
