# 🔐 Admin Access Setup Guide

## **IMPORTANT: Update Admin Email Whitelist**

Before using admin features, you MUST update the admin email whitelist in the code.

### **Step 1: Update Admin Emails**

Edit `contexts/MaintenanceContext.tsx` and replace the placeholder emails:

```typescript
// ADMIN EMAIL WHITELIST - Only these emails can access admin features
const ADMIN_EMAILS = [
  'your-actual-email@gmail.com',    // Replace with YOUR email
  'admin@aimusicpromptr.com',       // Replace with your domain email
  // Add more admin emails as needed
];
```

### **Step 2: How to Access Admin Mode**

1. **Sign in normally** with one of the whitelisted admin emails
2. **Click the app title "🎵 AI Music Prompter" 7 times** on the main screen
3. **System will verify your email** against the whitelist
4. **If authorized**: You'll get admin access
5. **If not authorized**: Access will be denied

### **Step 3: Security Features**

✅ **Email-based authorization** - Only whitelisted emails can access admin features
✅ **Automatic verification** - System checks your signed-in email against the whitelist
✅ **Access denial** - Non-admin users get clear "Access Denied" message
✅ **Session-based** - Admin access resets when you sign out

### **Step 4: Adding More Admins**

To add more admin users:
1. Add their email to the `ADMIN_EMAILS` array
2. They must sign in with that exact email
3. Then use the 7-click method to activate admin mode

### **Current Security Level: 🔒 HIGH**

- No more anonymous admin access
- Email verification required
- Whitelist-based authorization
- Clear access control