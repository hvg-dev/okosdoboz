# Reszponzív keret régi Okosdoboz-feladatokhoz

## Parcel POC terv

Az első, konzervatív POC implementációja a [shell/package.json](shell/package.json) alatt található: iframe nélküli Parcel-keret, egy oldalbetöltésben egy feladat, konfigurálható same-origin `/lessons` prefix és változatlan legacy források. A specifikáció és az implementáció eltérései a [parce-poc.md](parce-poc.md) dokumentumban olvashatók.

## Futtatás

Node.js 22 vagy újabb verzió szükséges. A repository gyökeréből:

```sh
npm ci --prefix shell
npm run dev --prefix shell
```

A keret címe: **http://localhost:3000/?lesson=1710**. Másik port: `PORT=3100 npm run dev --prefix shell`. A belső Parcel-port alapértelmezésben a külső port + 1; `PARCEL_PORT` értékkel felülírható. Nincs iframe, és nincs SPA-feladatcsere.

```sh
npm run build --prefix shell
npm test --prefix shell
PORT=3200 npm run preview --prefix shell
```

Az `npm test` a kész build legacy hash-eit is ellenőrzi, ezért előtte szükséges a build. A preview címe ekkor http://localhost:3200/. A `shell/dist` statikusan is kiszolgálható.

## Konténeres hosztolás

A gyökérben található [Dockerfile](Dockerfile) Node.js 22 alatt elkészíti a production buildet és futtatja a Node-teszteket. A végső image csak a statikus outputot és a nem root felhasználóval futó Nginx-kiszolgálót tartalmazza; nincs benne Parcel fejlesztői szerver vagy Node runtime.

A repository gyökeréből:

```sh
docker build -t okosdoboz-shell:poc .
docker run --detach --name okosdoboz-shell --restart unless-stopped -p 8080:8080 okosdoboz-shell:poc
```

Elérés: **http://localhost:8080/?lesson=1710**. A konténer belső portja 8080, healthcheckje a konfigurációs fájl HTTP-elérhetőségét ellenőrzi. Más külső porthoz például `-p 8085:8080` használható. Internetes publikálásnál HTTPS-t biztosító reverse proxy szükséges.

Alternatív feladatprefix az image építésekor adható meg:

```sh
docker build --build-arg LESSONS_PREFIX=/content/lessons -t okosdoboz-shell:custom .
```

A prefix a buildben szereplő konfigurációhoz és assethelyhez kötött; futásidejű környezeti változóval nem módosítható. Az [nginx.conf](nginx.conf) valódi 404-et ad hiányzó fájlokra, a konfigurációra `no-store` cache-szabályt használ. A [.dockerignore](.dockerignore) kizárja a helyi függőségeket, buildoutputokat és tesztartefaktumokat a build contextből.

A konténerbuild és a HTTP smoke teszt sikeres: keret, konfiguráció és feladatbelépőasset elérhető, az Nginx nem rootként fut. A lent dokumentált legacy/MathJax biztonsági korlátok a konténeres kiadásra is vonatkoznak.

## Kubernetes

A [k8s/deployment.yaml](k8s/deployment.yaml) két Nginx-példányt indít resource limitekkel, nem root felhasználóval és HTTP startup/readiness/liveness probe-okkal. A [k8s/service.yaml](k8s/service.yaml) belső `ClusterIP` Service: 80-as portja a podok 8080-as portjára mutat. A manifestek nem rögzítenek namespace-t.

Telepítés előtt a Deployment `image` értékét cseréld a saját registrybe feltöltött, verziózott image nevére. Az alapértelmezett `okosdoboz-shell:poc` csak akkor használható, ha az image minden érintett node számára elérhető; a helyi Docker-image önmagában nem kerül be a klaszterbe. Privát registry esetén külön `imagePullSecrets` beállítás szükséges.

```sh
kubectl apply -f k8s/
kubectl rollout status deployment/okosdoboz-shell
kubectl port-forward service/okosdoboz-shell 8080:80
```

A port-forward után http://localhost:8080/?lesson=1710 címen érhető el. A parancsok az aktuális kubectl context namespace-ét használják; más namespace-hez add hozzá a `-n <namespace>` kapcsolót. Külső, HTTPS-es publikáláshoz külön Ingress vagy Gateway konfiguráció szükséges, ez nem része a két manifestnek.

## Források és konfiguráció

```text
lessons/
  lib/                         változatlan közös motor
  1710/
    1710/                      eredeti HTML, index.js és XML-ek
    tracksjs/                  a feladat pályái
    images_ms/                 a feladat képei, half/ almappával
shell/                         új Parcel-keret és tesztek
```

A [shell/public/shell-config.json](shell/public/shell-config.json) állítja a `lessonsPrefix`, `defaultLessonId`, `supportedLessonIds` és `loadTimeoutMs` értékeket. Új feladat azonos szerkezetben helyezhető el a `lessons/<ID>/` alatt, majd a manifest bővíthető; az adapterkódhoz nem kell új feladatág.

Alternatív prefix fejlesztéskor: `LESSONS_PREFIX=/content/lessons npm run dev --prefix shell`. Éles buildnél ugyanezt a változót a buildhez kell megadni. A preview a buildben tárolt konfigurációt használja: csak a prefix JSON-értékének átírása nem mozgatja át a fájlokat. `LESSONS_SOURCE_DIR` másik forráskönyvtárat jelölhet, az új `lessons/` szerkezetben.

A motor a `lib` szülőjéből számolja az assetgyökeret. Ezért a `/lessons/1710/lib/` virtuális útvonal a közös `/lessons/lib/` tartalmát szolgálja ki. A production build feladatonként generált könyvtármásolattal biztosítja ugyanezt; ez nem új, kézzel karbantartandó forrás. A feladat belépőscriptje `/lessons/1710/1710/index.js`.

## Ellenőrzés és korlátok

Sikeres production build és öt Node-teszt: prefix/ID validáció, scriptbetöltési sorrend, egyszeri indítás, abort utáni késői callback, valamint bájtazonos legacy output. Az integrált böngészőben ellenőrizve: 320–1440 px-es elrendezés, dev és production betöltés, `/lessons` és `/content/lessons` prefix, választás/ellenőrzés/megoldás/pályaváltás, info képernyő és valódi asset-404.

Az automatizált Playwright-suite a jelenlegi Linux-környezetben hiányzó Chromium rendszerkönyvtárak miatt nem futott végig. Másik, előkészített gépen:

```sh
cd shell
npx playwright install chromium
npm run test:e2e
```

Linuxon a Playwright rendszerfüggőségeit is telepíteni kell; az esetleges adminisztrátori telepítést a környezet gazdája végezze. Production teszthez futó preview mellett `TEST_URL=http://localhost:3200 npm run test:e2e` használható.

A mellékelt MathJax-mappa üres volt. A keret MathJax **2.7.9** fájlokkal egészíti ki a kiszolgálást és a buildet, a meglévő motorfájlok módosítása nélkül. Az npm audit erre ismert, magas súlyosságú **ReDoS** figyelmeztetést ad ([GHSA-v638-q856-grg8](https://github.com/advisories/GHSA-v638-q856-grg8)); a 4-es főverzió nem közvetlen helyettesítő a régi `MathJax.Hub` API-hoz. Csak megbízható feladatcsomagokkal használható POC, élesítés előtt külön biztonsági döntés szükséges.

További feladattípusok, teljes hatpályás regresszió, valódi mobilos touch és fullscreen/fallback mátrix még külön ellenőrzendők. Az arányos feladatkicsinyítés nem jelent szöveges újratördelést.

## Eredeti felmérés

Az alábbi fejezetek az általános megközelítést és alternatívákat őrzik. A fenti futtatási útmutató és az új forrásstruktúra az aktuális POC-ra vonatkozó elsődleges szerződés.

## Állapot és cél

Az eredeti felmérést követően elkészült az első működő POC. Az alábbi alternatívák közül jelenleg a Parcel-alapú, közvetlen betöltés van implementálva.

A cél modern, reszponzív keret készítése [Parcel](https://parceljs.org/) segítségével, vagy alternatívaként [Astro](https://astro.build/) használatával. A meglévő feladatok JavaScript-kódját, a közös motort és a függőségek verzióját az első vizsgálati körben nem változtatjuk meg.

Egyeztetett elvárások:

- A keret és a feladatfájlok saját, azonos originű kiszolgálásból működnek.
- A kezelősáv mobilon is olvasható és használható maradjon, szükség esetén újratördeléssel.
- A feladat belső elrendezése arányosan skálázódhat; valódi szöveges újratördelés nem követelmény.
- Megvizsgáljuk az iframe nélküli beágyazást. Az iframe kompatibilitási kontroll és tartalékmegoldás marad.

Kiindulópont: [lessons/1710/1710/index.html](lessons/1710/1710/index.html). Éles referencia: [Újságíró-iskola](https://www.okosdoboz.hu/feladatsor?id=1710).

Az éles oldal tartalmát lekértük, de a tényleges beágyazási DOM-ját, CSP/X-Frame-Options fejléceit és böngészős méreteit nem igazoltuk. A közvetlen beágyazás működése még hipotézis, nem teszteredmény.

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

A modern build kizárólag az új keretet, annak stílusát és adapterét dolgozza fel. A legacy fájlok változatlan statikus másolással, a relatív mappaszerkezet megőrzésével kerülnek a kiszolgálásba. A másolást később automatizáljuk; a jelenlegi könyvtárak maradnak az egyetlen forrás.

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

Az első POC alapértelmezett prefixe `/lessons`, de például `/content/lessons` is használható. A prefix a feladatok forráshelyét jelöli, nem a keret útvonalát: a keret például `/?lesson=1710` címen indul. A pontos URL- és telepítési szerződést a [parce-poc.md](parce-poc.md) rögzíti.

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

**Hipotézis:** egy aktív feladat egy dokumentumban közvetlenül a keret `odPlayer` elemébe indítható, a legacy források átírása nélkül. Ezt külön böngészős próbával kell igazolni.

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

## Későbbi megvalósítási lépések

1. **Dokumentáció véglegesítése.** Jelenleg kizárólag ez a README készül. Nincs csomagtelepítés, scaffold vagy legacy módosítás.
2. **Alapmérés, külön jóváhagyás után.** Az eredeti feladat HTTP-s betöltése; DOM-méretek, assetútvonalak és interakciók rögzítése. Hipotézis: a keskeny elrendezés fő akadálya a közös minimumszélesség, viewport és kezelősáv. Olcsó ellenőrzés: 390 px-en összevetni a dokumentum, konténer és feladattér tényleges méretét.
3. **Parcel kiszolgálás és minimális közvetlen betöltési próba.** Az alapmérés után: változatlan legacy másolás, stabil URL-prefix, klasszikus scriptbetöltés, egyszeri inicializálás. Ellenőrzés: létrejön-e a feladattér, és működnek-e a dinamikus URL-ek fejlesztésben és éles buildben.
4. **Reszponzív keretadapter.** Sikeres indulás után: CSS-ütközések, kezelősávmagasság, konténer-resize, betöltési és hibaállapot, Fullscreen API és fallback kezelése. A CSS-leltár a kiszolgálási próba előkészítésével párhuzamosan készülhet.
5. **Elfogadási próba és döntés.** Ha a globális ütközések vagy koordináták nem kezelhetők változatlan motorral, visszalépés az iframe-es kontrollhoz. Motorátírás nem kezdődik külön jóváhagyás nélkül.

### Tervezett fájlszerkezet

Későbbi Parcel megvalósítás lehetséges elrendezése, még nem létrehozott fájlokkal:

```text
shell/
  index.html
  package.json
  src/
    legacy-adapter.js
    shell.css
  scripts/
    sync-legacy.mjs
```

Astro választásakor külön feladatoldal, `LegacyTask.astro` komponens és `public/legacy/` másolat készülhet. Nem építjük fel egyszerre mindkét keretet. A megvalósítás és a futtatóparancsok csak a technológiai döntés után kerülnek a dokumentációba.

## Ellenőrzési feltételek

A dokumentáció ellenőrzése: csak ez a README módosuljon; a helyi hivatkozások létezzenek; a bizonyított tények, hipotézisek és jövőbeli lépések váljanak el egymástól.

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

**Jelenleg nincs runtime teszteredmény.** A fenti lista jövőbeli elfogadási feltétel, nem teljesített tesztlista.

## Határok és nyitott döntések

Nem cél a feladatadatok átírása, a jQuery/CreateJS/MathJax frissítése, több párhuzamos runtime, SPA-életciklus, backend/LMS átalakítás vagy a nyilvános portál újraépítése. A rögzített pályaadatokból valódi szöveg-reflow nem vállalható feladatadaptáció nélkül.

Nyitott kérdések: Parcel vagy Astro végleges választása; a statikus kiszolgálás módja és telepítési prefixe; a közvetlen betöltés kompatibilitása; a tényleges készültségi jel és kezelősávmagasság mérési módja; a további regressziós feladatminták.

A közös motor vagy lejátszó módosítása külön döntést igényel. A következő fejlesztési lépés csak a dokumentáció elfogadása és új jóváhagyás után indul.

## Források

- [Parcel HTML-feldolgozás](https://parceljs.org/languages/html/): scriptkezelés, HTML-függőségek és URL-átírás.
- [Parcel dependency resolution](https://parceljs.org/features/dependency-resolution/): URL-ek és függőségfeloldás.
- [Astro kliensoldali scriptek](https://docs.astro.build/en/guides/client-side-scripts/): feldolgozott modulok és `is:inline` scriptbetöltés.
- [Astro projektstruktúra](https://docs.astro.build/en/basics/project-structure/): a `public/` fájlok változatlan másolása.
- [lessons/lib/carco_drag.js](lessons/lib/carco_drag.js): a meglévő interakciós és koordinátakezelés vizsgálati alapja.