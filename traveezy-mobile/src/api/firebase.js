import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc, collection, query, where, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Helper methods as requested
export const saveTrip = async (docId, tripData) => {
  await setDoc(doc(db, "AITrips", docId), tripData);
  return docId;
};

export const getTripById = async (docId) => {
  const docSnap = await getDoc(doc(db, 'AITrips', docId));
  return docSnap.exists() ? docSnap.data() : null;
};

export const getUserTrips = async (email) => {
  const q = query(collection(db, 'AITrips'), where('userEmail', '==', email));
  const querySnapshot = await getDocs(q);
  const trips = [];
  querySnapshot.forEach((doc) => {
    trips.push(doc.data());
  });
  return trips;
};
