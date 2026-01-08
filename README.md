# Scholarship Tracker App

A comprehensive Next.js application for tracking and discovering scholarships in India. This app helps students find government and private scholarships, track their applications, and get personalized scholarship recommendations based on their profile.

## Features

- 🔐 **User Authentication** - Secure login/signup with Firebase Authentication
- 📊 **Dashboard** - Personalized dashboard with statistics and quick actions
- 🎓 **Scholarship Discovery** - Browse 10+ scholarship portals (Central, State, Private)
- 📝 **Application Tracker** - Track your scholarship applications with status updates
- 🤖 **AI Chatbot** - Get instant answers about scholarships using OpenAI integration
- ⭐ **Smart Recommendations** - Get personalized scholarship suggestions based on:
  - Academic marks/percentage
  - State of residence
  - Category (SC/ST/OBC/General)
  - Family income
  - Gender and class level
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices
- 🌙 **Dark Mode** - Built-in dark mode support

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI
- **Authentication**: Firebase Auth
- **Database**: Firebase Firestore
- **Storage**: Firebase Storage
- **AI Integration**: OpenAI API
- **Email**: SendGrid API

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Firebase project set up
- OpenAI API key (optional, for chatbot)
- SendGrid API key (optional, for emails)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd scholarship-tracker-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory:
```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# SendGrid (Optional)
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=your_email@example.com
SENDGRID_FROM_NAME=Scholarship Tracker

# OpenAI (Optional)
OPENAI_API_KEY=your_openai_api_key
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
scholarship-tracker-app/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── auth/              # Authentication page
│   ├── dashboard/          # User dashboard
│   ├── profile/            # User profile management
│   ├── tracker/            # Application tracker
│   └── scholarships/       # Scholarship browsing
├── components/             # React components
│   ├── chatbot/           # AI chatbot component
│   ├── layout/            # Layout components
│   ├── profile/           # Profile form components
│   ├── tracker/           # Tracker components
│   └── ui/                # Shadcn UI components
├── lib/                    # Utility libraries
│   ├── firebase/          # Firebase configuration
│   └── scholarship-helper.ts  # Scholarship matching logic
└── public/                 # Static assets
```

## Key Features Explained

### Smart Scholarship Matching
The app analyzes student profiles to suggest eligible scholarships:
- Checks minimum percentage requirements
- Validates family income limits
- Matches state-specific scholarships
- Considers category (SC/ST/OBC/General)
- Filters by gender requirements (for specific schemes)

### Application Tracker
- Save and track multiple scholarship applications
- Monitor application status (Applied, Under Review, Accepted, Rejected)
- Set deadlines and reminders
- View statistics and success rates

### AI-Powered Chatbot
- Ask questions about scholarships
- Get direct links to application portals
- Receive personalized recommendations
- Supports multilingual queries

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Support

For issues and questions, please open an issue on GitHub.

---

Made with ❤️ for Indian students
