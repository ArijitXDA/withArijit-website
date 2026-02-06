# WithArijit.com - AI Education Platform

An interactive educational platform for AI certification courses, training sessions, and career development in Artificial Intelligence.

## 🚀 Features

### For Students
- **AI Certification Courses**: 7+ industry-specific AI certifications (Sales, Marketing, HR, Pharma/FMCG, Startups, CXO)
- **Student Dashboard**: Track enrolled courses, session links, certificates, and payment history
- **Learning Library**: Access course materials, resources, and learning content
- **AI Job Board**: Discover AI job opportunities through "AI Spots"
- **AI Readiness Quiz**: Assess your AI skills and get recommendations
- **Certificate Applications**: Request and download course completion certificates

### For Administrators
- **Session Management**: Create and manage training sessions
- **Student Management**: View enrollments and student progress
- **Certificate Management**: Issue and manage certificates
- **Library Management**: Upload and organize learning materials
- **Session Links Management**: Control access to training sessions
- **AI Spots Management**: Post and manage AI job listings
- **Analytics Dashboard**: Track job listing performance

### Payment Processing
- **Razorpay Integration**: Secure payment processing for course enrollments
- **Multi-Country Support**: Support for payments from India, USA, and international students
- **Payment History**: Complete transaction history for students
- **Automated Emails**: Payment confirmations and thank you emails

## 🛠️ Tech Stack

- **Frontend**: React 18.3.1 with TypeScript 5.5.4
- **Build Tool**: Vite 5.4.2
- **Routing**: React Router DOM 7.7.1
- **Styling**: Tailwind CSS 3.4.1 with PostCSS
- **Icons**: Lucide React 0.344.0
- **Database**: Supabase PostgreSQL
- **Authentication**: Supabase Auth
- **Payment**: Razorpay 2.9.6
- **Email**: Resend API (via Supabase Edge Functions)
- **Hosting**: Netlify (configured)

## 📋 Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager
- Supabase account and project
- Razorpay account (for payment processing)
- Resend account (for email notifications)

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ArijitXDA/withArijit-website.git
   cd withArijit-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

   Update `.env` with your actual credentials:
   ```env
   # Supabase Configuration
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

   # Razorpay Configuration
   VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_secret_key

   # Email Service
   RESEND_API_KEY=your_resend_api_key
   ```

4. **Set up Supabase**

   The project includes database migrations in `supabase/migrations/`. To apply them:

   ```bash
   # Install Supabase CLI
   npm install -g supabase

   # Link to your Supabase project
   supabase link --project-ref your-project-ref

   # Apply migrations
   supabase db push
   ```

5. **Deploy Supabase Edge Functions**

   ```bash
   # Deploy all edge functions
   supabase functions deploy create-razorpay-order
   supabase functions deploy payment-webhook
   supabase functions deploy send-payment-confirmation
   supabase functions deploy send-thank-you-email
   supabase functions deploy send-contact-notification
   supabase functions deploy repair-student-payments
   ```

   Set environment variables for edge functions in Supabase Dashboard:
   - `RAZORPAY_KEY_ID`
   - `RAZORPAY_KEY_SECRET`
   - `RESEND_API_KEY`

## 🚀 Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 🏗️ Build

Build the project for production:

```bash
npm run build
```

Build output will be in the `dist/` directory.

Preview the production build locally:

```bash
npm run preview
```

## 🧪 Linting

Run ESLint to check code quality:

```bash
npm run lint
```

## 📦 Deployment

### Netlify (Recommended)

This project is pre-configured for Netlify deployment via `netlify.toml`.

1. **Connect your GitHub repository to Netlify**
   - Log in to Netlify
   - Click "New site from Git"
   - Select your GitHub repository

2. **Configure environment variables in Netlify**
   - Go to Site settings > Build & deploy > Environment
   - Add the following variables:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`
     - `VITE_RAZORPAY_KEY_ID`

3. **Deploy**
   - Netlify will automatically build and deploy on push to main branch
   - Build command: `npm run build`
   - Publish directory: `dist`

### Other Platforms (Vercel, GitHub Pages, etc.)

The project can be deployed to any static hosting platform:

1. Build the project: `npm run build`
2. Deploy the `dist/` directory
3. Ensure environment variables are configured
4. Set up SPA routing (redirect all routes to `index.html`)

## 🔒 Security Notes

⚠️ **IMPORTANT SECURITY WARNINGS**:

1. **Never commit `.env` file** - It contains sensitive credentials
2. **Admin Credentials**: Currently hardcoded in `src/contexts/AdminAuthContext.tsx`
   - **Recommended**: Migrate to Supabase Auth with role-based access control
   - **Current**: username: "arijitwith", password: "reach500"
3. **Razorpay Keys**: Ensure proper webhook signature verification is enabled
4. **Supabase RLS**: Verify Row Level Security policies are properly configured

### Environment Variables Checklist

Before deploying to production:
- [ ] All `VITE_*` variables are set in deployment platform
- [ ] Supabase anon key is the correct one for your project
- [ ] Razorpay live keys are being used (not test keys)
- [ ] Resend API key is configured in Supabase Edge Functions
- [ ] Webhook URLs are updated in Razorpay dashboard
- [ ] CORS settings are configured in Supabase

## 📚 Project Structure

```
project/
├── public/                 # Static assets
│   ├── _redirects          # Netlify routing
│   └── contact-success.html
├── src/
│   ├── components/         # Reusable React components
│   │   ├── Layout.tsx
│   │   ├── PaymentModal.tsx
│   │   ├── AdminLogin.tsx
│   │   └── ...
│   ├── contexts/           # React Context providers
│   │   ├── AuthContext.tsx
│   │   └── AdminAuthContext.tsx
│   ├── lib/                # Utility libraries
│   │   └── supabase.ts     # Supabase client
│   ├── pages/              # Route pages (40+ pages)
│   │   ├── Home.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Courses.tsx
│   │   ├── Admin*.tsx      # Admin pages
│   │   ├── AICertification*.tsx  # Course pages
│   │   └── ...
│   ├── App.tsx             # Main app with routing
│   ├── main.tsx            # Entry point
│   └── index.css           # Global styles
├── supabase/
│   ├── functions/          # Edge Functions (Deno)
│   │   ├── create-razorpay-order/
│   │   ├── payment-webhook/
│   │   └── ...
│   └── migrations/         # Database migrations
├── .env.example            # Environment variables template
├── netlify.toml            # Netlify configuration
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── tailwind.config.js      # Tailwind CSS configuration
└── vite.config.ts          # Vite build configuration
```

## 🗄️ Database Schema

Main tables:
- `users` - User authentication and profiles
- `payments` - Payment records and transactions
- `session_master_table` - Training sessions
- `students` - Student enrollments
- `certificates` - Certificate issuance records
- `library_items` - Learning materials and resources
- `ai_spots` - AI job listings
- Various lookup and junction tables

See `supabase/migrations/` for complete schema definitions.

## 🎯 API Routes

### Supabase Edge Functions
- `POST /create-razorpay-order` - Create payment order
- `POST /payment-webhook` - Handle payment confirmations
- `POST /send-payment-confirmation` - Send payment emails
- `POST /send-thank-you-email` - Send thank you emails
- `POST /send-contact-notification` - Handle contact form submissions
- `POST /repair-student-payments` - Sync payment records

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

Copyright © 2025 WithArijit.com. All rights reserved.

## 📧 Support

For support, email: support@witharijit.com

## 🔗 Links

- **Website**: [https://witharijit.com](https://witharijit.com)
- **GitHub**: [https://github.com/ArijitXDA/withArijit-website](https://github.com/ArijitXDA/withArijit-website)
- **Supabase**: [https://supabase.com](https://supabase.com)
- **Razorpay**: [https://razorpay.com](https://razorpay.com)

## 🙏 Acknowledgments

Built with:
- React & Vite
- Supabase
- Tailwind CSS
- Razorpay
- Lucide Icons

---

**Note**: This project is under active development. Features and documentation may change.
