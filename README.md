# 🏗️ DevBoma E-commerce Platform

This repository contains the source code for the **DevBoma E-commerce Platform**, a **multi-tenant solution** for online sellers, digital service providers, and retailers.  
It combines the **DevBoma Studio** (client configurator and digital services platform) and **BomaShop** (e-commerce and order management module) into a single scalable ecosystem.

---

## ⚡ Overview

**DevBoma** is a full-stack web solution built to simplify how businesses launch and scale their digital presence.  
It offers a unified environment for project configuration, e-commerce operations, analytics, and client engagement.

---

## 🧩 Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React (Vite + Tailwind CSS) |
| **Backend** | Node.js + Express |
| **Database** | MongoDB Atlas |
| **Hosting** | Frontend → Vercel<br>Backend → Render |
| **Auth & Integrations** | Firebase (Admin SDK, Firestore, Hosting) |
| **Payments** | Paystack, Mpesa, Stripe (planned) |
| **Testing** | Mocha + Chai |
| **Analytics** | Firebase Analytics, custom dashboard (upcoming) |

---

## 🧱 Project Configurator

The **Configurator** is the centerpiece of the DevBoma ecosystem — a dynamic pricing and project-building tool where users can:

- Choose from **service tiers** (Boma Lite, Core, Prime, Titan)  
- Add optional extras like domains, hosting, or maintenance  
- See **real-time pricing updates**  
- Submit their configuration for instant quotes or onboarding  

The configurator also integrates directly with **BomaShop**, allowing users to move from “build” → “checkout” seamlessly.

---

## 🛒 BomaShop Module

**BomaShop** extends DevBoma into a full **e-commerce experience** — enabling digital and physical product sales.

### Planned Features:
- Hosting plans, web templates, and digital service sales  
- Full order management system  
- Subscription billing and renewals  
- Integrated analytics dashboard  
- Payment gateway support (Mpesa, Stripe, PayPal)

---

## 🧩 Features Status

Below is the current status of all **backend**, **frontend**, and **testing** features as of the most recent analysis.

### 🧠 Backend (Node.js + Express)

| Feature | Route | Status | Notes |
| :--- | :--- | :--- | :--- |
| **Core Server** | N/A | ✅ **Working** | Express server, MongoDB connection, and core middleware (CORS, Helmet, Compression) are all functional. |
| **Health Check** | `/api/health` | ✅ **Working** | Returns a clean `status: OK`. |
| **Authentication** | `/api/auth` | ✅ **Working** | Firebase Admin SDK is configured and authentication endpoints (login, register, me) are fully functional. |
| **Payments** | `/api/payments` | ⚠️ **Partially Working** | Paystack API is integrated but requires environment-specific keys to be fully tested. |
| **Shops** | `/api/shops` | ✅ **Working** | Shop management routes are functional and protected by authentication. |
| **Domains** | `/api/domains` | ✅ **Working** | Domain management routes are functional. |
| **Other Routes** | `/api/*` | ✅ **Working** | Products, orders, analytics, admin, and clients routes are all functional and protected by authentication. |

---

### 💻 Frontend (React)

| Feature | File | Status | Notes |
| :--- | :--- | :--- | :--- |
| **E-commerce Solution** | `src/data/serviceTiers.ts` | ℹ️ **In Progress** | Defines “BomaShop” e-commerce structure with tiers, inventory logic, and pricing. |
| **Payment Context** | `src/contexts/PaymentContext.tsx` | ℹ️ **In Progress** | Context provider for managing client-side payments; integration in active development. |
| **API Integration**| `src/utils/api.ts` | ✅ **Working** | API client is configured to work with a proxied backend for seamless deployment. |

---

### 🧪 Testing (Mocha + Chai)

| Feature | Location | Status | Notes |
| :--- | :--- | :--- | :--- |
| **Backend Tests** | `test/payment.test.js` | ⚠️ **Partially Working** | Core auth tests are passing. Payment integration tests require environment-specific configuration. |

---

## ⚙️ Setup & Deployment

### 1. Clone the Repository
```bash
git clone https://github.com/scxbrian/DevBoam4.3.git
cd DevBoam4.3
```
### 2. Install Dependencies
```bash
# In the root directory
npm install

# In the backend directory
cd backend && npm install

# In the project directory (frontend)
cd ../project && npm install
```
### 3. Environment Variables

Create a `.env` file in the `backend` directory.

**Backend `.env`**
```
MONGO_URI=<your_mongo_atlas_connection>
FIREBASE_TYPE=service_account
FIREBASE_PROJECT_ID=<firebase_project_id>
FIREBASE_PRIVATE_KEY_ID=<firebase_private_key_id>
FIREBASE_PRIVATE_KEY="<your_firebase_private_key>"
FIREBASE_CLIENT_EMAIL=<firebase_client_email>
FIREBASE_CLIENT_ID=<firebase_client_id>
FIREBASE_AUTH_URI=<firebase_auth_uri>
FIREBASE_TOKEN_URI=<firebase_token_uri>
FIREBASE_AUTH_PROVIDER_X509_CERT_URL=<firebase_auth_provider_cert_url>
FIREBASE_CLIENT_X509_CERT_URL=<firebase_client_cert_url>
FRONTEND_URL=http://localhost:5173
```
The frontend does not require a `.env` file for local development as API calls are proxied.

### 4. Run Locally

**Backend:**
```bash
# from the /backend directory
npm run start
```

**Frontend:**
```bash
# from the /project directory
npm run dev
```

### 5. Deploy

**Backend (Render):**
1.  Push your code to GitHub.
2.  Create a new "Web Service" on Render and connect your repository.
3.  **Root Directory:** `backend`
4.  **Build Command:** `npm install`
5.  **Start Command:** `node server.js`
6.  Add all the environment variables from your backend `.env` file to the Render dashboard. Update `FRONTEND_URL` to your Vercel deployment URL.

**Frontend (Vercel):**
1.  After deploying the backend, get its public URL from Render.
2.  Open `project/vercel.json` and replace `https://your-backend-api-url.onrender.com` with your actual Render backend URL.
3.  Push this change to GitHub.
4.  Create a new project on Vercel, connect your GitHub repo, and deploy. Vercel will automatically detect the correct settings.

---

## 🧭 Summary

The DevBoma platform is in a stable state and ready for deployment. The core backend services, including authentication and all major API routes, are fully functional. The frontend is configured for seamless integration with the backend via a proxy, ensuring a smooth deployment experience on Vercel and Render.
