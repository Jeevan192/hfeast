# CBIT Hacktoberfest '26 - Standalone Backend API

Production-ready, standalone Node.js (TypeScript + Express) REST API for **CBIT Hacktoberfest '26**. Powered by Google Cloud Firestore and Firebase Authentication via the Firebase Admin SDK.

---

## 🌟 Key Architectural Features

- **Race-Condition-Free Registration**: Enforces problem statement hard caps (`maxTeams`) and leader-email uniqueness inside atomic Firestore transactions. Conflicting double-submits or simultaneous grab of the last slot are handled atomically.
- **Role-Based Access Control**: Strict segregation between `superadmin` and `organizer` roles. Critical operations (data export, hard-deletion of registrations/tracks, admin user management) are locked to `superadmin`.
- **Zero Client Direct Access**: Secured via `firestore.rules` where all client reads and writes are blocked. All database mutations strictly pass through this backend.
- **Privacy & Security Hardened**:
  - `GET /api/registration-status` returns strictly status and problem statement metadata without exposing team members' PII.
  - CSV export protects against Formula Injection (CSV Injection) by prepending user inputs starting with `=`, `+`, `-`, or `@` with `'`.
  - Fail-fast environment variable validation at startup via Zod.
  - Proxy-aware IP rate limiting (`express-rate-limit` with `trust proxy: 1`).
  - Container runs under an unprivileged, non-root user (`app`).

---

## 📁 Directory Structure

```
.
├── .env                           # Single unified environment configuration
├── package.json                   # Root workspace scripts (dev, server, build)
├── vite.config.js                 # Frontend build & API reverse proxy configuration
├── src/                           # React 19 Frontend
└── server/                        # Standalone Express Backend
    ├── firestore.rules            # Production security rules denying direct client access
    ├── firestore.indexes.json     # Compound indexes for status, tracks, and sorting
    ├── requests.http              # Full REST API test suite
    ├── tsconfig.json              # TypeScript compiler options
    ├── package.json               # Backend dependencies and lifecycle scripts
    ├── README.md                  # Backend documentation
    ├── scripts/
    │   ├── seedProblemStatements.ts # Populates the 6 hackathon domain problem statements
    │   ├── createFirstAdmin.ts    # Bootstraps the first superadmin user
    │   └── testSuite.ts           # Automated verification suite (14/14 passed)
    └── src/
        ├── app.ts                 # Express application configuration and middleware
        ├── index.ts               # Process lifecycle and graceful shutdown
        ├── config/
        │   ├── env.ts             # Startup environment validation (reads root .env)
        │   └── firebase.ts        # Firebase Admin SDK initialization
        ├── models/                # Zod schemas & TypeScript types
        ├── utils/                 # Errors, phone/email validators, CSV exporter
        ├── middleware/            # Error handling, rate limiting, admin auth guards
        ├── services/              # Race-condition-free Firestore transaction logic
        └── routes/                # Health, tracks, register, and admin endpoints
```

---

## ⚙️ Environment Variables (`.env`)

The project uses a single, unified `.env` file located at the repository root (`/.env`):

| Variable | Description |
| :--- | :--- |
| `PORT` | Backend HTTP port (default `8080`) |
| `ALLOWED_ORIGINS` | Comma-separated list of allowed CORS origins |
| `VITE_API_URL` | Base URL used by the Vite proxy (default `http://localhost:8080`) |
| `FIREBASE_PROJECT_ID` | Your Firebase Project ID |
| `FIREBASE_CLIENT_EMAIL` | Service Account client email |
| `FIREBASE_PRIVATE_KEY` | Service Account private key (`\n` escaped) |

---

## 🚀 Running the Project Locally

### 1. Configure Firebase Credentials
Open the [`.env`](file:///c:/Users/Jeevan%20Reddy/OneDrive/Desktop/Samay_Raina/.env) file at the project root and replace the 3 decoy Firebase values with your actual service account credentials from Firebase Console (**Project Settings > Service accounts > Generate new private key**):
```env
FIREBASE_PROJECT_ID="your-project-id"
FIREBASE_CLIENT_EMAIL="firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com"
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

### 2. Start the Backend Server
From the project root:
```bash
npm run server
```
> Starts the Express backend on **`http://localhost:8080`**.

### 3. Start the Frontend
In another terminal, from the project root:
```bash
npm run dev
```
> Serves the React frontend on **`http://localhost:5173`**. The Vite dev server automatically proxies all `/api/*` requests to the backend.

### 4. Database Seeding & Admin Bootstrap
```bash
# Seed the 6 default problem statement domains:
npm run server:seed

# Bootstrap your first superadmin account:
npm run server:admin <your-email@domain.com> [optional-password]
```

---

## ☁️ Production Deployment

### 1. Google Cloud Run
1. Ensure the Google Cloud SDK (`gcloud`) is installed and authenticated:
   ```bash
   gcloud auth login
   gcloud config set project <YOUR_GCP_PROJECT_ID>
   ```
2. Build and deploy directly from source:
   ```bash
   cd server
   gcloud run deploy cbit-hacktoberfest-backend \
     --source . \
     --platform managed \
     --region asia-south1 \
     --allow-unauthenticated \
     --set-env-vars ALLOWED_ORIGINS="https://your-frontend-domain.com" \
     --set-env-vars FIREBASE_PROJECT_ID="<YOUR_GCP_PROJECT_ID>" \
     --set-env-vars FIREBASE_CLIENT_EMAIL="<SERVICE_ACCOUNT_EMAIL>" \
     --set-env-vars FIREBASE_PRIVATE_KEY="<PRIVATE_KEY>"
   ```

### 2. Render
1. In the Render Dashboard, choose **New > Web Service**.
2. Connect your repository and configure:
   - **Root Directory**: `server`
   - **Environment**: `Docker`
   - **Health Check Path**: `/healthz`
3. Under **Environment Variables**, add:
   - `ALLOWED_ORIGINS`: Your production frontend URL (e.g. `https://hacktoberfest.cbit.ac.in`)
   - `FIREBASE_PROJECT_ID`: Your Firebase project ID
   - `FIREBASE_CLIENT_EMAIL`: Service account email
   - `FIREBASE_PRIVATE_KEY`: Service account private key

---

## 📖 API Reference Summary

### Public Routes
- `GET /healthz` - Health probe (returns `{ status: "ok" }`).
- `GET /api/tracks` - List all active problem statements with `isFull` boolean.
- `POST /api/register` - Register a team (rate limited to 5 req/min).
- `GET /api/registration-status?email=<email>` - Check team registration status (PII-free, rate limited).

### Admin Routes (Bearer Token Required)
- `GET /api/admin/registrations` - Filterable, cursor-paginated registrations with search.
- `PATCH /api/admin/registrations/:id` - Update status, checkedIn, adminNote. Capacity re-checked on reinstatement; slot freed on rejection.
- `DELETE /api/admin/registrations/:id` - Hard delete registration and decrement team count (*Superadmin only*).
- `GET /api/admin/registrations/export` - Hardened CSV streaming (*Superadmin only*).
- `GET /api/admin/problem-statements` - View all problem statements (active & inactive).
- `POST /api/admin/problem-statements` - Create problem statement (`maxTeams` required).
- `PATCH /api/admin/problem-statements/:id` - Edit problem statement.
- `DELETE /api/admin/problem-statements/:id` - Delete problem statement (*Superadmin only*, 409 if teams assigned).
- `GET /api/admin/stats` - Dashboard analytics, top colleges, and PS fill percentages.
- `POST /api/admin/admins` - Authorize new administrator (*Superadmin only*).
- `GET /api/admin/admins` - List all authorized administrators (*Superadmin only*).
- `DELETE /api/admin/admins/:uid` - Revoke administrator access with self-lockout prevention (*Superadmin only*).
