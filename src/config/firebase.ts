import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; 

const firebaseConfig = {
  // ... your existing config keys
};

const app = initializeApp(firebaseConfig);

// INITIALIZE AND EXPORT FIRESTORE
export const db = getFirestore(app);