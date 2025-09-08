# E-Commerce React Frontend

A modern, beautiful authentication frontend built with **React**, **Vite**, **Tailwind CSS**, and **React Router**.

## ✨ Features

- 🎨 **Beautiful UI**: Modern design with gradients, animations, and responsive layout
- 📧 **Email Verification Flow**: Complete OTP-based email verification before signup
- 🔐 **Complete Authentication**: Login, Signup, Logout with JWT cookies
- 🚀 **React Hooks**: Modern React patterns with useState, useEffect, useContext
- 🎭 **Animations**: Smooth transitions and micro-interactions
- 📱 **Responsive Design**: Mobile-first design with Tailwind CSS
- 🔗 **OAuth Ready**: Google OAuth placeholder buttons (ready for implementation)
- ⚡ **Real-time Validation**: Form validation with visual feedback
- 🛡️ **Protected Routes**: Route protection with authentication context
- 💫 **Loading States**: Beautiful loading spinners and states

## 🛠️ Tech Stack

- **React 18** - Modern React with hooks
- **Vite** - Lightning-fast dev server and build tool  
- **Tailwind CSS** - Utility-first CSS framework
- **React Router DOM** - Client-side routing
- **Context API** - State management for authentication

## 🚀 Getting Started

### Prerequisites

Make sure you have:
- Node.js (v16 or higher)
- Backend server running on port 5000
- MongoDB and Redis configured for the backend

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser to `http://localhost:5173`

## 📱 Authentication Flow

### New User Registration:
1. **Verify Email** (`/` or `/verify-email`)
   - Enter email address
   - Receive 6-digit OTP via email
   - Verify OTP code
   - Email gets verified and stored in context

2. **Complete Signup** (`/signup`)
   - Email is pre-filled (if verified)
   - Enter name and password
   - Real-time password matching validation
   - Account created and auto-login

3. **Dashboard** (`/dashboard`)
   - Welcome message and profile overview
   - Account statistics
   - Quick action buttons (coming soon)

### Existing User Login:
1. **Login** (`/login`)
   - Email and password
   - Remember me option
   - Auto-redirect to dashboard

## 🗂️ Pages & Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | VerifyEmail | Default route - email verification |
| `/verify-email` | VerifyEmail | Email verification with OTP |
| `/signup` | Signup | User registration form |
| `/login` | Login | User login form |
| `/dashboard` | Dashboard | Protected user dashboard |

## 🎨 UI Components

### Reusable Components:
- **LoadingSpinner** - Configurable loading states
- **OAuthButton** - Google OAuth placeholder button
- **Protected/Public Routes** - Route protection logic

### Form Features:
- ✅ Real-time validation
- ✅ Password strength indicators
- ✅ Auto-submit OTP when complete
- ✅ Form state management
- ✅ Error/success messaging

## 🔧 API Integration

The frontend connects to your backend at `/api/auth/`:

```javascript
// Available API endpoints:
POST /api/auth/request-otp    // Request email verification
POST /api/auth/verify-otp     // Verify OTP code
POST /api/auth/signup         // Register new user
POST /api/auth/login          // Login user
POST /api/auth/logout         // Logout user
POST /api/auth/refresh-token  // Refresh access token
GET  /api/auth/profile        // Get user profile (optional)
```

## 🎭 Custom Animations

Built-in Tailwind animations:
- `animate-fade-in` - Fade in effect
- `animate-slide-up` - Slide up transition  
- `animate-bounce-subtle` - Gentle bounce effect
- Hover transformations on buttons
- Loading spinner animations

## 🌐 OAuth Integration

Google OAuth buttons are included but disabled. To activate:

1. Set up Google OAuth in your backend
2. Remove `disabled={true}` from OAuthButton components
3. Add OAuth redirect handling logic
4. Update API endpoints for OAuth flow

## 📦 Build for Production

```bash
# Build the app
npm run build

# Preview the build
npm run preview
```

The `dist` folder can be served statically or integrated with your backend.

## 🔄 State Management

Uses React Context API for:
- **User authentication state**
- **Verified email storage**
- **Loading states**
- **Error handling**

Context is available in all components via the `useAuth()` hook.

## 🎯 Key Features

### Email Verification Flow:
- Step-by-step wizard interface
- Auto-focus and auto-submit
- Resend OTP functionality  
- Visual success states

### Form Validation:
- Real-time password matching
- Email format validation
- Required field indicators
- Visual feedback (green/red states)

### Responsive Design:
- Mobile-first approach
- Responsive navigation
- Adaptive layouts
- Touch-friendly interactions

## 🚧 Coming Soon

- Password reset functionality
- Google OAuth implementation  
- Product browsing pages
- Shopping cart features
- Order history
- Account settings page

---

Your React frontend is now ready with a beautiful, modern authentication system! 🎉
