import { initializeApp } from "firebase/app";
// ДОБАВЯМЕ импорта за Firestore (базата данни)
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBvpr8oBnLIbw9gDcM354L1KHs0Ttb05oA",
  authDomain: "bullsandcows-39b26.firebaseapp.com",
  projectId: "bullsandcows-39b26",
  storageBucket: "bullsandcows-39b26.firebasestorage.app",
  messagingSenderId: "1092708098347",
  appId: "1:1092708098347:web:088523d0fc31e33662a56e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ТОВА ЛИПСВАШЕ: Инициализираме и експортираме базата данни (db), 
// за да могат Game.jsx и Leaderboard.jsx да я ползват!
export const db = getFirestore(app);