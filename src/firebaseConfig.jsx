import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
//import { getAnalytics } from "firebase/analytics";


const firebaseConfig = {
  apiKey: "AIzaSyDg-FGh_1QObnTsViVVP2-MZ_vXu7KypAc",
  authDomain: "ilusoes-industriais.firebaseapp.com",
  projectId: "ilusoes-industriais",
  storageBucket: "ilusoes-industriais.appspot.com",
  messagingSenderId: "347856187552",
  appId: "1:347856187552:web:6b304636308b8b9428d9c5",
  measurementId: "G-277N3NS54N",
};

const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);

export const storage = getStorage(app);
