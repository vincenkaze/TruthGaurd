# TruthGuard Frontend

React + TypeScript frontend for the TruthGuard Fake News Detection application.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app runs at `http://localhost:3000`.

---

## Project Structure

```
frontend/
|-- index.html                       # Vite HTML entry point
|-- package.json                     # Dependencies
|-- vite.config.ts                   # Vite config (port 3000)
|-- tsconfig.json                    # TypeScript config (references)
|-- tsconfig.app.json                # App TypeScript config
|-- tsconfig.node.json               # Node TypeScript config
|-- eslint.config.js                 # ESLint config
|
|-- public/                          # Static assets
|   |-- favicon.ico
|   |-- icons/
|   |   |-- eye.png                  # Password show icon
|   |   |-- eye-off.png              # Password hide icon
|   |-- image/
|       |-- horizon.png              # Hero section image
|       |-- shield.png               # Shield/logo image
|
|-- src/
    |-- main.tsx                     # React entry point (AuthProvider, BrowserRouter)
    |-- App.tsx                      # Root component + routing
    |-- types.ts                     # TypeScript interfaces
    |-- vite-env.d.ts                # Vite type declarations
    |
    |-- context/
    |   |-- AuthContext.tsx           # Auth state management (login, signup, logout)
    |
    |-- services/
    |   |-- api.ts                   # Prediction API client (POST /predict)
    |   |-- authService.ts           # Auth API client (register, login, logout, refresh, reset)
    |   |-- FeedbackService.ts       # Feedback submission client (POST /feedback)
    |
    |-- components/
    |   |-- NewsChecker.tsx           # Core news analysis input + results display
    |   |-- AnalysisResults.tsx       # Prediction result card (FAKE/REAL with confidence bar)
    |   |-- FeedbackModel.tsx         # Star-rating feedback modal (Headless UI)
    |   |-- Navbar.tsx               # Navigation bar with auth state
    |   |-- Footer.tsx               # Site footer with links
    |   |-- ProtectedRoute.tsx        # Auth guard for protected pages
    |   |
    |   |-- forms/
    |   |   |-- LoginForm.tsx         # Login form with validation
    |   |   |-- SignUpForm.tsx        # Registration form with password validation
    |   |   |-- PasswordRecoveryForm.tsx  # Password reset request form
    |   |
    |   |-- modals/
    |       |-- LoginModal.tsx        # Login overlay modal
    |       |-- SignUpModal.tsx       # Signup overlay modal
    |       |-- ForgotPasswordModal.tsx  # Password recovery overlay modal
    |
    |-- pages/
    |   |-- HomePage.tsx             # Landing page (hero, news checker, about, FAQ)
    |   |-- LoginPage.tsx            # Dedicated login page
    |   |-- SignupPage.tsx           # Dedicated signup page
    |   |-- ForgotPasswordPage.tsx   # Password reset request page
    |   |-- ResetPasswordPage.tsx    # Password reset confirm page (token from URL)
    |   |-- PrivacyPage.tsx          # Privacy Policy page
    |   |-- TermsPage.tsx            # Terms of Service page
    |
    |-- styles/
    |   |-- skin.css                 # Complete custom stylesheet (524 lines)
    |
    |-- utils/
        |-- validators.ts            # Client-side password validation
```

---

## Tech Stack

| Component | Technology | Version |
|---|---|---|
| Framework | React | 19 |
| Language | TypeScript | 5.x |
| Build Tool | Vite | 6.3 |
| Routing | react-router-dom | v7 |
| HTTP Client | Axios | 1.x |
| UI Framework | Bootstrap | 5.3 |
| Icons | Font Awesome | 6.7 |
| Animations | Framer Motion | 12.x |
| Modals | Headless UI | v2 |
| Notifications | react-toastify | 10.x |
| Linting | ESLint | 9 |

---

## Configuration

### Environment Variables

Create a `.env` file in the `frontend/` directory:

```bash
# Backend API URL
VITE_API_URL=http://localhost:8000/api
```

If not set, the frontend defaults to `http://localhost:8000/api`.

---

## Routing

| Path | Component | Auth Required | Description |
|---|---|---|---|
| `/` | `HomePage` | No | Landing page with news checker |
| `/login` | `LoginPage` | No | Dedicated login page |
| `/signup` | `SignupPage` | No | Dedicated signup page |
| `/forgot-password` | `ForgotPasswordPage` | No | Password reset request |
| `/reset-password` | `ResetPasswordPage` | No | Password reset confirm (token in URL) |
| `/privacy` | `PrivacyPage` | **Yes** | Privacy Policy |
| `/terms` | `TermsPage` | **Yes** | Terms of Service |
| `*` | Redirect to `/` | No | Catch-all redirect |

---

## Components

### Core

- **`NewsChecker`** -- Main feature component. Users paste news text, click analyze, and receive a prediction with confidence score. Guest users limited to 3 predictions.
- **`AnalysisResults`** -- Displays prediction result with a color-coded confidence bar (green for REAL, yellow/orange for FAKE).
- **`FeedbackModel`** -- Star-rating modal (1-5 stars) that appears 5 seconds after a prediction. Only available to authenticated users.

### Navigation & Layout

- **`Navbar`** -- Responsive navigation bar. Shows login/signup buttons for guests, user info + logout for authenticated users.
- **`Footer`** -- Site footer with links to Privacy Policy, Terms of Service, and GitHub.
- **`ProtectedRoute`** -- Route wrapper that redirects unauthenticated users to the homepage.

### Auth Forms

- **`LoginForm`** -- Email + password with client-side validation.
- **`SignUpForm`** -- Name + email + password with strength requirements (12+ chars, uppercase, lowercase, number).
- **`PasswordRecoveryForm`** -- Email input for password reset request.

### Auth Modals

- **`LoginModal`** -- Overlay modal wrapping `LoginForm`. Can switch to signup modal.
- **`SignUpModal`** -- Overlay modal wrapping `SignUpForm`. Can switch to login modal.
- **`ForgotPasswordModal`** -- Overlay modal wrapping `PasswordRecoveryForm`.

---

## TypeScript Interfaces

```typescript
interface User {
  id: string;
  email: string;
  name: string;
  role?: "user" | "admin";
  createdAt?: string;
}

interface PredictionResult {
  predictionId: string;
  prediction: "FAKE" | "REAL";
  confidence: number;
}

interface Feedback {
  predictionId: string;
  rating: number;
  userId?: string;
}
```

---

## Services (API Clients)

### `api.ts` - Prediction API
```typescript
POST /predict  -->  { predictionId, prediction, confidence }
```

### `authService.ts` - Authentication API
```typescript
POST /auth/register            -->  { access_token, token_type, user }
POST /auth/login               -->  { access_token, token_type, user }
POST /auth/request-password-reset  -->  { message }
POST /auth/reset-password      -->  { message }
```

### `FeedbackService.ts` - Feedback API
```typescript
POST /feedback  (JWT required) -->  { message }
```

---

## Build

```bash
# Development
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Lint
npm run lint
```

---

## Styling

All custom styles are in `src/styles/skin.css` (524 lines). The app uses:

- **Bootstrap 5.3** for grid, components, and utilities
- **Font Awesome 6.7** for icons
- **Custom CSS** for brand colors, animations, responsive breakpoints (992px, 768px, 576px)

---

## Key Features

1. **Dual-mode auth forms** -- Work both as overlay modals (from homepage) and as dedicated pages (`/login`, `/signup`)
2. **Guest prediction limit** -- 3 free predictions before signup prompt
3. **Animated transitions** -- Framer Motion for navbar dropdown, Headless UI for modals
4. **Toast notifications** -- Success/error feedback via react-toastify
5. **Confidence visualization** -- Color-coded progress bar with percentage
6. **Responsive design** -- Mobile-first with Bootstrap breakpoints
7. **Password visibility toggle** -- Eye icon on password fields
8. **Client-side validation** -- Password strength matching server-side rules
