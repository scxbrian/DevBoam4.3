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
| **Authentication** | `/api/auth` | ❌ **Not Working** | Temporarily disabled due to missing `FIREBASE_SERVICE_ACCOUNT`. Must re-enable Firebase Admin SDK to restore login/register endpoints. |
| **Payments** | `/api/payments` | ⚠️ **Partially Working** | Paystack API is integrated but failing tests due to missing dependencies and `x-tenant-id` issues. |
| **Shops** | `/api/shops` | ⚠️ **Partially Working** | Route structure exists but depends on authentication middleware. |
| **Domains** | `/api/domains` | ❌ **Not Working** | Disabled due to broken auth dependency. |
| **Other Routes** | `/api/*` | ❓ **Unknown** | Products, orders, analytics, admin, and clients routes exist but depend on auth — untested. |

---

### 💻 Frontend (React)

| Feature | File | Status | Notes |
| :--- | :--- | :--- | :--- |
| **E-commerce Solution** | `src/data/serviceTiers.ts` | ℹ️ **In Progress** | Defines “BomaShop” e-commerce structure with tiers, inventory logic, and pricing. |
| **Payment Context** | `src/contexts/PaymentContext.tsx` | ℹ️ **In Progress** | Context provider for managing client-side payments; integration in active development. |

---

### 🧪 Testing (Mocha + Chai)

| Feature | Location | Status | Notes |
| :--- | :--- | :--- | :--- |
| **Backend Tests** | `test/payment.test.js` | ⚠️ **Failing** | Integration tests failing due to disabled auth service — breaking token-based test chains. |

---

## ⚙️ Setup & Deployment

### 1. Clone the Repository
```bash
git clone https://github.com/<yourusername>/devboma.git
cd devboma 2. Install Dependencies
npm install

3. Environment Variables

Create a .env file in both frontend and backend directories.

Frontend .env
VITE_FIREBASE_API_KEY=<firebase_api_key>
VITE_FIREBASE_PROJECT_ID=<firebase_project_id>
VITE_FIREBASE_STORAGE_BUCKET=<storage_bucket>
VITE_FIREBASE_MESSAGING_SENDER_ID=<messaging_sender_id>
VITE_FIREBASE_APP_ID=<firebase_app_id>
VITE_API_URL=https://devboma-api.onrender.com

Backend .env
MONGO_URI=<your_mongo_atlas_connection>
FIREBASE_SERVICE_ACCOUNT=<your_service_account_json>
PAYSTACK_SECRET_KEY=<your_paystack_key>

4. Run Locally

Frontend:

npm run dev


Backend:

npm run start

5. Deploy

Frontend (Vercel) → connect your GitHub repo → deploy branch.

Backend (Render) → create new Web Service → link repo → set env variables.

MongoDB (Atlas) → ensure network access allows Render connection.

Firebase → enable Analytics, Firestore, and Hosting if needed.

🧭 Summary

The foundation for DevBoma and BomaShop is fully in place, but certain features are pending:

Authentication and dependent routes must be restored via Firebase Admin SDK.

Payment integration tests require environment fixes (pg, tenant ID, auth tokens).

Once those are patched, the API will be production-ready for deployment.