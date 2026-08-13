# BetLedger — installazione e sincronizzazione

BetLedger è ora un'app web installabile (PWA): la apri da un link, la aggiungi
alla schermata Home del telefono e si comporta come un'app vera — icona,
schermo intero, funziona anche offline. Con Firebase configurato (facoltativo
ma consigliato), i dati che inserisci su un dispositivo compaiono in automatico
su tutti gli altri, in tempo reale.

File del progetto:
- `index.html` — l'app
- `manifest.json` — dice al telefono come installarla (nome, icona, colori)
- `sw.js` — service worker: cache offline e aggiornamenti automatici
- `icons/` — icone dell'app in varie dimensioni
- `firebase-config.js` — qui incolli le tue credenziali Firebase (vedi sotto)
- `firebase-sync.js` — collega l'app a Firebase, non va modificato

---

## 1. Pubblica l'app su GitHub Pages (link fisso, gratis)

1. Crea un account su [github.com](https://github.com) se non ce l'hai già.
2. Crea un nuovo repository (es. `betledger`), pubblico, senza README
   (ce l'hai già).
3. Da questa cartella, carica i file:
   ```bash
   git init
   git add .
   git commit -m "BetLedger"
   git branch -M main
   git remote add origin https://github.com/TUO-USERNAME/betledger.git
   git push -u origin main
   ```
4. Su GitHub: **Settings → Pages** → in "Build and deployment" scegli
   **Deploy from a branch**, branch `main`, cartella `/ (root)` → **Save**.
5. Dopo 1-2 minuti l'app è online su
   `https://TUO-USERNAME.github.io/betledger/`.

Ogni volta che vuoi aggiornare l'app, modifichi i file e rifai
`git add . && git commit -m "update" && git push`: GitHub Pages ripubblica da
solo in un minuto, e chi ha l'app installata sul telefono la vede aggiornata
alla riapertura successiva (grazie al service worker "rete prima" su
`index.html`).

**Nota:** per un attimo, appena crei il repository, potrebbe non essere
ancora raggiungibile su https — è normale, riprova tra un minuto.

## 2. Installala sul telefono

- **Android (Chrome):** apri il link, comparirà una barra "Installa
  BetLedger sul telefono" in basso — tocca **Installa**. In alternativa:
  menu ⋮ → "Installa app".
- **iPhone/iPad (Safari):** apri il link, tocca l'icona **Condividi** ⬆️ in
  basso, poi **Aggiungi a Home**.
- **PC (Chrome/Edge):** icona di installazione nella barra degli indirizzi,
  oppure menu → "Installa BetLedger".

Da quel momento l'icona è sulla home/schermata app come qualunque altra app.

## 3. Attiva la sincronizzazione automatica (Firebase, gratis)

Senza questo passaggio l'app funziona benissimo, ma ogni dispositivo tiene i
suoi dati per conto proprio (puoi comunque spostarli a mano con
Copia/Incolla o Esporta/Importa, dentro **Budget & Dati**). Con Firebase
configurato, invece, basta accedere con la stessa email su ogni dispositivo.

### 3.1 Crea il progetto Firebase

1. Vai su [console.firebase.google.com](https://console.firebase.google.com)
   e accedi con un account Google.
2. **Aggiungi progetto** → dagli un nome (es. `betledger`) → puoi disattivare
   Google Analytics, non serve → **Crea progetto**.
3. Nella pagina del progetto, clicca l'icona web `</>` per aggiungere una
   "app web" → dai un nickname (es. `betledger-web`) → **NON** serve
   spuntare Firebase Hosting → **Registra app**.
4. Firebase mostra un blocco di codice con `const firebaseConfig = {...}`:
   ti servono i valori dentro le graffe.

### 3.2 Abilita login via email

1. Nel menu a sinistra: **Authentication** → **Get started**.
2. Scheda **Sign-in method** → clicca **Email/Password** → attivalo (il
   primo interruttore) → **Save**.

### 3.3 Crea il database

1. Nel menu a sinistra: **Firestore Database** → **Crea database**.
2. Scegli una località vicina a te (es. `eur3 (europe-west)`).
3. Modalità: **produzione** (production mode).
4. Vai sulla scheda **Regole** (Rules) del database e sostituisci tutto con:

   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /betledger/{uid} {
         allow read, write: if request.auth != null && request.auth.uid == uid;
       }
     }
   }
   ```

   Questo garantisce che ogni utente possa leggere e scrivere **solo i
   propri** dati. Clicca **Pubblica**.

### 3.4 Incolla la configurazione nell'app

Apri `firebase-config.js` in questa cartella e sostituisci i valori
`"YOUR_..."` con quelli che Firebase ti ha mostrato al punto 3.1, es.:

```js
window.BETLEDGER_FIREBASE_CONFIG = {
  apiKey: "AIzaSyD...",
  authDomain: "betledger-xxxxx.firebaseapp.com",
  projectId: "betledger-xxxxx",
  storageBucket: "betledger-xxxxx.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};
```

Questi valori **non sono segreti**: è normale che compaiano nel codice
pubblico di un'app web Firebase. La protezione dei tuoi dati è affidata alle
regole del punto 3.3, non alla segretezza di questi valori.

Salva, poi `git add . && git commit -m "firebase config" && git push` per
aggiornare la versione online.

### 3.5 Accedi dall'app

1. Apri l'app (dal link o dall'icona installata) → tab **Budget & Dati** →
   sezione **Sincronizza tra dispositivi**.
2. Inserisci email e password a tua scelta (non serve un account Google) →
   **Crea account**.
3. Su ogni altro dispositivo, apri lo stesso link/app → stessa sezione →
   inserisci la stessa email e password → **Accedi**.

Da quel momento ogni modifica che fai su un dispositivo compare
automaticamente sugli altri (entro un paio di secondi, se sono online). Se un
dispositivo va offline, continua a salvare in locale e si riallinea da solo
alla prossima connessione.

---

## Domande frequenti

**Devo pagare qualcosa?** No. Sia GitHub Pages che il piano gratuito di
Firebase (Spark) bastano ampiamente per un uso personale come questo:
Firestore gratuito include 50.000 letture e 20.000 scritture al giorno, molto
più di quanto un registro scommesse personale possa mai usare.

**Posso usare l'app senza fare nessuno dei due passaggi?** Sì: apri
`index.html` con un doppio click, o caricalo su qualsiasi hosting statico.
Senza HTTPS però l'installazione come app e il service worker non si
attivano (sono requisiti del browser, non di quest'app) — funzionerà comunque
come pagina normale, dati salvati solo in locale.

**Ho dati vecchi salvati dentro Claude/nell'artifact originale, come li
recupero?** Apri quella versione, tab Budget & Dati → **Esporta dati
(.json)**, poi in questa nuova versione **Importa dati** con lo stesso file.
