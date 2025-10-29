# DevBoma E-commerce Platform

This repository contains the source code for the DevBoma E-commerce Platform, a multi-tenant solution for online sellers and retailers.

## Features Status

This document outlines the current status of the project's features based on a recent analysis.

### Backend

The backend is built with Node.js and Express.

| Feature | Route | Status | Notes |
| :--- | :--- | :--- | :--- |
| **Core Server** | N/A | ✅ **Working** | The basic Express server, database connection (`MongoDB`), and core middleware (CORS, Helmet, Compression) are set up and functional. |
| **Health Check** | `/api/health` | ✅ **Working** | The health check endpoint is operational and returns a status of 'OK'. |
| **Authentication** | `/api/auth` | ❌ **Not Working** | This feature is currently disabled. It relies on the Firebase Admin SDK for user registration and authentication, but it was failing to initialize due to a missing `FIREBASE_SERVICE_ACCOUNT` environment variable. The route has been temporarily commented out in `server.js` to allow the rest of the application to run. |
| **Payments** | `/api/payments` | ⚠️ **Partially Working** | Paystack payment integration is implemented but is not fully functional. The integration tests are currently failing due to several issues: <br> - The test suite has a dependency on the disabled Authentication feature. <br> - It was missing the `pg` node module. <br> - The test requests were failing to set the `x-tenant-id` header correctly. |
| **Shops** | `/api/shops` | ⚠️ **Partially Working** | The route is in place but likely non-functional. It appears to have a dependency on the disabled authentication middleware. |
| **Domains** | `/api/domains` | ❌ **Not Working** | This feature is disabled. The route was commented out in `server.js` because it uses an `isAuthenticated` middleware that depends on the broken authentication service. |
| **Other API Routes** | `/api/*` | ❓ **Unknown** | Other routes such as `products`, `orders`, `analytics`, `admin`, and `clients` exist but have not been tested. They likely depend on the authentication service and will not work until it is fixed. |

### Frontend

The frontend appears to be a modern web application, likely built with a framework like React.

| Feature | File | Status | Notes |
| :--- | :--- | :--- | :--- |
| **E-commerce Solution** | `src/data/serviceTiers.ts` | ℹ️ **In Progress** | The codebase defines a 'Boma Shop' service, which is a complete e-commerce solution. Planned features include a custom frontend, order management, inventory, analytics, and payment integration (Mpesa, Stripe, PayPal). |
| **Payment Context** | `src/contexts/PaymentContext.tsx` | ℹ️ **In Progress** | A React Context for handling payments is present, indicating that the client-side implementation for payment processing is being developed. |

### Testing

| Feature | Location | Status | Notes |
| :--- | :--- | :--- | :--- |
| **Backend Tests** | `test/payment.test.js` | ⚠️ **Failing** | The project uses Mocha and Chai for backend testing. However, the existing test suite for the Payments API is consistently failing. The failures are due to a cascade of issues, starting with the disabled authentication system, which prevents the tests from acquiring necessary auth tokens and IDs for subsequent API calls. |

---

### Summary

The foundation for the DevBoma platform is in place, but major features are currently broken or disabled due to a critical failure in the authentication service. The immediate priority should be to properly configure the Firebase Admin SDK with the necessary credentials and restore the authentication routes and middleware. After that, the integration tests for payments and other features need to be fixed to ensure the reliability of the API.
