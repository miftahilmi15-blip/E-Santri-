// firebase.js (VERSI BENAR UNTUK COMPAT)

const firebaseConfig = {
  apiKey: "AIzaSyD9....",
  authDomain: "e-santri-123.firebaseapp.com",
  projectId: "e-santri-123",
  storageBucket: "e-santri-123.appspot.com",
  messagingSenderId: "10928291...",
  appId: "1:10928:web:8ab..."
};

// Inisialisasi Firebase (compat)
firebase.initializeApp(firebaseConfig);

// WAJIB ADA: Auth & Firestore instance
const auth = firebase.auth();
const db = firebase.firestore();
