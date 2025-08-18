# Deployment Guide - Campus Lost & Found App

This guide provides step-by-step instructions for deploying your Lost & Found application to GitHub Pages or Firebase Hosting.

## Prerequisites

1. **Git** - [Download and install Git](https://git-scm.com/downloads)
2. **GitHub Account** - [Sign up here](https://github.com)
3. **Firebase Account** - [Sign up here](https://firebase.google.com/) (if using Firebase Hosting)

## Option 1: Deploy to GitHub Pages (Recommended)

### Step 1: Install Git (if not already installed)
Download and install Git from [git-scm.com](https://git-scm.com/downloads)

### Step 2: Initialize Git Repository
```bash
# Navigate to your project directory
cd lost-found-app

# Initialize Git repository
git init

# Add all files
git add .

# Make initial commit
git commit -m "Initial commit - Lost & Found App"
```

### Step 3: Create GitHub Repository
1. Go to [GitHub.com](https://github.com)
2. Click "+" in the top right corner
3. Select "New repository"
4. Name your repository (e.g., "lost-found-app")
5. Make it public
6. **DO NOT** initialize with README, .gitignore, or license (we already have these)
7. Click "Create repository"

### Step 4: Connect Local Repository to GitHub
```bash
# Add GitHub remote (replace with your username and repo name)
git remote add origin https://github.com/YOUR_USERNAME/lost-found-app.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 5: Enable GitHub Pages
1. Go to your repository on GitHub
2. Click "Settings" tab
3. Scroll down to "Pages" section
4. Under "Source", select "GitHub Actions"
5. The deployment will start automatically

### Step 6: Access Your Live Site
Your site will be available at: `https://YOUR_USERNAME.github.io/lost-found-app`

## Option 2: Deploy to Firebase Hosting

### Step 1: Install Firebase CLI
```bash
npm install -g firebase-tools
```

### Step 2: Login to Firebase
```bash
firebase login
```

### Step 3: Initialize Firebase Hosting
```bash
# In your project directory
firebase init hosting
```

Select:
- Use an existing project (select your Firebase project)
- Public directory: `dist`
- Configure as SPA: `Yes`
- Set up automatic builds: `No` (we'll do this manually)
- File `dist/index.html` already exists. Overwrite? `No`

### Step 4: Build and Deploy
```bash
# Build the project
npm run build

# Deploy to Firebase Hosting
firebase deploy
```

### Step 5: Access Your Live Site
Your site will be available at: `https://YOUR_PROJECT_ID.web.app`

## Environment Variables (Important!)

The app is already configured with Firebase settings. For production use:

1. **Create your own Firebase project**
2. **Update `src/firebase.js`** with your Firebase configuration:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

## Firebase Setup (Required for Full Functionality)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use existing
3. Enable these services:
   - **Authentication** (Google Sign-In)
   - **Firestore Database**
   - **Storage**
   - **Hosting** (if using Firebase Hosting)

4. Set up Firestore Rules:
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

5. Set up Storage Rules:
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

### Common Issues:

1. **Build Fails**
   ```bash
   # Clear cache and reinstall
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```

2. **Firebase Not Configured**
   - Check `src/firebase.js` configuration
   - Ensure Firebase project services are enabled
   - Verify API keys and project IDs

3. **GitHub Pages Not Working**
   - Check repository is public
   - Verify GitHub Actions workflow is running
   - Check GitHub Actions tab for deployment status

4. **Authentication Issues**
   - Add your domain to Firebase Authentication authorized domains
   - For GitHub Pages: `your-username.github.io`
   - For Firebase Hosting: your Firebase Hosting domain

### Deployment Status:
- ✅ Build process optimized
- ✅ Production build tested
- ✅ GitHub Actions workflow configured
- ✅ Firebase configuration ready
- ✅ Responsive design implemented
- ✅ All dependencies resolved

## Next Steps After Deployment

1. **Test all functionality** on live site
2. **Set up Firebase Authentication** authorized domains
3. **Configure Firestore security rules**
4. **Test image upload functionality**
5. **Share the live URL** with users

## Support

If you encounter issues:
1. Check the browser console for errors
2. Verify Firebase configuration
3. Check GitHub Actions logs
4. Ensure all dependencies are installed correctly

---

**Live Demo**: (URL will be available after deployment)
**Repository**: (Your GitHub repository URL)
