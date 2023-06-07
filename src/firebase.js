import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from 'firebase/auth';
import { getStorage } from "firebase/storage";



const firebaseConfig = {
    apiKey: "AIzaSyCl5iuRC8Z12YQ5djKxH0K9NJDYGNJ1yQ8",
    authDomain: "instagram-clone-26bc7.firebaseapp.com",
    databaseURL: "https://instagram-clone-26bc7-default-rtdb.firebaseio.com",
    projectId: "instagram-clone-26bc7",
    storageBucket: "instagram-clone-26bc7.appspot.com",
    messagingSenderId: "248958907706",
    appId: "1:248958907706:web:68c38f958fad27e1d98c03",
    measurementId: "G-EXC5E1Q71T"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth();
export const storage = getStorage(app);


