import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Your Firebase configuration
// Replace with your actual Firebase config from Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyDtSsDs2XHriK4QBs8PlKh4TGYF3kDd_g4",
  authDomain: "campus-lost-found-8ab2f.firebaseapp.com",
  projectId: "campus-lost-found-8ab2f",
  storageBucket: "campus-lost-found-8ab2f.firebasestorage.app",
  messagingSenderId: "639382320270",
  appId: "1:639382320270:web:98ce280dcc3597f26ac5df",
  measurementId: "G-EHK5DXHHC6"
};

// Check if Firebase is configured
const isFirebaseConfigured = firebaseConfig.apiKey !== "your-api-key" && firebaseConfig.apiKey.length > 0;

let app, db, storage, auth, googleProvider;

if (isFirebaseConfigured) {
  // Initialize Firebase
  app = initializeApp(firebaseConfig);

  // Initialize Firebase services
  db = getFirestore(app);
  storage = getStorage(app);
  auth = getAuth(app);
  googleProvider = new GoogleAuthProvider();
} else {
  // Mock Firebase services for development
  console.warn('⚠️ Firebase not configured! Please set up your Firebase project and update the configuration in src/firebase.js');
  console.log('📖 Setup instructions: https://firebase.google.com/docs/web/setup');
  
  // Create mock objects to prevent errors
  db = {
    collection: () => ({
      add: () => Promise.reject(new Error('Firebase not configured')),
      get: () => Promise.reject(new Error('Firebase not configured')),
      onSnapshot: () => () => {},
      orderBy: () => ({ onSnapshot: () => () => {} })
    }),
    doc: () => ({
      get: () => Promise.reject(new Error('Firebase not configured')),
      update: () => Promise.reject(new Error('Firebase not configured'))
    })
  };
  
  storage = {
    ref: () => ({
      put: () => Promise.reject(new Error('Firebase not configured')),
      getDownloadURL: () => Promise.reject(new Error('Firebase not configured'))
    })
  };
  
  auth = {
    onAuthStateChanged: (callback) => {
      callback(null); // No user authenticated
      return () => {};
    },
    signInWithPopup: () => Promise.reject(new Error('Firebase not configured')),
    signOut: () => Promise.reject(new Error('Firebase not configured'))
  };
  
  googleProvider = {};
}

// Test Firebase Storage connection
if (isFirebaseConfigured) {
  console.log('🔥 Firebase configured successfully!');
  console.log('📊 Project ID:', firebaseConfig.projectId);
  console.log('🗄️ Storage Bucket:', firebaseConfig.storageBucket);
}

export { db, storage, auth, googleProvider };
export default app; 