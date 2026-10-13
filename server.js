require('dotenv').config();
const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ============================================
// EMAIL TEMPLATE FUNCTION
// ============================================
function generateAccessEmail(emailData) {
  const { to, paymentId, orderId, amount, accessLink, timestamp } = emailData;
  const date = new Date(timestamp).toLocaleString('en-IN', { 
    dateStyle: 'long', 
    timeStyle: 'short',
    timeZone: 'Asia/Kolkata' 
  });
  
  return {
    to: to,
    subject: '✅ Your Moshi Tragedy Investigation Report - Lifetime Access',
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      margin: 0; 
      padding: 0; 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 40px 20px;
    }
    .email-wrapper { 
      max-width: 600px; 
      margin: 0 auto; 
      background: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    }
    .header { 
      background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
      padding: 50px 40px;
      text-align: center;
      position: relative;
      overflow: hidden;
    }
    .header::before {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle, rgba(245, 158, 11, 0.1) 0%, transparent 70%);
      animation: pulse 4s ease-in-out infinite;
    }
    @keyframes pulse {
      0%, 100% { transform: scale(1); opacity: 0.5; }
      50% { transform: scale(1.1); opacity: 0.8; }
    }
    .candle-icon {
      font-size: 48px;
      margin-bottom: 20px;
      display: block;
      filter: drop-shadow(0 0 20px rgba(245, 158, 11, 0.5));
      position: relative;
      z-index: 1;
    }
    .header h1 { 
      color: #F59E0B;
      margin: 0;
      font-size: 28px;
      font-weight: 900;
      letter-spacing: -0.5px;
      text-shadow: 0 2px 10px rgba(245, 158, 11, 0.3);
      position: relative;
      z-index: 1;
    }
    .header p {
      color: rgba(255, 255, 255, 0.8);
      margin: 10px 0 0 0;
      font-size: 14px;
      font-weight: 500;
      letter-spacing: 1px;
      text-transform: uppercase;
      position: relative;
      z-index: 1;
    }
    .success-banner {
      background: linear-gradient(135deg, #10B981 0%, #059669 100%);
      padding: 30px 40px;
      text-align: center;
      color: white;
      border-bottom: 4px solid #047857;
    }
    .success-icon {
      font-size: 60px;
      margin-bottom: 10px;
      display: block;
      animation: scaleIn 0.5s ease-out;
    }
    @keyframes scaleIn {
      0% { transform: scale(0); }
      50% { transform: scale(1.1); }
      100% { transform: scale(1); }
    }
    .success-banner h2 {
      margin: 0;
      font-size: 24px;
      font-weight: 800;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }
    .content { 
      padding: 40px;
      background: #ffffff;
    }
    .greeting {
      font-size: 18px;
      color: #1a1a1a;
      margin-bottom: 20px;
      font-weight: 600;
    }
    .message {
      line-height: 1.8;
      color: #4a5568;
      margin-bottom: 30px;
      font-size: 15px;
    }
    .message strong {
      color: #10B981;
      font-weight: 700;
    }
    .cta-button {
      display: block;
      background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);
      color: #1a1a1a;
      text-align: center;
      padding: 20px 40px;
      border-radius: 12px;
      text-decoration: none;
      font-weight: 800;
      font-size: 18px;
      margin: 40px 0;
      box-shadow: 0 10px 30px rgba(245, 158, 11, 0.4);
      transition: all 0.3s ease;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .important-box {
      background: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%);
      border-left: 4px solid #F59E0B;
      border-radius: 8px;
      padding: 20px;
      margin: 30px 0;
    }
    .important-box strong {
      color: #92400E;
      font-size: 16px;
      display: block;
      margin-bottom: 10px;
    }
    .important-box p {
      color: #78350F;
      margin: 0;
      line-height: 1.6;
      font-size: 14px;
    }
    .details-card {
      background: linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 100%);
      border: 2px solid #E5E7EB;
      border-radius: 12px;
      padding: 30px;
      margin: 30px 0;
    }
    .details-card h3 {
      color: #1a1a1a;
      margin: 0 0 20px 0;
      font-size: 18px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .detail-row {
      display: flex;
      justify-content: space-between;
      padding: 12px 0;
      border-bottom: 1px dashed #D1D5DB;
    }
    .detail-row:last-child {
      border-bottom: none;
    }
    .detail-label {
      color: #6B7280;
      font-size: 14px;
      font-weight: 600;
    }
    .detail-value {
      color: #1a1a1a;
      font-weight: 700;
      font-size: 14px;
      text-align: right;
    }
    .access-link-box {
      background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
      border: 2px solid #F59E0B;
      border-radius: 12px;
      padding: 25px;
      margin: 30px 0;
      text-align: center;
    }
    .access-link-box h3 {
      color: #F59E0B;
      margin: 0 0 15px 0;
      font-size: 16px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .access-link {
      background: rgba(245, 158, 11, 0.1);
      border: 1px solid rgba(245, 158, 11, 0.3);
      border-radius: 8px;
      padding: 15px;
      word-break: break-all;
      font-size: 11px;
      color: #F59E0B;
      font-family: 'Courier New', monospace;
      line-height: 1.6;
    }
    .features-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 15px;
      margin: 30px 0;
    }
    .feature-item {
      background: linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%);
      border: 2px solid #10B981;
      border-radius: 10px;
      padding: 20px;
      text-align: center;
    }
    .feature-icon {
      font-size: 32px;
      margin-bottom: 10px;
      display: block;
    }
    .feature-text {
      color: #065F46;
      font-size: 13px;
      font-weight: 700;
      line-height: 1.4;
    }
    .divider {
      height: 2px;
      background: linear-gradient(90deg, transparent 0%, #E5E7EB 50%, transparent 100%);
      margin: 40px 0;
    }
    .footer {
      background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
      padding: 40px;
      text-align: center;
      color: rgba(255, 255, 255, 0.6);
    }
    .footer-logo {
      font-size: 32px;
      margin-bottom: 15px;
      display: block;
    }
    .footer p {
      margin: 8px 0;
      font-size: 13px;
      line-height: 1.6;
    }
    .footer-highlight {
      color: #F59E0B;
      font-weight: 700;
    }
    .social-links {
      margin: 20px 0;
      padding: 20px 0;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    @media only screen and (max-width: 600px) {
      body { padding: 20px 10px; }
      .email-wrapper { border-radius: 12px; }
      .header, .content, .footer { padding: 30px 20px; }
      .header h1 { font-size: 24px; }
      .success-banner h2 { font-size: 20px; }
      .cta-button { font-size: 16px; padding: 18px 30px; }
      .features-grid { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <!-- Header -->
    <div class="header">
      <span class="candle-icon">🕯️</span>
      <h1>Moshi Tragedy Investigation</h1>
      <p>45-Chapter Forensic Dossier</p>
    </div>
    
    <!-- Success Banner -->
    <div class="success-banner">
      <span class="success-icon">✅</span>
      <h2>Payment Successful!</h2>
    </div>
    
    <!-- Main Content -->
    <div class="content">
      <div class="greeting">Dear Reader,</div>
      
      <div class="message">
        Thank you for your purchase! Your payment has been successfully processed, and you now have <strong>lifetime access</strong> to the complete 45-chapter investigative dossier on the Moshi Garbage Depot Tragedy.
      </div>
      
      <a href="${accessLink}" class="cta-button">
        📖 Access Your Report Now
      </a>
      
      <div class="important-box">
        <strong>🔐 Important - Save This Email!</strong>
        <p>This email contains your permanent access link. You can use it anytime from any device to access your report. We recommend bookmarking the link or saving this email for future reference.</p>
      </div>
      
      <!-- Order Details -->
      <div class="details-card">
        <h3>📋 Order Summary</h3>
        <div class="detail-row">
          <span class="detail-label">Order ID</span>
          <span class="detail-value">${orderId}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Payment ID</span>
          <span class="detail-value">${paymentId}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Amount Paid</span>
          <span class="detail-value">₹${amount}.00</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Date & Time</span>
          <span class="detail-value">${date}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Access Type</span>
          <span class="detail-value" style="color: #10B981;">● Lifetime</span>
        </div>
      </div>
      
      <!-- Access Link -->
      <div class="access-link-box">
        <h3>🔗 Your Permanent Access Link</h3>
        <div class="access-link">${accessLink}</div>
      </div>
      
      <div class="divider"></div>
      
      <!-- Features Grid -->
      <div class="features-grid">
        <div class="feature-item">
          <span class="feature-icon">📄</span>
          <div class="feature-text">45 Chapters<br/>Complete Dossier</div>
        </div>
        <div class="feature-item">
          <span class="feature-icon">🔍</span>
          <div class="feature-text">Search & Navigate<br/>Full Features</div>
        </div>
        <div class="feature-item">
          <span class="feature-icon">📱</span>
          <div class="feature-text">Multi-Device<br/>Access Anywhere</div>
        </div>
        <div class="feature-item">
          <span class="feature-icon">🔒</span>
          <div class="feature-text">Secure Reader<br/>Protected Content</div>
        </div>
      </div>
      
      <div class="message" style="margin-top: 40px; color: #6B7280; font-size: 13px;">
        If you have any questions or need assistance accessing your report, please reply to this email or contact our support team. We're here to help!
      </div>
    </div>
    
    <!-- Footer -->
    <div class="footer">
      <div class="footer-logo">📚</div>
      <p><span class="footer-highlight">Ruvi Prakashan</span></p>
      <p>Bijlinagar, Chinchwad, Pune - 411033</p>
      
      <div class="social-links">
        <p style="color: rgba(255, 255, 255, 0.4); font-size: 11px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px;">In Memory of the 9 Lives Lost</p>
        <p style="color: #F59E0B; font-size: 12px; margin: 0;">This investigation demands accountability</p>
      </div>
      
      <p style="margin-top: 20px;">© ${new Date().getFullYear()} Dr. Vijaykumar Vasantrao Patil</p>
      <p style="font-size: 11px; color: rgba(255, 255, 255, 0.4);">All Rights Reserved</p>
      <p style="font-size: 11px; color: rgba(255, 255, 255, 0.3); margin-top: 20px;">This is an automated receipt. Please do not reply.</p>
    </div>
  </div>
</body>
</html>
    `,
    text: `
Moshi Tragedy Investigation - Payment Receipt

✅ Payment Successful!

Thank you for your purchase. You now have lifetime access to the complete 45-chapter investigative dossier.

Your Permanent Access Link:
${accessLink}

Order Details:
- Order ID: ${orderId}
- Payment ID: ${paymentId}
- Amount: ₹${amount}
- Date: ${date}
- Access: Lifetime

📌 IMPORTANT: Bookmark this email or save the link above. You can access your report anytime from any device by clicking this link.

What's Included:
✓ Complete 45-chapter investigative dossier
✓ Forensic evidence documentation
✓ Legal proceedings analysis
✓ Protected PDF viewer
✓ Search and navigation features
✓ Multi-device access

---
Published by Ruvi Prakashan, Pune
© ${new Date().getFullYear()} Dr. Vijaykumar Vasantrao Patil
    `.trim()
  };
}

// ============================================
// ROUTES
// ============================================

// Verify JWT token middleware
const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  
  if (!token) {
    return res.status(401).json({ error: 'Access denied. Payment required.' });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
};

// Route: Create Razorpay order
app.post('/api/create-order', async (req, res) => {
  try {
    const options = {
      amount: 5000, // ₹50 in paise (50 * 100)
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      notes: {
        product: 'E-book Access',
      },
    };

    const order = await razorpay.orders.create(options);
    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Route: Verify payment and issue token
app.post('/api/verify-payment', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Verify signature
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ error: 'Invalid payment signature' });
    }

    // Fetch payment details from Razorpay to get customer email
    let customerEmail = null;
    try {
      const payment = await razorpay.payments.fetch(razorpay_payment_id);
      customerEmail = payment.email;
      console.log('✅ Payment verified for:', customerEmail);
    } catch (error) {
      console.error('Error fetching payment details:', error);
    }

    // Generate permanent access token (tied to payment ID + email)
    const permanentToken = jwt.sign(
      {
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        email: customerEmail,
        timestamp: Date.now(),
        type: 'permanent_access'
      },
      process.env.JWT_SECRET,
      { expiresIn: '10y' } // 10 years (effectively lifetime)
    );

    // Create session token for immediate access (1 year)
    const sessionToken = jwt.sign(
      {
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        timestamp: Date.now(),
      },
      process.env.JWT_SECRET,
      { expiresIn: '365d' }
    );

    // Set session cookie for immediate access
    res.cookie('access_token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
    });

    // Generate permanent access link
    const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
    const accessLink = `${baseUrl}/access?token=${permanentToken}`;
    
    // TODO: Send email with access link
    const emailTemplate = generateAccessEmail(emailData);
    
    console.log('\n📧 ===== EMAIL READY TO SEND =====');
    console.log('To:', emailTemplate.to);
    console.log('Subject:', emailTemplate.subject);
    console.log('\nText Version:');
    console.log(emailTemplate.text);
    console.log('\n✉️ HTML email template generated (view in browser)');
    console.log('===================================\n');
    
    // When email service is configured, uncomment:
    // await sendEmail(emailTemplate);

    res.json({
      success: true,
      message: 'Payment verified successfully',
      // For testing - remove in production:
      debug: {
        email: customerEmail,
        accessLink: accessLink,
        emailPreview: 'Check server console for email content'
      }
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ error: 'Payment verification failed' });
  }
});

// Route: Check authentication status
app.get('/api/check-auth', verifyToken, (req, res) => {
  res.json({ authenticated: true });
});

// Route: Access via permanent link (from email)
app.get('/access', (req, res) => {
  const { token } = req.query;
  
  console.log('📥 Access attempt with token:', token ? `${token.substring(0, 20)}...` : 'MISSING');
  
  if (!token) {
    console.error('❌ No token provided');
    return res.status(400).send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invalid Access Link</title>
        <style>
          body { font-family: Arial; text-align: center; padding: 50px; background: #0B0F17; color: white; }
          .error { color: #EF4444; font-size: 24px; margin-bottom: 20px; }
        </style>
      </head>
      <body>
        <div class="error">⚠️ Invalid Access Link</div>
        <p>The link you clicked is invalid or expired.</p>
        <p>Please check your email for the correct link or contact support.</p>
      </body>
      </html>
    `);
  }
  
  try {
    // Verify the permanent token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    console.log('✅ Token decoded:', {
      type: decoded.type,
      email: decoded.email,
      paymentId: decoded.paymentId
    });
    
    if (decoded.type !== 'permanent_access') {
      console.error('❌ Invalid token type:', decoded.type);
      throw new Error('Invalid token type');
    }
    
    console.log('✅ Valid access link used:', decoded.email);
    
    // Create a new session token
    const sessionToken = jwt.sign(
      {
        paymentId: decoded.paymentId,
        orderId: decoded.orderId,
        email: decoded.email,
        timestamp: Date.now(),
      },
      process.env.JWT_SECRET,
      { expiresIn: '365d' }
    );
    
    // Set session cookie
    res.cookie('access_token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 365 * 24 * 60 * 60 * 1000,
    });
    
    // Redirect to homepage with success message
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Access Granted</title>
        <meta http-equiv="refresh" content="2;url=/">
        <style>
          body { font-family: Arial; text-align: center; padding: 50px; background: #0B0F17; color: white; }
          .success { color: #10B981; font-size: 24px; margin-bottom: 20px; }
          .loader { border: 4px solid #333; border-top: 4px solid #F59E0B; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 20px auto; }
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        </style>
      </head>
      <body>
        <div class="success">✅ Access Granted!</div>
        <p>Welcome back! Opening your report...</p>
        <div class="loader"></div>
        <p style="color: #666; font-size: 12px;">Redirecting in 2 seconds...</p>
      </body>
      </html>
    `);
    
  } catch (error) {
    console.error('Token verification failed:', error.message);
    res.status(401).send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Access Denied</title>
        <style>
          body { font-family: Arial; text-align: center; padding: 50px; background: #0B0F17; color: white; }
          .error { color: #EF4444; font-size: 24px; margin-bottom: 20px; }
        </style>
      </head>
      <body>
        <div class="error">🔒 Access Denied</div>
        <p>This access link has expired or is invalid.</p>
        <p>Please check your email for a valid link or contact support.</p>
        <br>
        <a href="/" style="color: #F59E0B; text-decoration: none;">← Back to Home</a>
      </body>
      </html>
    `);
  }
});

// TEST BYPASS ROUTE - Remove this in production!
app.get('/api/test-access', (req, res) => {
  // Create a test token
  const token = jwt.sign(
    {
      paymentId: 'test_payment',
      orderId: 'test_order',
      timestamp: Date.now(),
    },
    process.env.JWT_SECRET,
    { expiresIn: '48h' }
  );

  // Set HttpOnly cookie
  res.cookie('access_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 48 * 60 * 60 * 1000,
  });

  res.json({
    success: true,
    message: 'Test access granted! Reload the page to view the PDF.',
  });
});

// Route: Stream PDF (protected)
app.get('/api/ebook', verifyToken, (req, res) => {
  const pdfPath = path.join(__dirname, 'private', 'ebook.pdf');

  // Check if file exists
  if (!fs.existsSync(pdfPath)) {
    return res.status(404).json({ error: 'E-book not found' });
  }

  // Set headers to prevent caching and force inline display
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'inline; filename="ebook.pdf"');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  // Stream the PDF
  const fileStream = fs.createReadStream(pdfPath);
  fileStream.pipe(res);
});

// Route: Logout (clear cookie)
app.post('/api/logout', (req, res) => {
  res.clearCookie('access_token');
  res.json({ success: true, message: 'Logged out successfully' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Make sure to:');
  console.log('1. Copy .env.example to .env and add your Razorpay credentials');
  console.log('2. Place your PDF file in ./private/ebook.pdf');
});


// TEST EMAIL PREVIEW - View the email template
app.get('/api/preview-email', (req, res) => {
  const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
  
  // Generate a REAL test token for the preview
  const testToken = jwt.sign(
    {
      paymentId: 'pay_preview123456789',
      orderId: 'order_preview123456789',
      email: 'preview@example.com',
      timestamp: Date.now(),
      type: 'permanent_access'
    },
    process.env.JWT_SECRET,
    { expiresIn: '10y' }
  );
  
  const testEmailData = {
    to: 'customer@example.com',
    paymentId: 'pay_test123456789',
    orderId: 'order_test123456789',
    amount: 50,
    accessLink: `${baseUrl}/access?token=${testToken}`, // Real working token
    timestamp: new Date().toISOString()
  };
  
  const email = generateAccessEmail(testEmailData);
  res.send(email.html);
});
