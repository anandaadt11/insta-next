// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: "insta-next-6d743.firebaseapp.com",
    projectId: "insta-next-6d743",
    storageBucket: "insta-next-6d743.appspot.com",
    messagingSenderId: "130867948188",
    appId: "1:130867948188:web:1ca9d27d1a0b8f385c5b59"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);


// service firebase.storage {
//     match / b / { bucket } / o {
//         match / { allPaths=**} {
//       allow read;
//       allow write: if
//       request.resource.size < 2 * 1024 * 1024 &&
//                 request.resource.contentType.matches('image/.*')
//     }
//     }
// }