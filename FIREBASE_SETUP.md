# Firebase Setup Guide

This guide will help you set up Firebase for your scholarship tracker app.

## Step 1: Install Firebase

Run the following command to install Firebase:

```bash
npm install firebase
```

## Step 2: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Follow the setup wizard to create your project

## Step 3: Register Your Web App

1. In your Firebase project, click the web icon (`</>`) to add a web app
2. Register your app with a nickname
3. Copy the Firebase configuration object

## Step 4: Enable Firebase Services

### Authentication
1. Go to **Authentication** > **Get Started**
2. Enable the sign-in methods you want (Email/Password, Google, etc.)

### Firestore Database
1. Go to **Firestore Database** > **Create database**
2. Start in **test mode** (you can change rules later)
3. Choose a location for your database

### Storage
1. Go to **Storage** > **Get Started**
2. Start in **test mode** (you can change rules later)
3. Choose a location for your storage

## Step 5: Configure Environment Variables

1. Copy `env.example` to `.env.local`:
   ```bash
   cp env.example .env.local
   ```

2. Open `.env.local` and fill in your Firebase credentials:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your_actual_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

   You can find these values in:
   - Firebase Console > Project Settings > General > Your apps > Web app config

## Step 6: Usage

Import and use Firebase services in your components:

```typescript
// Authentication
import { auth } from '@/lib/firebase/config'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'

// Firestore
import { db } from '@/lib/firebase/config'
import { collection, addDoc, getDocs } from 'firebase/firestore'

// Storage
import { storage } from '@/lib/firebase/config'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
```

## Example: Using Authentication

```typescript
import { auth } from '@/lib/firebase/config'
import { signInWithEmailAndPassword } from 'firebase/auth'

const handleLogin = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    console.log('User logged in:', userCredential.user)
  } catch (error) {
    console.error('Login error:', error)
  }
}
```

## Example: Using Firestore

```typescript
import { db } from '@/lib/firebase/config'
import { collection, addDoc, getDocs } from 'firebase/firestore'

// Add a document
const addScholarship = async (data: any) => {
  try {
    const docRef = await addDoc(collection(db, 'scholarships'), data)
    console.log('Document written with ID:', docRef.id)
  } catch (error) {
    console.error('Error adding document:', error)
  }
}

// Get documents
const getScholarships = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'scholarships'))
    const scholarships = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    return scholarships
  } catch (error) {
    console.error('Error getting documents:', error)
  }
}
```

## Example: Using Storage

```typescript
import { storage } from '@/lib/firebase/config'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

const uploadFile = async (file: File, path: string) => {
  try {
    const storageRef = ref(storage, path)
    const snapshot = await uploadBytes(storageRef, file)
    const downloadURL = await getDownloadURL(snapshot.ref)
    return downloadURL
  } catch (error) {
    console.error('Error uploading file:', error)
  }
}
```

## Security Rules

Don't forget to set up proper security rules in Firebase Console:

- **Firestore**: Firestore Database > Rules
- **Storage**: Storage > Rules

## Important Notes

- Never commit `.env.local` to version control (it's already in `.gitignore`)
- All environment variables must start with `NEXT_PUBLIC_` to be accessible in the browser
- Restart your dev server after adding environment variables

