# Campus Lost & Found Board

A full-stack web application for managing lost and found items on a college campus. Built with React.js and Firebase.

## Features

- 🔍 **Search & Filter**: Find items by name, description, location, category, or status
- 📱 **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- 🔐 **Authentication**: Google Sign-In for secure posting and claiming
- 📸 **Image Upload**: Upload photos of lost/found items
- 📊 **Real-time Updates**: Live updates when items are posted or claimed
- 📱 **QR Code**: Quick access via QR code scanning
- 🎨 **Modern UI**: Beautiful interface built with Tailwind CSS

## Tech Stack

- **Frontend**: React.js, Vite, Tailwind CSS
- **Backend**: Firebase (Firestore, Storage, Auth, Hosting)
- **Icons**: Lucide React
- **QR Code**: qrcode.react

## Prerequisites

Before running this project, you need to have:

1. **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
2. **Firebase Account** - [Sign up here](https://firebase.google.com/)

## Setup Instructions

### 1. Install Node.js

Download and install Node.js from [nodejs.org](https://nodejs.org/)

### 2. Install Dependencies

```bash
npm install
```

### 3. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable the following services:
   - **Authentication** (Google Sign-In)
   - **Firestore Database**
   - **Storage**
   - **Hosting** (optional, for deployment)

4. Get your Firebase configuration:
   - Go to Project Settings
   - Scroll down to "Your apps"
   - Click the web icon (</>)
   - Register your app and copy the config

5. Update the Firebase configuration in `src/firebase.js`:
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

### 4. Firebase Security Rules

#### Firestore Rules
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

### 5. Run the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Project Structure

```
src/
├── components/
│   ├── ItemCard.jsx          # Individual item display card
│   ├── Navbar.jsx            # Navigation bar with auth
│   ├── PostForm.jsx          # Form for posting items
│   ├── QRCodeBox.jsx         # QR code component
│   └── SearchFilterBar.jsx   # Search and filter controls
├── pages/
│   ├── Home.jsx              # Landing page
│   ├── PostItem.jsx          # Post new item form
│   ├── ItemsBoard.jsx        # All items grid view
│   └── ItemDetails.jsx       # Individual item details
├── firebase.js               # Firebase configuration
├── App.jsx                   # Main app component
├── main.jsx                  # App entry point
└── index.css                 # Global styles
```

## Features in Detail

### 1. Home Page
- Welcome message and app description
- Quick action buttons (Post Lost/Found Item, View All Items)
- QR code for mobile access
- Statistics display
- Authentication status

### 2. Post Item Form
- Item details (name, description, category, location, date)
- Contact information (email, phone)
- Image upload with preview
- Status selection (Lost/Found)
- Form validation and error handling

### 3. Items Board
- Grid layout of all items
- Real-time updates
- Search functionality
- Category and status filters
- Responsive design

### 4. Item Details
- Complete item information
- Contact details with clickable links
- Claim functionality (authenticated users only)
- Image display
- Status indicators

### 5. Authentication
- Google Sign-In integration
- User profile display
- Protected routes and actions
- Automatic session management

## Deployment

🚀 **Quick Start**: The application is ready for deployment! Choose your preferred option:

### Option 1: GitHub Pages (Recommended)
1. Install Git: [Download here](https://git-scm.com/downloads)
2. Push to GitHub
3. Enable GitHub Pages with Actions
4. Automatic deployment on every push!

### Option 2: Firebase Hosting
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Build: `npm run build`
4. Deploy: `firebase deploy`

📖 **Complete Guide**: See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed instructions

### Features Ready for Production:
- ✅ Optimized build with code splitting
- ✅ GitHub Actions workflow configured
- ✅ Firebase integration ready
- ✅ Responsive design tested
- ✅ Production build: 7 chunks, ~650KB total

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

If you encounter any issues or have questions, please:

1. Check the Firebase documentation
2. Review the console for error messages
3. Ensure all dependencies are installed
4. Verify Firebase configuration is correct

## Future Enhancements

- [ ] Email notifications
- [ ] Admin panel for moderation
- [ ] Item categories management
- [ ] Advanced search filters
- [ ] Mobile app version
- [ ] Social media integration
- [ ] Analytics dashboard 