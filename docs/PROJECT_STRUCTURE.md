# Project Structure

This document describes the organization of the Scholarship Tracker App codebase.

## Directory Structure

```
scholarship-tracker-app/
├── app/                      # Next.js App Router pages and routes
│   ├── api/                  # API routes
│   │   ├── chatbot/          # Chatbot API endpoint
│   │   └── send-welcome-email/ # Email sending API endpoint
│   ├── about/                # About page
│   ├── auth/                 # Authentication page
│   ├── by-state/             # Scholarships by state page
│   ├── dashboard/            # User dashboard
│   ├── profile/              # User profile page
│   ├── scholarships/         # Scholarships listing page
│   ├── status/               # Application status page
│   ├── terms/                # Terms of service page
│   ├── privacy/              # Privacy policy page
│   ├── tracker/              # Application tracker page
│   ├── layout.tsx            # Root layout component
│   ├── page.tsx              # Home page
│   ├── globals.css           # Global styles
│   └── loading.tsx           # Loading component
│
├── components/               # React components
│   ├── chatbot/              # Chatbot component
│   ├── layout/               # Layout components (header, footer)
│   ├── notices/              # Notice components
│   ├── profile/              # Profile form components
│   ├── scholarships/         # Scholarship-related components
│   ├── states/               # State selector component
│   ├── tracker/              # Tracker components
│   ├── ui/                   # Shadcn UI components
│   └── theme-provider.tsx    # Theme provider component
│
├── lib/                      # Utility libraries and helpers
│   ├── firebase/             # Firebase configuration and functions
│   │   ├── auth.ts           # Authentication functions
│   │   ├── config.ts         # Firebase configuration
│   │   ├── profile.ts        # Profile data types and functions
│   │   └── storage.ts        # Firebase storage functions
│   ├── storage/               # Local storage utilities
│   │   └── profile-storage.ts # Profile storage in localStorage
│   ├── individual-scholarships.ts # Individual scholarship data
│   ├── scholarship-data.ts   # Scholarship portal data
│   ├── scholarship-helper.ts # Scholarship matching and filtering logic
│   ├── sendgrid.ts           # SendGrid email service
│   ├── states-data.ts        # Indian states data
│   ├── tracker-data.ts       # Tracker data utilities
│   └── utils.ts              # General utility functions
│
├── hooks/                    # Custom React hooks
│   ├── use-mobile.ts         # Mobile detection hook
│   └── use-toast.ts          # Toast notification hook
│
├── public/                   # Static assets
│   ├── icons/                # App icons
│   └── images/               # Images and placeholders
│
├── docs/                     # Documentation
│   ├── FIREBASE_AUTH_FIX.md  # Firebase authentication setup guide
│   ├── FIREBASE_SETUP.md     # Firebase configuration guide
│   ├── GITHUB_UPLOAD.md      # GitHub upload instructions
│   ├── GOOGLE_AUTH_SETUP.md  # Google authentication setup
│   └── PROJECT_STRUCTURE.md  # This file
│
├── .gitignore               # Git ignore rules
├── components.json          # Shadcn UI configuration
├── env.example              # Environment variables template
├── next.config.mjs          # Next.js configuration
├── package.json             # Dependencies and scripts
├── package-lock.json        # npm lock file
├── postcss.config.mjs       # PostCSS configuration
├── README.md                # Project README
└── tsconfig.json            # TypeScript configuration
```

## Key Files

### Configuration Files
- `package.json` - Project dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `next.config.mjs` - Next.js configuration
- `components.json` - Shadcn UI component configuration
- `env.example` - Template for environment variables

### Core Application Files
- `app/layout.tsx` - Root layout with global styles
- `app/page.tsx` - Home page
- `app/dashboard/page.tsx` - Main dashboard with chatbot and recommendations
- `app/auth/page.tsx` - Authentication page

### API Routes
- `app/api/chatbot/route.ts` - Chatbot API endpoint (OpenAI integration)
- `app/api/send-welcome-email/route.ts` - Welcome email API endpoint

### Key Libraries
- `lib/firebase/` - Firebase authentication and Firestore operations
- `lib/scholarship-helper.ts` - Core scholarship matching algorithm
- `lib/scholarship-data.ts` - Scholarship portal data
- `lib/individual-scholarships.ts` - Individual scholarship schemes data

### Components
- `components/chatbot/chatbot.tsx` - AI-powered chatbot component
- `components/layout/` - Header and footer components
- `components/profile/` - Multi-step profile form components
- `components/ui/` - Reusable UI components (Shadcn)

## Environment Variables

Required environment variables (see `env.example`):
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `SENDGRID_API_KEY`
- `SENDGRID_FROM_EMAIL`
- `SENDGRID_FROM_NAME`
- `OPENAI_API_KEY`

## Notes

- All documentation files are organized in the `docs/` folder
- Test files and backup files have been removed
- Only one package manager lock file is kept (`package-lock.json` for npm)
- Global styles are in `app/globals.css` (not in a separate styles folder)
