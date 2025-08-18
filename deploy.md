# Deployment Guide

## Quick Setup Steps

### 1. Install Node.js
Download and install Node.js from [nodejs.org](https://nodejs.org/)

### 2. Install Dependencies
```bash
npm install
```

### 3. Firebase Setup

#### Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name (e.g., "campus-lost-found")
4. Follow the setup wizard

#### Enable Services
1. **Authentication**:
   - Go to Authentication > Sign-in method
   - Enable Google provider
   - Add your domain to authorized domains

2. **Firestore Database**:
   - Go to Firestore Database
   - Click "Create database"
   - Start in test mode (you can secure it later)

3. **Storage**:
   - Go to Storage
   - Click "Get started"
   - Start in test mode

#### Get Configuration
1. Go to Project Settings (gear icon)
2. Scroll to "Your apps"
3. Click web icon (</>)
4. Register app and copy config
5. Update `src/firebase.js` with your config

### 4. Set Security Rules

#### Firestore Rules
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

#### Storage Rules
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

### 5. Run Development Server
```bash
npm run dev
```

### 6. Deploy to Firebase Hosting

#### Install Firebase CLI
```bash
npm install -g firebase-tools
```

#### Login and Initialize
```bash
firebase login
firebase init hosting
# Select your project
# Use 'dist' as public directory
# Configure as single-page app: Yes
# Don't overwrite index.html: No
```

#### Build and Deploy
```bash
npm run build
firebase deploy
```

## Troubleshooting

### Common Issues

1. **"npm not recognized"**
   - Install Node.js from nodejs.org

2. **Firebase config errors**
   - Double-check your Firebase config in `src/firebase.js`
   - Ensure all services are enabled

3. **Authentication not working**
   - Check if Google provider is enabled
   - Verify authorized domains include localhost

4. **Image upload fails**
   - Check Storage rules
   - Ensure Storage is enabled

5. **Build errors**
   - Run `npm install` again
   - Check for missing dependencies

### Getting Help

1. Check browser console for errors
2. Verify Firebase console for service status
3. Review the README.md for detailed instructions
4. Check Firebase documentation

## Next Steps

After deployment:
1. Test all features thoroughly
2. Set up proper security rules
3. Configure custom domain (optional)
4. Set up monitoring and analytics
5. Consider adding admin features 