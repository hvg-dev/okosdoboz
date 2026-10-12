# Reszponzív keret régi Okosdoboz-feladatokhoz

## Parcel POC terv

Az első, konzervatív POC implementációja a [package.json](package.json) alatt található: iframe nélküli Parcel-keret, egy oldalbetöltésben egy feladat, konfigurálható same-origin `/lessons` prefix és változatlan legacy források. A jelenlegi architektúra a [parcel-poc.md](parcel-poc.md) dokumentumban olvasható.

## Futtatás

Az 1710-es feladatcsomag mind a hat pályája két külön URL-en játszható végig ugyanabban a reszponzív keretben:

- Eredeti, PNG-s változat: http://localhost:3000/?lesson=1710&version=original
- Felújított, SVG-s változat: http://localhost:3000/?lesson=1710&version=svg

A `version` paraméter fejlesztésben, preview-ban és productionben is működik; telepített környezetben csak a hostot kell cserélni. A változat nélküli `/?lesson=1710` és `/` cím megtartja az SVG-s alapértelmezést. Mindkét változat a legacy motor szokásos pályasorrendjét, válaszválasztását, ellenőrzését, megoldását és eredményképernyőjét használja. Az eredeti változatban az SVG-adapter nem fut le. Üres, ismeretlen vagy többször megadott `version` értéknél a motor nem indul el.

Az SVG-s változat mind a hat pályán külön SVG-szövegrétegként jeleníti meg a képre égetett promptokat. A nem interaktív SVG-összehasonlító a `npm run dev` után a [/experiments/1710-track-1/](experiments/1710-track-1/index.html) címen érhető el; a pályaválasztóval 1–6 között válthatsz. A determinisztikus, első pályáról induló SVG-végigteszt útvonala `/?lesson=1710&version=svg#svg-poc-1710-1`. A motor adaptere csak az aktuális pálya `id104` háttérelemét cseréli le, trackváltás után a megfelelő prompttal; a válaszmezők és a legacy motor változatlanok. A PNG-illusztráció raszter marad (az SVG-be ágyazva), a négy prompt SVG `<text>` rétegre kerül. A koordinátás feladatot nem rendezi át mobilra. Az eredeti pályaadatot és PNG-ket nem módosítja.

Node.js 24 szükséges (a buildpack is a `24.x` főverziót használja). A repository gyökeréből:

```sh
npm ci
npm run dev
```

A keret címe: **http://localhost:3000/?lesson=1710**. Másik port: `PORT=3100 npm run dev`. A belső Parcel-port alapértelmezésben a külső port + 1; `PARCEL_PORT` értékkel felülírható. Nincs iframe, és nincs SPA-feladatcsere.

Telefonméretű álló nézetben (legfeljebb 600 px széles portrait viewport) a keret a telefon elfordítását kéri. A feladat betöltve marad, a háttérben lévő vezérlők ilyenkor nem kezelhetők; visszaforgatás nem indítja újra a pályát. A mobilos görgetési módon kívül a játéktér a viewport bal oldalán a lehető legnagyobb arányos méretet használja, a cím, instrukció, előrehaladás és eredeti vezérlők pedig a külön görgethető jobb oldali sávba kerülnek.

Fekvő, érintőképernyős mobilnézetben (legfeljebb 600 px viewportmagasság, `pointer: coarse`) a jobb oldali sáv helyett a cím és a vezérlők a játék fölötti felső rétegben jelennek meg. Lefelé, fél viewportmagasságnyi oldalgörgetés elrejti a réteget; irányváltás után ugyanekkora felfelé görgetés visszahozza. A küszöb a görgetési távolságra, nem az ujj mozdulatának hosszára vonatkozik. A játék helyben marad, állapota megőrződik. A jobb szélen keskeny függőleges jelző, két iránynyíllal mutatja a küszöbig megtett távolságot. A rejtett vezérlőréteg nem fókuszálható és nem kezelhető. A felső gomb ebben a nézetben görgetéssel rejti el a sávot, nem kér natív fullscreent. Visszahozni felfelé görgetéssel lehet.

Ez valódi dokumentumgörgetés, így a Safari és az Android Chrome saját kezelősávja is reagálhat rá. A böngészősáv megjelenítése vagy elrejtése azonban nem vezérelhető és nem szinkronizálható garantáltan a weboldalból. A félképernyős küszöb időt ad a böngészőnek reagálni, de a reakció eszköz- és böngészőfüggő. Az eredeti és SVG-s változat görgetéses rétegét integrált böngészőben ellenőriztük; valódi iPhone- és Android-eszközön az érintéses görgetés és a böngészősáv viselkedése külön ellenőrzendő. Asztali nézetben a jobb oldali sáv és az alábbi fullscreen-kezelés változatlan marad.

A mobilos görgetési módon kívül a fullscreen gomb a teljes dokumentumra (`document.documentElement`) kéri a böngésző teljes képernyős módját, nem csak a feladatelemre. Standard és WebKit API-t is kezel; a gombbal ismét kiléphetsz. Ahol az API nem támogatott, letiltott, a böngésző megtagadja vagy a kérés elakad, nagyított játéknézetre vált: a jobb oldali vezérlősáv 64 px-re összecsukódik, így a játék több helyet kap. A jobb felső gomb megmarad, és visszaállítja a vezérlőket. API nélküli környezetben a gomb neve „Játék nagyítása”, nagyított állapotban „Vissza a vezérlőkhöz”; a képernyőolvasó a korlátozásról is kap jelzést. Ez nem natív fullscreen, és nem tudja elrejteni a Safari saját címsorát. Forgatás, fullscreen és méretváltozás közben a legacy feladat állapota megmarad.

iPhone-on a natív teljes dokumentumos fullscreen támogatása böngésző-/iOS-verziófüggő, de a fent leírt fekvő mobilos módban nem kérjük ezt az API-t. A nagyított fallbacket böngészőben, hiányzó API-val szimulálva ellenőriztük; valódi iPhone-on külön eszközteszt szükséges. Válaszellenőrzéshez vagy pályaváltáshoz a mobilos felső réteget felfelé görgetéssel, a nem mobilos fallback oldalsávját a gombbal kell visszahozni.

Az eredmény- és információs panelek a viewporton belül maradnak, hosszabb tartalmuk külön görgethető. A legacy motornak gyökérhez viszonyított `lib` útvonalat adunk, így a HTTPS-címek régi normalizálója nem rontja el a helyes/hibás választ jelző ikonok URL-jét.

```sh
npm run build
npm test
PORT=3200 npm run preview
```

Az `npm test` a kész build legacy hash-eit is ellenőrzi, ezért előtte szükséges a build. A preview címe ekkor http://localhost:3200/. A `dist` statikusan is kiszolgálható.

## Node production szerver

Éles futtatáskor nincs szükség Nginxre vagy futó Parcelre:

```sh
npm run build
npm test
npm start
```

Alapértelmezett cím: http://localhost:8080/. Másik porthoz `PORT=3600 npm start`. A [scripts/production-server.mjs](scripts/production-server.mjs) a [scripts/production-app.mjs](scripts/production-app.mjs) Express-alkalmazását indítja; kizárólag a kész `dist/` tartalmat szolgálja ki. A `DIST_DIR` másik buildkönyvtárat jelölhet. Induláskor ellenőrzi a konfigurációt, a belépőoldalt és a manifestben szereplő feladatok belépőscriptjeit; hibás builddel nem indul el. A `lessonsPrefix` továbbra is buildhez kötött, futásidejű `LESSONS_PREFIX` nem változtatja meg a production mountot.

A szerver GET/HEAD kéréseket kezel, hiányzó fájlokra valódi 404-et ad. `nosniff` és Referrer-Policy headereket küld, az Express verziójelzése kikapcsolt. A konfiguráció `no-store`; HTML, manifest és legacy fájlok `no-cache` újraellenőrzést kapnak. Csak a gyökérben lévő, tényleges hash-elt buildassetek cache-elhetők egy évig `immutable` szabállyal. SIGTERM/SIGINT után legfeljebb 10 másodperces, korlátos leállítás következik.

A production-függőség csak Express. Parcel, Playwright, http-proxy, lucide és MathJax build-/fejlesztési függőségek; a böngésző által használt MathJax-fájlok továbbra is a buildbe kerülnek, tehát annak korábban jelzett biztonsági kockázata nem szűnik meg. A régi `npm run preview` megmarad fejlesztői ellenőrzéshez; éles indításhoz az `npm start` használható.

## iPhone kezdőképernyős alkalmazás

A keret webmanifesttel, 192/512 px-es alkalmazásikonokkal és 180 px-es Apple touch ikonnal rendelkezik. Az iPhone a kezdőképernyős ikonról indítva standalone módban, Safari-címsor nélkül nyithatja meg; az iOS státuszsávja és home indicatora ettől még megmaradhat. A keret kezeli a safe-area margókat.

1. Nyisd meg Safariban a HTTPS-címet: https://okosdoboz-poc.staging-hvg.hu/.
2. Válaszd a **Megosztás → Főképernyőhöz adás** műveletet. Ha az iOS felkínálja, legyen bekapcsolva a **Megnyitás webalkalmazásként** lehetőség.
3. A létrejött **Okosdoboz** ikonról indítsd az alkalmazást, majd fordítsd fekvő helyzetbe a telefont.

A Safari-lap fullscreen gombja nem tudja automatikusan telepíteni vagy standalone módba váltani az oldalt. A kezdőképernyős alkalmazásban ugyanazok a nézeti feltételek érvényesek: fekvő, legfeljebb 600 px magas coarse-pointer nézetben a gomb a felső réteget rejti el görgetéssel, visszahozni felfelé görgetéssel lehet. Ezen a módon kívül a gomb natív fullscreen nélkül a nagyított fallbacket kapcsolja. Az indítás a konfigurált alapértelmezett feladat SVG-s változatát választja; a manifest `start_url` és `scope` értéke `./`.

Ez **online standalone alkalmazás**, nem offline kiadás: nincs service worker és nincs feladatcache. Internetkapcsolat szükséges. A manifest/ikonok buildbe kerülését automatizált teszt ellenőrzi; a tényleges iPhone-os telepítés és címsor nélküli indítás valódi eszközön ellenőrzendő. A generált ikonok újrakészítése: `node scripts/generate-icons.mjs`.

## Buildpack hosztolás

A konténerimage Cloud Native Buildpacks segítségével készül, Dockerfile és Nginx nélkül. A repository gyökeréből:

```sh
pack build okosdoboz --builder heroku/builder:24
```

A [project.toml](project.toml) rögzíti a buildert és kizárja a helyi `node_modules`, buildoutput, cache, Git, Kubernetes és dokumentációs fájlokat a build bemenetéből. A buildpack a gyökérbeli package/lockfile alapján telepíti a függőségeket, futtatja az `npm run build`, majd az `npm run heroku-postbuild` lépést. Utóbbi az összes Node-tesztet futtatja. A Parcelhez szükséges devDependencies a build során szükségesek; ne tiltsd le telepítésüket.

A [Procfile](Procfile) web folyamata:

```text
web: node scripts/production-server.mjs
```

A production szerver a platform `PORT` változóját használja; alapértéke 8080. Helyi image-indítás:

```sh
docker run --rm -e PORT=8080 -p 8080:8080 okosdoboz
```

Elérés: http://localhost:8080/?lesson=1710. A `pack` továbbra is konténer-runtime-ot igényel, de egyedi Docker buildfájl már nincs. A régi többfázisú Dockerfile runtime-tartalomra és UID-ra vonatkozó garanciái nem érvényesek az új buildpack-image-re. Az alkalmazás kizárólag a `dist` tartalmát szolgálja ki, akkor is, ha a buildpack más forrásfájlokat is az image-ben hagy.

Alternatív assetprefix buildidőben:

```sh
pack build okosdoboz --builder heroku/builder:24 --env LESSONS_PREFIX=/content/lessons
```

A prefix futásidőben nem módosítható fájláthelyezés nélkül. HTTPS-t a külső proxy/Ingress biztosít. A manifestet, ikonokat és legacy asseteket az alkalmazás buildje állítja elő, offline mód továbbra sincs.

Korábbi buildpack-ellenőrzés, az SVG- és görgetési bővítések előtt: a tényleges `pack build okosdoboz --builder heroku/builder:24` sikeres, Node.js 24.21.0 alatt az akkori 16 Node-teszt lefutott. A buildpack felismerte a Procfile web folyamatát. Az image nem rootként, read-only fájlrendszerrel, eldobott capabilitykkel és 128 MiB memórialimittel elindult; a keret, konfiguráció, manifest és feladatasset 200-at, hiányzó asset 404-et adott. SIGTERM után 0-s exit kóddal leállt. Registry-push és klaszterfrissítés ebben a korábbi ellenőrzésben nem történt; a későbbi staging-rolloutot az alábbi fejezet rögzíti.

## Kubernetes

A [k8s/deployment.yaml](k8s/deployment.yaml) két példányt ír elő, `runAsNonRoot: true`, rögzített `runAsUser: 101` és `runAsGroup: 101`, valamint HTTP startup/readiness/liveness probe-ok mellett. A memóriarequest **32 MiB**, a limit **128 MiB**; a CPU-request 50m, a limit 500m. A manifest **nem** állít `readOnlyRootFilesystem` értéket. A [k8s/service.yaml](k8s/service.yaml) belső `ClusterIP` Service: 80-as portja a podok 8080-as portjára mutat. A manifestek nem rögzítenek namespace-t.

A kötelező pod anti-affinity az `app.kubernetes.io/name: okosdoboz-shell` címkéjű podokat ugyanazon namespace-en belül a `kubernetes.io/hostname` alapján külön node-okra ütemezi. Két példányhoz legalább két megfelelő node szükséges; további szabad node nélkül egy új pod Pending maradhat. Az alapértelmezett RollingUpdate két példánynál egy extra podot enged és nulla kiesést, ezért frissítéshez harmadik megfelelő node szükséges lehet. Az `IgnoredDuringExecution` szabály nem költözteti át automatikusan a már futó podokat.

**Staging-ellenőrzés (2026-10-12):** az új build az `okosdoboz-shell` namespace-ben két Ready poddal, külön node-okon, nulla újraindulással futott; a két HTTPS-változat és a mobilos görgetési mód is elérhető volt. Ez igazolja a vizsgált image indíthatóságát a jelenlegi 101-es UID/GID-beállítással, nem minden későbbi build kompatibilitását. A sikeres korábbi helyi read-only teszt továbbra sem jelenti, hogy a manifest read-only futást ír elő.

Telepítés előtt a Deployment `image` értékét állítsd a feltöltött, verziózott image nevére. A manifest jelenlegi értéke `cr.hvg.hu/os/okosdoboz-shell:poc`, `imagePullPolicy: Always` beállítással. A `pack build okosdoboz` csak helyi image-et készít: nem pusholja és nem indít rolloutot. Privát registry esetén a klaszter számára registry-hitelesítés szükséges; `imagePullSecrets` jelenleg nincs a manifestben.

```sh
kubectl -n okosdoboz-shell apply -f k8s/
kubectl -n okosdoboz-shell rollout status deployment/okosdoboz-shell
kubectl -n okosdoboz-shell port-forward service/okosdoboz-shell 8080:80
```

A port-forward után http://localhost:8080/?lesson=1710 címen érhető el. A példa a stagingben már létező `okosdoboz-shell` namespace-t használja; más környezetben ezt módosítani és szükség esetén előre létrehozni kell. A [k8s/ingress.yaml](k8s/ingress.yaml) tartalmaz `kong` ingressClass-szal HTTP route-ot az `okosdoboz-poc.staging-hvg.hu` hosthoz, TLS-konfiguráció nélkül. A staging HTTPS-válaszain a Cloudflare/Kong proxyútvonalat ellenőriztük; TLS-t ez a manifest nem konfigurál.

## Források és konfiguráció

```text
lessons/
  lib/                         változatlan közös motor
  1710/
    1710/                      eredeti HTML, index.js és XML-ek
    tracksjs/                  a feladat pályái
    images_ms/                 a feladat képei, half/ almappával
index.html                     Parcel-belépési pont
package.json                   npm-parancsok és függőségek
src/                           keret és adapterek
scripts/                       build és kiszolgálás
tests/                         regressziós tesztek
public/                        keretkonfiguráció
assets/                        alkalmazásikonok
experiments/1710-track-1/       hatpályás PNG/SVG-összehasonlító és SVG-segédfüggvények
```

A [public/shell-config.json](public/shell-config.json) állítja a `lessonsPrefix`, `defaultLessonId`, `supportedLessonIds` és `loadTimeoutMs` értékeket. Új feladat azonos szerkezetben helyezhető el a `lessons/<ID>/` alatt, majd a támogatott lista bővíthető; a generikus betöltőhöz nem kell új feladatág. Az SVG-adapter viszont jelenleg csak az 1710-es csomagot kezeli: új feladat SVG-felújításához külön pályaleírás és adapterbővítés, a betöltési kompatibilitásához pedig további teszt szükséges.

Alternatív prefix fejlesztéskor: `LESSONS_PREFIX=/content/lessons npm run dev`. Éles buildnél ugyanezt a változót a buildhez kell megadni. A preview a buildben tárolt konfigurációt használja: csak a prefix JSON-értékének átírása nem mozgatja át a fájlokat. `LESSONS_SOURCE_DIR` másik forráskönyvtárat jelölhet, az új `lessons/` szerkezetben.

A motor a `lib` szülőjéből számolja az assetgyökeret. Ezért a `/lessons/1710/lib/` virtuális útvonal a közös `/lessons/lib/` tartalmát szolgálja ki. A production build feladatonként generált könyvtármásolattal biztosítja ugyanezt; ez nem új, kézzel karbantartandó forrás. A feladat belépőscriptje `/lessons/1710/1710/index.js`.

## Ellenőrzés és korlátok

Legutóbbi ellenőrzés (2026-10-12): sikeres production build és 21 Node-teszt, beleértve a konfigurációt, változatválasztást, fullscreen- és görgetési küszöbkezelést, betöltőt, bájtazonos legacy outputot, production HTTP-t és standalone asseteket. A korábbi buildpack-próba külön, az akkori 16 tesztes állapotban történt.

A Playwright-suite 14 tesztet tartalmaz három fájlban: hat általános teszt a [tests/lesson.spec.mjs](tests/lesson.spec.mjs), hat SVG/változat teszt a [tests/svg-poc.spec.mjs](tests/svg-poc.spec.mjs), két mobilréteg-teszt a [tests/scroll-controls.spec.mjs](tests/scroll-controls.spec.mjs) alatt. A `--list` betöltési ellenőrzés sikeres, de nem E2E-futás. Integrált böngészőben mindkét változat hat pályája végigment választással, ellenőrzéssel, megoldással és eredményképernyővel; stagingen nem volt JavaScript-, HTTP- vagy hálózati hiba. A staging új buildjén touch-emulált 844 × 390 nézetben a görgetési réteg, a jelző, az elrejtés és visszahozás is működött. Helyben az elgörgetett játék válaszkezelését és a forgatás utáni állapotmegőrzést is ellenőriztük. Ezek nem valódi telefonos eszköztesztek.

Az automatizált Playwright-suite a jelenlegi Linux-környezetben hiányzó Chromium rendszerkönyvtár (`libnspr4.so`) miatt nem jutott el az alkalmazás teszteléséig. Másik, előkészített gépen:

```sh
npx playwright install chromium
npm run test:e2e
```

Linuxon a Playwright rendszerfüggőségeit is telepíteni kell; az esetleges adminisztrátori telepítést a környezet gazdája végezze. Production teszthez futó preview mellett `TEST_URL=http://localhost:3200 npm run test:e2e` használható.

A mellékelt MathJax-mappa üres volt. A keret MathJax **2.7.9** fájlokkal egészíti ki a kiszolgálást és a buildet, a meglévő motorfájlok módosítása nélkül. Az npm audit erre ismert, magas súlyosságú **ReDoS** figyelmeztetést ad ([GHSA-v638-q856-grg8](https://github.com/advisories/GHSA-v638-q856-grg8)); a 4-es főverzió nem közvetlen helyettesítő a régi `MathJax.Hub` API-hoz. Csak megbízható feladatcsomagokkal használható POC, élesítés előtt külön biztonsági döntés szükséges.

További feladattípusok, valódi mobilos touch, iPhone standalone indítás és a teljes fullscreen/fallback mátrix még külön ellenőrzendők. Az arányos feladatkicsinyítés nem jelent szöveges újratördelést.

## Eredeti felmérés

Az alábbi fejezetek az eredeti tervezési megfontolásokat és nem implementált alternatívákat őrzik. Jövő idejű megfogalmazásaik történeti tervek, nem az aktuális készültségi állapot. A fenti útmutató és a parcel-poc dokumentum az aktuális POC elsődleges szerződése.

## Állapot és cél

Az eredeti felmérést követően elkészült az első működő POC. Az alábbi alternatívák közül jelenleg a Parcel-alapú, közvetlen betöltés van implementálva.

A cél modern, reszponzív keret készítése [Parcel](https://parceljs.org/) segítségével, vagy alternatívaként [Astro](https://astro.build/) használatával. A meglévő feladatok JavaScript-kódját, a közös motort és a függőségek verzióját az első vizsgálati körben nem változtatjuk meg.

Egyeztetett elvárások:

- A keret és a feladatfájlok saját, azonos originű kiszolgálásból működnek.
- A kezelősáv mobilon is olvasható és használható maradjon, szükség esetén újratördeléssel.
- A feladat belső elrendezése arányosan skálázódhat; valódi szöveges újratördelés nem követelmény.
- Megvizsgáljuk az iframe nélküli beágyazást. Az iframe kompatibilitási kontroll és tartalékmegoldás marad.

Kiindulópont: [lessons/1710/1710/index.html](lessons/1710/1710/index.html). Éles referencia: [Újságíró-iskola](https://www.okosdoboz.hu/feladatsor?id=1710).

Az eredeti okosdoboz.hu portál beágyazási DOM-ját és framing fejléceit nem igazoltuk. A saját közvetlen betöltés viszont már implementált és böngészőben ellenőrzött a mellékelt 1710-es csomaggal; az eredeti portál feladatcíme nem bizonyítja a helyi csomag tartalmának azonosságát.

## A meglévő rendszer

| Terület | Jelenlegi működés |
| --- | --- |
| Belépési pont | A [lessons/1710/1710/index.html](lessons/1710/1710/index.html) betölti a motort, a közös konfigurációt és a feladatazonosítót. Az oldal betöltése után `loadProjects`, majd `createPlayer` következik. |
| Feladatazonosító | A [lessons/1710/1710/index.js](lessons/1710/1710/index.js) a `carco.data.okosdoboz.id` értékét állítja be. |
| Bootstrap | A [lessons/lib/okosdoboz.js](lessons/lib/okosdoboz.js) a dokumentum script-elemeit és a `name`, `project`, `lib` attribútumokat használja. További fájlokat dinamikusan tölt be. |
| Konfiguráció | A [lessons/lib/config.js](lessons/lib/config.js) választja a konfigurációt és a lejátszót. A `config` és `player` query paraméterek felülírhatják a korábban megadott választást. |
| Lejátszó létrehozása | A [lessons/lib/configs/default/config_user.js](lessons/lib/configs/default/config_user.js) az `odPlayer` azonosítójú dokumentumelembe építkezik, és létrehozza a `window.drwmsg` referenciát. |
| Feladatadatok | A [lessons/1710/tracksjs/1710_1.js](lessons/1710/tracksjs/1710_1.js) rögzített logikai koordinátákra, abszolút pozicionálásra és canvas képekre is épít. |

A logikai feladattér **3150 × 1350**, azaz **7:3 arányú**, `fitinternal` skálázással. Ez nem automatikusan újratördelődő HTML-tartalom.

A [lessons/lib/carco_functions.js](lessons/lib/carco_functions.js) `player.get()` függvénye külön építi a fejlécet, kezelősávot, feladatteret, betöltési réteget, információs és eredményképernyőt. **A teljes lejátszó ezért nem 7:3 arányú.**

A motor meglévő `resizeplayer`, `getScale`, `getRootScale`, `resize` és `resizeEnd` útvonalai már végeznek méretezést. A `root.startsize` a kezdeti renderelt méretet rögzíti, nem szükségképpen a 3150 × 1350-es logikai méretet.

### Reszponzivitási akadályok

- A [lessons/lib/players/default/fullscreenbody.css](lessons/lib/players/default/fullscreenbody.css) a teljes dokumentumra `min-width: 750px` szabályt ír elő.
- A `root.init` a `playersize: "fullscreen"` beállításnál keskeny ablakban 750 px-es viewport-metát is beszúrhat.
- A méretezés egyes ágai fix **106 px-es** fejléc- és kezelősáv-többlettel számolnak.
- A [lessons/lib/player.css](lessons/lib/player.css) fix méretekkel és túlcsordulást elrejtő konténerekkel is dolgozik. Egy újratördelődő kezelősáv magasabb lehet a jelenlegi feltételezésnél.
- A globális `body` és egyéb CSS-szabályok iframe nélkül a keretoldalt is érintik.

A `playersize: "fullscreen"` itt méretezési beállítás; nem jelenti önmagában a böngészős Fullscreen API használatát.

## Változatlan legacy környezet

A modern build kizárólag az új keretet, annak stílusát és adapterét dolgozza fel. A legacy fájlok változatlan másolását már a scripts/assets.mjs automatizálja; a forráskönyvtárak maradnak az egyetlen karbantartott forrás.

Megőrzendő tartalmak: a közös motor a `lessons/lib/`, a feladat belépője a `lessons/1710/1710/`, a pályák a `lessons/1710/tracksjs/`, a képek a `lessons/1710/images_ms/` alatt, beleértve minden dinamikusan betöltött fájlt.

A jQuery 2.0.3, jQuery UI és pluginok, CreateJS és MathJax verzióját, betöltési sorrendjét és a motor által elvárt globális elérhetőségét nem változtatjuk meg. A motor kódját nem alakítjuk ESM-modullá, és nem importáljuk a keret bundle-jébe.

**A változatlan forrás és függőségek nem jelentenek elszigetelt böngészőkörnyezetet.** Iframe nélkül a keret és a motor ugyanazt a `window` és `document` objektumot használja. Ha teljes dokumentum- és globális JS-izoláció követelmény, az iframe a megfelelő megoldás.

## Parcel: elsődleges keretirány

Parcel HTML-belépési ponttal, külön keretmodullal és CSS-sel építené az új felületet. A régi feladat belépési pontját nem tesszük automatikusan Parcel build-belépési ponttá: a HTML-függőségfeldolgozás és a fájlátnevezések ütközhetnek a motor dinamikus URL-jeivel.

Tervezett kiszolgálási szerződés:

```text
/                    az új keret
/lessons/1710/1710/  eredeti feladatfájlok
/lessons/lib/        motor és meglévő függőségek
/lessons/1710/tracksjs/   feladatadatok
/lessons/1710/images_ms/  képek és half/ almappa
```

Parcelben nem feltételezünk Astro-szerű automatikus `public/` másolást. Explicit másolási lépést és azonos originű statikus kiszolgálást vagy proxyútvonalat kell választani. A fejlesztői és éles buildben ugyanazoknak a legacy URL-eknek kell működniük.

A keretadapter klasszikus script-elemekkel tölti be a motort. Megőrzi a `name="carco"`, `project="okosdoboz"` attribútumokat, a `lib` értékéhez pedig a konfigurálható prefixből képzett, például `/lessons/1710/lib/` virtuális URL-t adja. A dokumentum globális `<base>` elemét nem használjuk útvonalkorrekcióra.

Az első POC alapértelmezett prefixe `/lessons`, de például `/content/lessons` is használható. A prefix a feladatok forráshelyét jelöli, nem a keret útvonalát: a keret például `/?lesson=1710` címen indul. A pontos URL- és telepítési szerződést a [parcel-poc.md](parcel-poc.md) rögzíti.

## Astro: alternatív keretirány

Astro akkor lehet előnyös, ha a keret később több oldalt, navigációt és közös layoutot tartalmaz. Nem szükséges hozzá React vagy más kliensoldali UI-framework.

A legacy fájlok a `public/legacy/` alá másolhatók; Astro a `public/` tartalmát feldolgozás nélkül másolja. Az új keret `src/` alatti kódja ettől külön épül.

A legacy scripteket `is:inline` direktívával kell betölteni, hogy klasszikus scriptek maradjanak. Az Astro alapértelmezett feldolgozott scriptje modul lenne, ezért a régi motort nem azon az úton töltjük.

Kezdetben hagyományos teljes oldalnavigációt használunk. Astro `ClientRouter` vagy View Transitions alapú feladatcserét nem kapcsolunk be bizonyított életciklus-kezelés nélkül.

## A jQuery-konténer szerepe

A konténer egyetlen `odPlayer` azonosítójú DOM-elem a kereten belül. A jQuery használható célzott DOM-műveletekre, de **nem izolálja a motort, és nem teszi önmagában reszponzívvá a feladatot**.

A keret lehetőleg natív DOM API-val dolgozik. Ha külön modern jQuery szükséges, azt bundler-modulként, helyi referenciával használjuk; nem írja felül a `window.$` és `window.jQuery` értékét. A legacy motor betöltése után nem hívunk globális `noConflict(true)` műveletet, mert eltávolíthatja a motor által várt globálisokat.

A teljes eredeti HTML-t nem töltjük be jQuery `.load()` hívással. Ez nem őrzi meg önmagában a dokumentum- és scriptéletciklust. Ehelyett explicit adapter hajtja végre az inicializálást.

## Iframe nélküli beágyazás

### Vizsgálandó közvetlen betöltés

**Megvalósult:** a 1710-es feladat a keret `odPlayer` elemébe indul, iframe nélkül. Más, azonos szerződésű csomagok támogatásához további tesztpéldák szükségesek.

Az adapter tervezett indítási sorrendje:

1. Az egyetlen `odPlayer` konténer és a keret beállításainak előkészítése.
2. A klasszikus bootstrap script betöltése a szükséges attribútumokkal, az eredeti sorrendet követve.
3. A feladatazonosító betöltése és a `loadProjects` meghívása.
4. A `createPlayer` egyszeri indítása a projektbetöltés callbackjéből.
5. A tényleges feladat- és assetkészültség külön követése, majd méretezés és interakciós ellenőrzés.

Nem másoljuk át a régi `window.onload` hozzárendelést. Az adapter saját, egyszeri indítást használ. A `playercallback` vagy a scriptbetöltés befejezése nem feltétlenül bizonyítja, hogy az aszinkron feladatadatok és képek már készen állnak.

A motor az `odPlayer` attribútumait átmásolja és beolvassa. Egy nem-`fullscreen` `playersize` attribútummal elkerülhető lehet a 750 px-es viewport-beavatkozás, de ez **nem kész reszponzív mód**: a CSS-minimum és a fix 106 px-es méretezés ettől még fennmaradhat. A query paraméterek ezt az attribútumos beállítást felülírhatják.

A `carco.data.okosdoboz.paramsdata.user` nem tekinthető automatikusan az összes gyökérparaméter konfigurációs felületének; a ténylegesen beolvasott attribútum- vagy queryútvonalat kell használni.

A keret saját stíluslapja és adaptere kezelné a dokumentumszintű minimumot, a CSS-ütközéseket és a kezelősáv újratördelését. A feladattér skálázását továbbra is a motor végezné. Dinamikus kezelősávmagasságnál adapteres korrekció szükséges lehet: ennek belső API-függősége és betöltési időzítése külön vizsgálati pont.

Konténerméret-változáskor a meglévő `resize`/`resizeEnd` útvonalat is működtetni kell, akkor is, ha az ablak mérete nem változott. A méretfigyelés nem hozhat létre önmagát újraindító resize-ciklust.

### Korlátok

- A globális változók, dokumentumstílusok és eseménykezelők közösek a kerettel.
- Nem azonosítottunk általános `destroy`/`unmount` API-t. Ismételt mount, párhuzamos feladatpéldány és SPA-feladatcsere támogatását nem ígérjük.
- Kezdetben egy feladat fut oldalanként; másik feladathoz teljes oldalbetöltés szükséges. A motoron belüli meglévő pályaváltás ettől külön funkció, azt megőrizzük.
- A Shadow DOM nem közvetlen helyettesítő: a `document.getElementById()` nem lát bele a shadow fába, a dokumentum fejlécébe töltött játékspecifikus CSS pedig nem stílusozza a belső elemeket. A globális JS-állapotot sem izolálja. Első körben nem választjuk.
- A belső játék-DOM CSS-transzformációját kerüljük, mert ütközhet az `offsetWidth`, `getBoundingClientRect()` és a motor koordináta-skálázásának használatával.
- Az arányos kicsinyítés nem garantálja a feladatszöveg olvashatóságát minden mobilméreten.

## Iframe-es tartalékút

Az azonos originű iframe megőrzi a feladat saját dokumentumát és elszigeteli a CSS/JS-környezetét. Ehhez a saját feladatbelépési pontot ágyazzuk be, nem a teljes nyilvános portáloldalt.

Módosítatlan fájlok mellett a 750 px-es belső minimum megmarad. A teljes iframe arányosan kicsinyíthető, de a kezelősáv is zsugorodik. Ez kompatibilitási megoldás, nem a kívánt mobilos kezelhetőséggel egyenértékű eredmény. Az iframe külső skálázásának egér- és érintéses működését külön ellenőrizni kell.

Azonos origin mellett a keret adaptert és CSS-t injektálhat a gyermekdokumentumba, de ez külön betöltési és méretezési integrációt igényel. A keret viewport-beállítása önmagában nem írja felül az iframe dokumentumának beállításait.

A magasságot a teljes lejátszóból kell mérni, nem pusztán 7:3 arányból vagy korlátlanul a `body.scrollHeight` alapján. A százalékos és `min-height` méretek miatt kerülni kell a visszacsatolást. A magas információs képernyőknek szükség esetén görgethetőnek kell maradniuk.

### Események és eredmények

A meglévő motor `gyakorloEredmeny`, `tudasprobaEredmeny` és `escPressed` üzeneteket használ. Kész `ready`/`height` üzenetszerződést nem találtunk. A `window.parent` iframe nélkül is létezik, ezért annak igazságértéke nem iframe-detektálás; közvetlen beágyazásnál az önmagának küldött üzeneteket is figyelembe kell venni.

A keret által fogadott `postMessage` üzeneteknél ellenőrizni kell az origint, az `event.source` értékét és az adattartalmat. Új készültségi vagy magasságüzenetek szükségességéről csak a próba után döntünk.

## Opciók összehasonlítása

| Megoldás | Előny | Korlát | Szerep |
| --- | --- | --- | --- |
| Parcel + közvetlen betöltés | Könnyű modern keret, nincs iframe | Globális CSS/JS-ütközések, adapteres méretezés | Első vizsgálati jelölt |
| Astro + közvetlen betöltés | Beépített statikus fájlmásolás, közös layoutok | Ugyanazok a legacy korlátok | Alternatíva |
| Parcel vagy Astro + iframe | Dokumentum- és globális állapotizoláció | Magasságkezelés és mobilos adaptáció | Kontroll és tartalékút |
| Új közös reszponzív lejátszómód | Tisztább, hosszabb távú integrációs felület lehet | A közös motor/lejátszó módosítását igényelheti | Csak külön jóváhagyás után |

A keretrendszer kiválasztása önmagában nem oldja meg a régi motor reszponzivitását. Először a közvetlen betöltés kompatibilitását kell bizonyítani, és csak utána érdemes véglegesíteni az integrációt.

## Történeti megvalósítási terv

Az alábbi lista az implementáció előtti tervet őrzi, nem az aktuális hátralévő feladatokat.

1. **Dokumentáció véglegesítése.** Az eredeti tervezési fázisban kizárólag ez a README készült, csomagtelepítés, scaffold vagy legacy módosítás nélkül.
2. **Alapmérés, külön jóváhagyás után.** Az eredeti feladat HTTP-s betöltése; DOM-méretek, assetútvonalak és interakciók rögzítése. Hipotézis: a keskeny elrendezés fő akadálya a közös minimumszélesség, viewport és kezelősáv. Olcsó ellenőrzés: 390 px-en összevetni a dokumentum, konténer és feladattér tényleges méretét.
3. **Parcel kiszolgálás és minimális közvetlen betöltési próba.** Az alapmérés után: változatlan legacy másolás, stabil URL-prefix, klasszikus scriptbetöltés, egyszeri inicializálás. Ellenőrzés: létrejön-e a feladattér, és működnek-e a dinamikus URL-ek fejlesztésben és éles buildben.
4. **Reszponzív keretadapter.** Sikeres indulás után: CSS-ütközések, kezelősávmagasság, konténer-resize, betöltési és hibaállapot, Fullscreen API és fallback kezelése. A CSS-leltár a kiszolgálási próba előkészítésével párhuzamosan készülhet.
5. **Elfogadási próba és döntés.** Ha a globális ütközések vagy koordináták nem kezelhetők változatlan motorral, visszalépés az iframe-es kontrollhoz. Motorátírás nem kezdődik külön jóváhagyás nélkül.

### Tervezett fájlszerkezet

A keret a repository gyökerében található. Az eredeti terv helyett az aktuális elrendezés:

```text
4kids/
  index.html
  package.json
  src/
    lesson-loader.js
    shell.css
  scripts/
    assets.mjs
    build.mjs
    server.mjs
```

Astro választásakor külön feladatoldal, `LegacyTask.astro` komponens és `public/legacy/` másolat készülhet. Nem építjük fel egyszerre mindkét keretet. A megvalósítás és a futtatóparancsok csak a technológiai döntés után kerülnek a dokumentációba.

## Ellenőrzési feltételek

Az eredeti dokumentációs fázis ellenőrzése csak a README-re vonatkozott. A jelenlegi leírásoknál a helyi hivatkozások létezését és a bizonyított tények, hipotézisek, történeti tervek és hátralévő vizsgálatok elkülönítését kell ellenőrizni.

A későbbi keret elfogadási feltételei:

1. Működés 320, 390, 750, 768, 1024 és 1440 px szélességen; álló/fekvő mobilon és keskeny asztali oszlopban. Ablakváltozás nélküli konténer-resize is helyes.
2. Nincs levágott kezelősáv vagy keretoldali vízszintes túlcsordulás; a feladat arányos, az információs és eredményképernyő elérhető.
3. A 1710 minden pályája végigjárható: választás, ellenőrzés, megoldás, tovább, újraindítás és eredmény. Resize nem állítja vissza az állapotot.
4. Egérrel és érintéssel helyesek a találati koordináták és a görgetés. Más feladattípusokhoz külön húzós, beviteles, matematikai és hangos példák szükségesek; a 1710 önmagában nem teljes regressziós lefedettség.
5. Fejlesztői és éles buildben minden dinamikus script-, CSS-, kép- és hangútvonal működik; nincs 404 vagy mixed content. A legacy fájlok hash-e változatlan.
6. A régi jQuery és pluginjai a megfelelő verzióval működnek, a keret nem írja felül a globálisokat. A bootstrap pontosan egyszer fut.
7. Fullscreen belépés, kilépés, Escape és a nem támogatott platformok fallbackje helyes; az állapot megmarad.
8. A keret globális stílusai és billentyűkezelése nem sérülnek; másik feladatra teljes oldalnavigációval tiszta runtime indul.
9. A fogyasztott üzenetek origin-, forrás- és tartalomellenőrzése megfelelő. A méretfigyelés nem okoz ismétlődő visszacsatolást.
10. Automatizált böngészős ellenőrzés és képernyőképek mellett valódi mobilos érintéspróba is szükséges.

Az aktuális ellenőrzési eredmények a fenti „Ellenőrzés és korlátok” fejezetben szerepelnek. Ez a történeti lista nem tekinthető minden pontjában teljesített elfogadási mátrixnak.

## Határok és nyitott döntések

Nem cél a feladatadatok átírása, a jQuery/CreateJS/MathJax frissítése, több párhuzamos runtime, SPA-életciklus, backend/LMS átalakítás vagy a nyilvános portál újraépítése. A rögzített pályaadatokból valódi szöveg-reflow nem vállalható feladatadaptáció nélkül.

Parcel, Express production kiszolgálás, buildpack build és a konfigurálható prefix már megvalósult. Nyitott feladat a további feladattípusok, valódi mobilok és a teljes regressziós mátrix ellenőrzése; Astro és iframe nincs implementálva.

A közös motor vagy lejátszó módosítása továbbra is külön döntést igényel. Az egykori dokumentációs jóváhagyási kapu történeti előzmény; a jelenlegi implementáció és ellenőrzési eredmények a dokumentum első felében szerepelnek.

## Források

- [Parcel HTML-feldolgozás](https://parceljs.org/languages/html/): scriptkezelés, HTML-függőségek és URL-átírás.
- [Parcel dependency resolution](https://parceljs.org/features/dependency-resolution/): URL-ek és függőségfeloldás.
- [Astro kliensoldali scriptek](https://docs.astro.build/en/guides/client-side-scripts/): feldolgozott modulok és `is:inline` scriptbetöltés.
- [Astro projektstruktúra](https://docs.astro.build/en/basics/project-structure/): a `public/` fájlok változatlan másolása.
- [lessons/lib/carco_drag.js](lessons/lib/carco_drag.js): a meglévő interakciós és koordinátakezelés vizsgálati alapja.