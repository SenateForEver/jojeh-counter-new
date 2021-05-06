import firebase from "firebase";

let fi;
if(firebase.apps.length > 0) {
    fi = firebase.app();
}else {
    fi = firebase.initializeApp({
        apiKey: "AIzaSyCO5cHSLl5YTuMBEUUk700TwF51V9yWmh0",
        authDomain: "senate-parliment.firebaseapp.com",
        projectId: "senate-parliment",
        storageBucket: "senate-parliment.appspot.com",
        messagingSenderId: "53003340230",
        appId: "1:53003340230:web:4674ac60a692c02f0acac7",
        measurementId: "G-5L9TBVLHVE"
    })
}

export default fi;

