# 🕯️ Moshi Tragedy Investigation - E-book Platform

**Professional investigative journalism e-book platform** with Razorpay payment integration, permanent email-based access, and anti-piracy PDF reader.

## 📋 Table of Contents

- [Features](#features)
- [Quick Start](#quick-start)
- [Architecture](#architecture)
- [Configuration](#configuration)
- [Testing](#testing)
- [Deployment Checklist](#deployment-checklist)
- [TODO - Remaining Tasks](#todo---remaining-tasks)
- [Troubleshooting](#troubleshooting)

---

## ✨ Features

### 🎨 Landing Page
- ✅ **Dark Editorial Design** - ProPublica/The Ken inspired aesthetic
- ✅ **Bilingual Content** - English + Marathi (मोशी कचरा डेपो दुर्घटना)
- ✅ **Animated Statistics** - Count-up animations on scroll (70m, ₹76.57Cr, 9 lives, 927 societies)
- ✅ **Scroll Progress Indicator** - Gradient progress bar at top
- ✅ **Scroll-triggered Reveal Animations** - Cards fade in as you scroll
- ✅ **3D Tilt Effects** - Stat cards with mouse-follow perspective
- ✅ **Back to Top Button** - Appears after 500px scroll
- ✅ **4 Investigative Evidence Cards** - Bento grid layout
- ✅ **45-Chapter Explorer** - Collapsible accordion for 4 dossiers
- ✅ **Legal Accountability Section**
- ✅ **Smooth Scroll Behavior**

### 💳 Payment System
- ✅ **Razorpay Integration** - UPI, cards, net banking, wallets
- ✅ **₹50 One-time Payment**
- ✅ **Cryptographic Signature Verification**
- ✅ **Email Capture** - Automatic from Razorpay payment
- ✅ **Permanent Access Links** - Email-based, no database needed
- ✅ **Beautiful Receipt Email** - Professional HTML template with order details
- ✅ **Lifetime Access** - 10-year token validity
- ✅ **Multi-device Support** - Same email link works everywhere

### 📖 PDF Reader
- ✅ **Advanced Navigation** - Previous/Next, page jump, keyboard shortcuts
- ✅ **Zoom Controls** - 50% to 200%, fit width, fit page
- ✅ **Search Functionality** - Full-text search across all pages
- ✅ **Thumbnails Sidebar** - Visual page navigation (first 50 pages)
- ✅ **Fullscreen Mode** - F key or button
- ✅ **Loading Progress** - Visual feedback for page rendering
- ✅ **Reading Progress** - % completion tracker
- ✅ **Session Persistence** - Remembers last page and zoom level

### 🔒 Anti-Piracy & Security
- ✅ **DevTools Detection** - Warning overlay
- ✅ **Dynamic Watermarks** - Session ID + date stamped
- ✅ **Screenshot Detection** - Alerts on PrtScn, Cmd+Shift+3/4
- ✅ **Right-click Disabled**
- ✅ **Text Selection Blocked**
- ✅ **Print Shortcuts Intercepted**
- ✅ **Print CSS Protection** - Blanks page on print
- ✅ **Canvas Drag Prevention**
- ✅ **No Direct PDF Download**
- ✅ **Secure HttpOnly Cookies**
- ✅ **JWT Token Authentication**

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create `.env` file from the example:

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
# Razorpay API Keys
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret_here

# JWT Secret (minimum 32 characters)
JWT_SECRET=your_random_jwt_secret_minimum_32_characters

# Server Configuration
PORT=3001
NODE_ENV=development

# Base URL (update for production)
BASE_URL=http://localhost:3001
```

### 3. Add Your PDF

Place your e-book at:

```
./private/ebook.pdf
```

⚠️ **Must be in `private/` folder** to prevent direct access.

### 4. Run the Application

```bash
npm start
```

Visit: **http://localhost:3001**

### 5. Test Payment Flow

**Development Bypass:**
```
http://localhost:3001/api/test-access
```
Then go back to homepage - button turns green, click to access reader.

**Preview Email Template:**
```
http://localhost:3001/api/preview-email
```

---

## 🏗️ Architecture

### Project Structure

```
E-book/
├── server.js                 # Express server + Razorpay + JWT + Email
├── package.json              # Dependencies
├── .env                      # Environment variables (create from .env.example)
├── .env.example              # Example configuration
├── .gitignore                # Git ignore rules
├── README.md                 # This file
├── public/
│   └── index.html            # Landing page + PDF reader (SPA)
└── private/
    └── ebook.pdf             # Protected PDF file
```

### Payment & Access Flow

```
┌─────────────────────────────────────────────────────────────┐
│ 1. User visits landing page                                 │
│    └─> Clicks "Unlock Full Report (₹50)"                   │
└──────────────────────┬──────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. Razorpay Checkout opens                                  │
│    └─> User completes payment with email                   │
└──────────────────────┬──────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. Server verifies payment                                  │
│    ├─> Validates cryptographic signature                   │
│    ├─> Fetches customer email from Razorpay                │
│    ├─> Generates permanent access token (10-year)          │
│    ├─> Generates access link with token                    │
│    ├─> Sets session cookie (immediate access)              │
│    └─> Sends beautiful email with permanent link           │
└──────────────────────┬──────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. User receives email with access link                     │
│    Example: https://yoursite.com/access?token=xyz123...    │
└──────────────────────┬──────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. User clicks link (anytime, any device)                   │
│    ├─> Server validates token                              │
│    ├─> Sets new session cookie                             │
│    ├─> Redirects to homepage                               │
│    └─> Button turns green: "Access Your Book"              │
└──────────────────────┬──────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────────┐
│ 6. User clicks green button → PDF reader opens              │
│    └─> Full access with all features enabled               │
└─────────────────────────────────────────────────────────────┘
```

### API Endpoints

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/` | GET | No | Landing page |
| `/api/create-order` | POST | No | Creates Razorpay order (₹50) |
| `/api/verify-payment` | POST | No | Verifies payment, issues tokens, sends email |
| `/api/check-auth` | GET | Yes | Checks if user is authenticated |
| `/api/ebook` | GET | Yes | Streams protected PDF |
| `/api/logout` | POST | No | Clears session cookie |
| `/access?token=xyz` | GET | No | Validates permanent token, grants access |
| `/api/test-access` | GET | No | **DEV ONLY** - Bypass payment |
| `/api/preview-email` | GET | No | **DEV ONLY** - Preview email template |

---

## ⚙️ Configuration

### Change Price

Edit `server.js` (line ~198):

```javascript
amount: 5000, // ₹50 in paise (5000 = ₹50, 10000 = ₹100)
```

And update `public/index.html` - search for `₹50` and replace with new price.

### Change Token Expiry

**Session Token** (immediate access after payment):
Edit `server.js` (line ~266):
```javascript
{ expiresIn: '365d' } // 1 year session
```

**Permanent Token** (email link):
Edit `server.js` (line ~254):
```javascript
{ expiresIn: '10y' } // 10 years = effectively lifetime
```

### Customize Email Template

Edit the `generateAccessEmail()` function in `server.js` (starts at line ~27).

The email includes:
- Animated header with candle icon
- Success banner with green gradient
- Order details card
- Prominent access button
- Features grid
- Permanent access link

### Update Branding

Search and replace in `public/index.html`:
- **Title**: Search for "Moshi Tragedy Investigation"
- **Publisher**: "Ruvi Prakashan"
- **Author**: "Dr. Vijaykumar Vasantrao Patil"
- **Colors**: Tailwind classes (amber-500, crimson-500)

---

## 🧪 Testing

### Test Razorpay Payments

**Test Mode Credentials:**

| Payment Method | Test Data |
|---------------|-----------|
| **UPI** | `success@razorpay` |
| **Card** | `4111 1111 1111 1111` (any CVV/expiry) |
| **Net Banking** | Select any bank → "Success" |
| **Wallet** | Select any wallet → "Success" |

**Failed Payment Test:**
- Card: `4111 1111 1111 1112`
- UPI: `failure@razorpay`

### Test Access Flow

1. **Quick Access (No Payment):**
   ```
   http://localhost:3001/api/test-access
   ```
   Then visit homepage - button should be green.

2. **Email Template Preview:**
   ```
   http://localhost:3001/api/preview-email
   ```
   Click "ACCESS YOUR REPORT NOW" to test token validation.

3. **Logout & Re-access:**
   - Click logout in reader
   - Use email link again
   - Should regain access

### Test PDF Reader Features

- ✅ Navigation: Previous/Next buttons, arrow keys
- ✅ Zoom: +/- buttons, dropdown, fit options
- ✅ Search: Click search icon, type query
- ✅ Thumbnails: Click thumbnails icon (grid)
- ✅ Fullscreen: Click fullscreen icon or press F
- ✅ Page Jump: Type page number, press Enter

---

## 🚀 Deployment Checklist

### Before Going Live

- [ ] **Replace Test Razorpay Keys** with live keys from [Razorpay Dashboard](https://dashboard.razorpay.com/app/keys)
- [ ] **Update BASE_URL** in production environment to your domain
- [ ] **Set NODE_ENV=production**
- [ ] **Generate Strong JWT_SECRET** (64+ characters)
- [ ] **Remove Test Endpoints**:
  - [ ] Delete `/api/test-access` route
  - [ ] Delete `/api/preview-email` route
- [ ] **Configure Email Service** (see TODO below)
- [ ] **Test Full Payment Flow** with ₹1 live payment
- [ ] **Add SSL Certificate** (HTTPS required for production)
- [ ] **Set Up Domain** (update BASE_URL)
- [ ] **Test Email Delivery** from production
- [ ] **Add Monitoring** (error logging, uptime)
- [ ] **Backup PDF File**

### Deployment Platforms

**Recommended (Free Tier Available):**

1. **Vercel** (Easiest)
   - Auto-detects Node.js
   - Environment variables in dashboard
   - Free SSL included
   - `BASE_URL` auto-detected

2. **Railway** 
   - PostgreSQL support (if needed later)
   - Easy environment variables
   - Free tier: $5/month credit

3. **Render**
   - Free tier available
   - Background workers support
   - Auto SSL

4. **Heroku**
   - Mature platform
   - Easy deployments
   - Paid plans available

### Environment Variables for Production

```env
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_live_secret_here
JWT_SECRET=your_production_secret_64_chars_minimum
PORT=3001
NODE_ENV=production
BASE_URL=https://yourwebsite.com

# Email service (once configured)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your_app_password_here
```

---

## 📝 TODO - Remaining Tasks

### 🔴 CRITICAL (Must Do Before Launch)

1. **Configure Email Service**
   - [ ] Choose service: Nodemailer + Gmail, Resend, or Brevo
   - [ ] Get email credentials/API key
   - [ ] Add environment variables
   - [ ] Uncomment email sending code in `server.js` (line ~303)
   - [ ] Test email delivery
   - [ ] Test email on mobile/desktop clients
   - [ ] Verify links work in all email clients

2. **Replace Razorpay Keys**
   - [ ] Get live keys from Razorpay dashboard
   - [ ] Update `.env` with `rzp_live_` keys
   - [ ] Test ₹1 live payment
   - [ ] Verify webhook signature (if using webhooks)

3. **Update Branding**
   - [ ] Replace placeholder text with real content
   - [ ] Update publisher/author information
   - [ ] Customize colors if needed
   - [ ] Add real logo/favicon

4. **Security Hardening**
   - [ ] Generate strong production JWT_SECRET (64+ chars)
   - [ ] Remove test endpoints (`/api/test-access`, `/api/preview-email`)
   - [ ] Enable rate limiting on payment endpoints
   - [ ] Add CORS configuration
   - [ ] Review and test all anti-piracy measures

### 🟡 IMPORTANT (Should Do)

5. **Email Enhancements**
   - [ ] Add email footer with contact info
   - [ ] Include invoice/receipt number
   - [ ] Add GST details (if applicable)
   - [ ] Link to terms & conditions
   - [ ] Add unsubscribe link (if sending marketing emails)

6. **Analytics & Monitoring**
   - [ ] Add Google Analytics or similar
   - [ ] Set up error logging (Sentry, LogRocket)
   - [ ] Monitor payment success rate
   - [ ] Track PDF access patterns
   - [ ] Set up uptime monitoring

7. **User Experience**
   - [ ] Add loading states for all buttons
   - [ ] Improve error messages
   - [ ] Add FAQ section
   - [ ] Create contact/support page
   - [ ] Add testimonials (if available)

8. **SEO & Marketing**
   - [ ] Add meta tags for social sharing
   - [ ] Create Open Graph images
   - [ ] Submit sitemap to Google
   - [ ] Optimize for mobile
   - [ ] Test page speed

### 🟢 OPTIONAL (Nice to Have)

9. **Advanced Features**
   - [ ] Add payment history (requires database)
   - [ ] Implement referral codes/discounts
   - [ ] Add download receipt button
   - [ ] Create admin dashboard
   - [ ] Implement webhook for real-time updates
   - [ ] Add PDF annotations/bookmarks
   - [ ] Multi-language support

10. **Performance Optimization**
    - [ ] Implement CDN for static assets
    - [ ] Add response caching
    - [ ] Optimize PDF loading (lazy load pages)
    - [ ] Compress images and assets
    - [ ] Implement service worker for offline support

11. **Legal Compliance**
    - [ ] Add Terms & Conditions page
    - [ ] Create Privacy Policy
    - [ ] Add Cookie Consent banner
    - [ ] Implement data deletion requests
    - [ ] Add refund policy

---

## 🐛 Troubleshooting

### Payment Issues

**"Order creation failed"**
- Check Razorpay API keys in `.env`
- Verify keys start with `rzp_test_` or `rzp_live_`
- Check server console for detailed error

**"Payment verification failed"**
- JWT_SECRET must be set and consistent
- Check signature verification logic
- Review Razorpay webhook logs

**Email not received**
- Email service not configured yet (see TODO #1)
- Check spam folder
- Verify email address in payment
- Check server logs for email errors

### Access Issues

**"Access Denied" when clicking email link**
- Token may have expired (check expiry settings)
- JWT_SECRET mismatch between token creation and verification
- Check server logs for specific error

**Button stays amber/orange after payment**
- Clear browser cookies and try again
- Check if `/api/check-auth` returns 200
- Verify cookie is being set correctly

**PDF won't load**
- Check `private/ebook.pdf` exists
- Verify PDF is not corrupted
- Check browser console for errors
- Ensure PDF.js CDN is accessible

### Reader Issues

**Search not working**
- Check browser console for errors
- Verify PDF has text layer (not scanned images)
- Try smaller search queries

**Thumbnails not generating**
- Limited to first 50 pages for performance
- Check browser console for errors
- Large PDFs may take longer to generate

**Fullscreen not working**
- Browser may block fullscreen on HTTP
- Use HTTPS in production
- Check browser permissions

### Development Issues

**Port already in use**
- Change PORT in `.env`
- Or kill process: `npx kill-port 3001`

**Cannot read properties of undefined**
- Check all environment variables are set
- Verify `.env` file exists and is loaded
- Restart server after changing `.env`

---

## 📚 Dependencies

### Backend
- `express` - Web server
- `razorpay` - Payment gateway SDK
- `jsonwebtoken` - JWT authentication
- `cookie-parser` - Cookie handling
- `dotenv` - Environment configuration
- `crypto` - Signature verification (built-in)

### Frontend (CDN)
- Razorpay Checkout SDK
- PDF.js (PDF rendering)
- Tailwind CSS (styling)

---

## 📄 License

ISC

---

## 🆘 Support

For issues or questions:
1. Check this README thoroughly
2. Review server console logs
3. Check browser console for errors
4. Test with `/api/test-access` endpoint
5. Preview email with `/api/preview-email`

---

## 🎉 Current Status

**✅ Fully Functional:**
- Landing page with all UX animations
- Payment integration (test mode)
- PDF reader with all features
- Anti-piracy measures
- Email template (ready to send)
- Permanent access system

**⏳ Needs Configuration:**
- Email service setup (choose provider)
- Live Razorpay keys (for production)
- Production deployment
- Domain and SSL certificate

**Ready for testing and deployment once email service is configured!**

---

**Last Updated:** January 2025
**Version:** 1.0.0
