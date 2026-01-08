# Fix: Firebase Authentication Configuration Error

## Error: "auth/configuration-not-found"

This error means **Firebase Authentication is not enabled** in your Firebase Console.

## Quick Fix Steps:

### 1. Enable Firebase Authentication

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **student-scholarship-tracker**
3. Click on **Authentication** in the left sidebar
4. Click **Get Started** (if you haven't enabled it yet)
5. Go to the **Sign-in method** tab
6. Click on **Email/Password**
7. **Enable** the Email/Password provider
8. Click **Save**

### 2. Verify Your Configuration

Make sure your Firebase project settings match:
- **Project ID**: `student-scholarship-tracker`
- **Auth Domain**: `student-scholarship-tracker.firebaseapp.com`

### 3. Restart Your Dev Server

After enabling Authentication:
1. Stop your dev server (Ctrl+C)
2. Run: `npm run dev`
3. Try signing up again

## What I Fixed in the Code:

✅ Added client-side only initialization (prevents SSR errors)
✅ Better error messages for common authentication errors
✅ Proper error handling for configuration issues
✅ Validation of Firebase config before use

## Common Error Messages Now Handled:

- `auth/email-already-in-use` → "This email is already registered"
- `auth/weak-password` → "Password is too weak"
- `auth/invalid-email` → "Invalid email address"
- `auth/configuration-not-found` → Clear message to enable Auth in Console
- `auth/user-not-found` → "No account found with this email"
- `auth/wrong-password` → "Incorrect password"

After enabling Authentication in Firebase Console, the error should be resolved!

