// Ponte tra l'app (script classico) e Firebase (SDK a moduli).
// Espone window.__cloudSyncReady, una Promise che si risolve con:
//   { configured:false }                      se firebase-config.js non è stato compilato
//   { configured:true, onAuth, signIn, ... }   se Firebase è pronto all'uso

function resolveReady(api){
  if(window.__cloudSyncResolve) window.__cloudSyncResolve(api);
  else window.__cloudSyncReady = Promise.resolve(api);
}

const cfg = window.BETLEDGER_FIREBASE_CONFIG || {};
const isConfigured = !!cfg.apiKey && !/^YOUR_/.test(cfg.apiKey);

if(!isConfigured){
  resolveReady({configured:false});
}else{
  try{
    const [{ initializeApp }, authMod, fsMod] = await Promise.all([
      import('https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js'),
      import('https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js'),
      import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js')
    ]);
    const {
      getAuth, onAuthStateChanged, createUserWithEmailAndPassword,
      signInWithEmailAndPassword, signOut, sendPasswordResetEmail
    } = authMod;
    const { getFirestore, doc, getDoc, setDoc, onSnapshot } = fsMod;

    const app = initializeApp(cfg);
    const auth = getAuth(app);
    const db = getFirestore(app);

    const api = {
      configured: true,
      onAuth(cb){ return onAuthStateChanged(auth, cb); },
      async signIn(email, pass){ const c = await signInWithEmailAndPassword(auth, email, pass); return c.user; },
      async signUp(email, pass){ const c = await createUserWithEmailAndPassword(auth, email, pass); return c.user; },
      async signOutUser(){ return signOut(auth); },
      async resetPassword(email){ return sendPasswordResetEmail(auth, email); },
      async fetchDoc(uid){
        const snap = await getDoc(doc(db, 'betledger', uid));
        return snap.exists() ? snap.data().state : null;
      },
      async writeDoc(uid, jsonStr){
        await setDoc(doc(db, 'betledger', uid), { state: jsonStr, updatedAt: new Date().toISOString() });
      },
      subscribeDoc(uid, cb){
        return onSnapshot(doc(db, 'betledger', uid), snap=>{
          if(snap.metadata.hasPendingWrites) return; // ignora l'eco della nostra stessa scrittura
          if(!snap.exists()) return;
          const data = snap.data();
          if(data && data.state) cb(data.state);
        }, err=>{ console.warn('BetLedger cloud sync listener error', err); });
      }
    };
    resolveReady(api);
  }catch(e){
    console.warn('BetLedger: impossibile inizializzare Firebase', e);
    resolveReady({configured:false});
  }
}
