# Google Sign-In Setup Guide

This guide will help you enable Google Sign-In authentication in your Firebase project.

## Step 1: Enable Google Authentication in Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **student-scholarship-tracker**
3. Click on **Authentication** in the left sidebar
4. Click **Get Started** (if you haven't enabled Authentication yet)
5. Go to the **Sign-in method** tab
6. Click on **Google** from the list of providers
7. **Enable** the Google provider
8. Set the **Project support email** (this is required)
9. Click **Save**

## Step 2: Configure OAuth Consent Screen (if needed)

If you haven't set up OAuth consent screen before, you may need to:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project: **student-scholarship-tracker**
3. Navigate to **APIs & Services** > **OAuth consent screen**
4. Choose **External** (unless you have a Google Workspace account)
5. Fill in the required information:
   - App name: "Scholarship Tracker"
   - User support email: Your email
   - Developer contact information: Your email
6. Click **Save and Continue**
7. Add scopes (if needed):
   - `email`
   - `profile`
   - `openid`
8. Add test users (if in testing mode)
9. Complete the setup

## Step 3: Add Authorized Domains

1. In Firebase Console, go to **Authentication** > **Settings** > **Authorized domains**
2. Make sure your domain is listed:
   - `localhost` (for development)
   - Your production domain (if deployed)

## Step 4: Test Google Sign-In

1. Start your development server: `npm run dev`
2. Navigate to `/auth` page
3. Click the "Continue with Google" button
4. Select your Google account
5. Grant permissions if prompted
6. You should be redirected to the dashboard

## Features Implemented

✅ Google Sign-In button with Google icon
✅ Popup-based authentication (signInWithPopup)
✅ Automatic user profile creation/update in Firestore
✅ Error handling with user-friendly messages
✅ Loading states during authentication
✅ Redirect to dashboard on successful login
✅ Profile picture support in dashboard
✅ Works for both new and existing users

## Error Handling

The implementation handles common errors:
- **Popup closed by user**: "Sign-in popup was closed. Please try again."
- **Popup blocked**: "Popup was blocked by your browser. Please allow popups and try again."
- **Not configured**: Clear instructions to enable Google auth in Firebase Console
- **Network errors**: User-friendly network error messages

## User Profile Data

When a user signs in with Google, the following data is saved to Firestore:
- `uid`: User's unique ID
- `email`: User's email address
- `displayName`: User's full name
- `photoURL`: User's profile picture URL
- `createdAt`: Account creation timestamp (for new users)
- `updatedAt`: Last update timestamp

## Troubleshooting

### Error: "Google Sign-In is not configured"
- Make sure Google provider is enabled in Firebase Console
- Check that you've saved the configuration

### Error: "Popup was blocked"
- Allow popups for your domain in browser settings
- Try using a different browser

### Error: "OAuth consent screen not configured"
- Complete the OAuth consent screen setup in Google Cloud Console
- Make sure you've added test users if in testing mode

### Profile picture not showing
- Check that `photoURL` is being saved in Firestore
- Verify the image URL is accessible

## Security Notes

- Google Sign-In uses OAuth 2.0 for secure authentication
- User credentials are never stored in your app
- Firebase handles all authentication securely
- Profile data is stored in Firestore with proper security rules

