# Firebase Setup Guide

## Quick Setup (5 minutes)

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Name it "campus-lost-found" (or any name you prefer)
4. Follow the setup wizard (you can disable Google Analytics if you want)

### 2. Enable Services
1. **Authentication**:
   - Go to Authentication > Sign-in method
   - Click "Google" and enable it
   - Add "localhost" to authorized domains

2. **Firestore Database**:
   - Go to Firestore Database
   - Click "Create database"
   - Choose "Start in test mode" (you can secure it later)

3. **Storage**:
   - Go to Storage
   - Click "Get started"
   - Choose "Start in test mode"

### 3. Get Your Config
1. Go to Project Settings (gear icon)
2. Scroll to "Your apps"
3. Click the web icon (</>)
4. Register app with name "Campus Lost & Found"
5. Copy the config object

### 4. Update Firebase Config
Replace the placeholder values in `src/firebase.js` with your actual config:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

### 5. Test the App
1. The app should now work with full functionality
2. You can sign in with Google
3. Post items with images
4. View and claim items

## Security Rules (Optional)

### Firestore Rules
Go to Firestore Database > Rules and paste:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /items/{itemId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update: if request.auth != null;
    }
  }
}
```

### Storage Rules
Go to Storage > Rules and paste:
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /items/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## Troubleshooting

- **"Firebase not configured" errors**: Make sure you updated the config in `src/firebase.js`
- **Authentication errors**: Check that Google provider is enabled and localhost is in authorized domains
- **Storage errors**: Ensure Storage is enabled and rules are set to test mode
- **Firestore errors**: Make sure Firestore is created and rules are set to test mode

## Next Steps

After Firebase is configured:
1. Test all features (sign in, post items, upload images, claim items)
2. Deploy to Firebase Hosting for production use
3. Set up proper security rules for production
4. Consider adding admin features 