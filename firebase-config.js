/*
  CONFIGURAZIONE FIREBASE — sincronizzazione cloud tra dispositivi
  ================================================================
  Questi valori NON sono segreti: fanno parte del codice pubblico di
  qualsiasi app web che usa Firebase, e sono pensati per essere visibili.
  La sicurezza dei tuoi dati è garantita dalle "regole di sicurezza"
  di Firestore (vedi README.md), non dal nascondere questa chiave.

  Come ottenerli (5 minuti, gratis):
  1. Vai su https://console.firebase.google.com e crea un progetto.
  2. Nel progetto: "Aggiungi app" → icona web ( </> ) → dai un nome
     (es. "BetLedger") → NON serve Firebase Hosting → Registra app.
  3. Firebase ti mostra un oggetto firebaseConfig: copia i valori
     qui sotto, uno per uno.
  4. Nel menu a sinistra: Authentication → Get started → Sign-in
     method → abilita "Email/Password".
  5. Nel menu a sinistra: Firestore Database → Crea database →
     scegli una regione vicina a te → modalità "produzione".
  6. Vai su Firestore → Regole e incolla le regole indicate nel README.

  Finché lasci i valori "YOUR_..." qui sotto, l'app funziona lo stesso
  ma solo in locale (nessuna sincronizzazione tra dispositivi).
*/
window.BETLEDGER_FIREBASE_CONFIG = {
  apiKey: "AIzaSyBqIf6ZKFf3PwSisFTyAdnjL18_KuWwLQk",
  authDomain: "betledger-310ef.firebaseapp.com",
  projectId: "betledger-310ef",
  storageBucket: "betledger-310ef.firebasestorage.app",
  messagingSenderId: "289589430059",
  appId: "1:289589430059:web:68a5c09b6be4c8d0e5276e"
};
