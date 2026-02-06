# Payment Setup Instructions

## Setting up Razorpay for Live Payments

### 1. Get Razorpay Account
- Sign up at [Razorpay](https://razorpay.com/)
- Complete KYC verification for live payments
- Get your business account approved

### 2. Get API Keys
- Login to [Razorpay Dashboard](https://dashboard.razorpay.com/)
- Go to **Settings** → **API Keys**
- Generate **Live Keys** (for production)
- Copy the **Key ID** (starts with `rzp_live_`)

### 3. Configure Environment
- Copy `.env.example` to `.env`
- Add your Razorpay Key ID:
  ```
  VITE_RAZORPAY_KEY_ID=rzp_live_your_actual_key_here
  ```

### 4. Test Payment Flow
- Use small amounts for testing
- Verify webhook notifications
- Check payment confirmations

### 5. Security Checklist
- ✅ Never commit `.env` to git
- ✅ Use HTTPS in production
- ✅ Verify payment signatures
- ✅ Set up proper webhooks
- ✅ Monitor transactions

### 6. Webhook Setup (Recommended)
- Go to Razorpay Dashboard → Webhooks
- Add webhook URL: `your-domain.com/api/webhooks/razorpay`
- Select events: `payment.captured`, `payment.failed`
- Add webhook secret to environment

### 7. Production Deployment
- Deploy to secure hosting (Vercel/Netlify)
- Add environment variables in hosting platform
- Test with real small payments
- Monitor error logs

## Support
If you need help with setup, contact: AI@withArijit.com