
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCq7WR44VtYd3Tg6jrRNeQjGXhfzKsHyJI",
  authDomain: "inventario-e5209.firebaseapp.com",
  projectId: "inventario-e5209",
  storageBucket: "inventario-e5209.firebasestorage.app",
  messagingSenderId: "463291387524",
  appId: "1:463291387524:web:07163078c1b9e67ca57cd1",
  measurementId: "G-BQW7MTZP1V"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);

export default app;
