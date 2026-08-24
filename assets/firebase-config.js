/* ============================================================
   Firebase 초기화 — 로그인(이메일/구글) + Firestore 저장
   ============================================================ */
const firebaseConfig = {
  apiKey: "AIzaSyBX1idedJtVNYaRnrT1-Jm2oZhuTp-lhRs",
  authDomain: "hyundai-engb-vibe.firebaseapp.com",
  projectId: "hyundai-engb-vibe",
  storageBucket: "hyundai-engb-vibe.firebasestorage.app",
  messagingSenderId: "263219288099",
  appId: "1:263219288099:web:4fbfa41d4bf358fdf33996"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
