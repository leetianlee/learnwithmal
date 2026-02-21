import { initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'

const firebaseConfig = {
  apiKey: "AIzaSyC0QuyLRW2MtF8qL_7hqvogox4leoAlIm0",
  authDomain: "learnwithmal.firebaseapp.com",
  databaseURL: "https://learnwithmal-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "learnwithmal",
  storageBucket: "learnwithmal.firebasestorage.app",
  messagingSenderId: "805156901230",
  appId: "1:805156901230:web:fec11473348eca18bfb17f"
}

const app = initializeApp(firebaseConfig)
export const db = getDatabase(app)
