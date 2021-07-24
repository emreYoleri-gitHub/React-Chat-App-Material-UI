import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyBmmO3M09FgINTT85VV7jx7VVE8kbzkQtA",
  authDomain: "react-whatsapp-clone-3c859.firebaseapp.com",
  projectId: "react-whatsapp-clone-3c859",
  storageBucket: "react-whatsapp-clone-3c859.appspot.com",
  messagingSenderId: "642890264380",
  appId: "1:642890264380:web:4a87640ee3dac307e6b839",
  measurementId: "G-HFNT26ZDCP",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();

const auth = firebase.auth();

const provider = new firebase.auth.GoogleAuthProvider();

export default db;
export { auth, provider };
