// Firebase configuration - Replace with your actual config
const firebaseConfig = {
    apiKey: "AIzaSyBxrfJA7Ppuq_94MrxXauSldUv-vrnN0RA",
    authDomain: "trub-chat.firebaseapp.com",
    databaseURL: "https://trub-chat-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "trub-chat",
    storageBucket: "trub-chat.firebasestorage.app",
    messagingSenderId: "743562830964",
    appId: "1:743562830964:web:afd77e57d6764d76e99d21"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const database = firebase.database();