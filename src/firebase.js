import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyB4uMm_9XCdtIVDdz6F1d7LXJ5LkVF9rNY",
  authDomain: "album-copa-b5f48.firebaseapp.com",
  databaseURL: "https://album-copa-b5f48-default-rtdb.firebaseio.com",
  projectId: "album-copa-b5f48",
  storageBucket: "album-copa-b5f48.firebasestorage.app",
  messagingSenderId: "830575214437",
  appId: "1:830575214437:web:054be52aa5295c59562b8c",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
