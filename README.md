# Agentic AI AML Platform — Frontend

> React frontend for the AML compliance platform.

[![React 19](https://img.shields.io/badge/React-19-61dafb.svg)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6.svg)](https://typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-7-646cff.svg)](https://vite.dev)

## What is this?

The analyst-facing UI for the Agentic AI AML backend. Provides dashboards for alert investigation, KYC onboarding, regulatory report drafting, audit trail exploration, and user management.

## Pages

| Page | Route | Backend API | Description |
|---|---|---|---|
| **Login** | `/login` | `POST /auth/login` | JWT authentication with tenant selection |
| **Alert Queue** | `/alerts` | `GET /alerts` | Alert list with severity, status, and investigation trigger |
| **Case Workspace** | `/cases/:id` | `GET /alerts/:id` | XAI investigation timeline with agent reasoning |
| **SMR Workspace** | `/reports/smr/:caseId` | `POST /reports/draft`, `POST /reports/submit` | Side-by-side evidence + AI-drafted narrative editor |
| **KYC Dashboard** | `/kyc` | `GET /kyc/customers` | Customer onboarding progress, risk scores |
| **KYC Detail** | `/kyc/:customerId` | `GET /kyc/customers/:id` | CDD checklist, risk breakdown, corporate structure |
| **Corporate Structure** | (modal in KYC Detail) | `GET /entities/:id/ownership` | Interactive ownership graph with UBO resolution |
| **Audit Trail** | `/audit-trail` | `GET /governance/logs` | ISO 42001 governance log explorer with filtering |
| **Responsible AI** | `/responsible-ai` | Mock (pending BE endpoint) | Model accuracy trends, bias metrics, segment performance |
| **Observability** | `/observability` | Mock (pending BE endpoint) | Agent throughput, latency P50/P95/P99, error rates |
| **User Management** | `/admin/users` | `GET /auth/users`, `POST /auth/register` | User listing, role management, invite form |
| **Tenant Config** | `/admin/config` | — | Risk appetite sliders, model selection |

## Quick Start

### Prerequisites

- Node.js 20+
- Backend running at `http://localhost:8000`

### Setup

```bash
# Clone and install
git clone https://github.com/SparkleProject/agentic-ai-open-aml-ui.git
cd agentic-ai-open-aml-ui
npm install

# Start dev server (proxies /api to localhost:8000)
npm run dev
```

App: `http://localhost:5173`

### Default login (dev)

- **Email:** `admin@aml.local`
- **Password:** `admin`
- **Tenant ID:** `default`

### Build for production

```bash
npm run build
# Output in dist/
```

## Configuration

| Environment Variable | Default | Description |
|---|---|---|
| `VITE_USE_MOCK_DATA` | `false` | Set to `true` to use mock data (offline development) |

Create a `.env` file in the project root:

```env
VITE_USE_MOCK_DATA=false
```

When `true`, all pages fall back to mock data services — no backend required. When `false` (default), pages call real backend APIs with automatic fallback for endpoints that don't exist yet (Responsible AI, Observability).

## Project Structure

```
src/
├── contexts/
│   └── AuthContext.tsx       # JWT auth state, login/logout, token management
├── pages/
│   ├── Login.tsx             # Authentication page
│   ├── AlertQueue.tsx        # Alert investigation queue
│   ├── CaseWorkspace.tsx     # XAI investigation view
│   ├── SMRWorkspace.tsx      # Regulatory report editor
│   ├── KYCDashboard.tsx      # Customer onboarding overview
│   ├── KYCDetail.tsx         # Customer CDD detail
│   ├── AuditTrailExplorer.tsx # Governance log viewer
│   ├── ResponsibleAIDashboard.tsx # Model metrics
│   ├── ObservabilityDashboard.tsx # System telemetry
│   ├── UserManagement.tsx    # User CRUD
│   └── ConfigurationPortal.tsx # Tenant settings
├── components/
│   ├── KYC/                  # KYC components (checklist, risk gauge, corporate graph)
│   ├── SMR/                  # SMR components (evidence viewer, narrative editor)
│   ├── ResponsibleAI/        # AI metrics (accuracy chart, bias card, audit table)
│   ├── Observability/        # Telemetry (stat cards, throughput/latency charts)
│   ├── Investigation/        # XAI timeline
│   ├── Chat/                 # Agent chat panel
│   ├── Button/               # Shared button component
│   └── Card/                 # Shared card component
├── services/
│   ├── api.ts                # Real API client with auth + mock fallback
│   ├── types.ts              # Shared TypeScript types
│   └── mock*.ts              # Mock data services (6 files)
├── hooks/
│   ├── useAlerts.ts          # Alert list hook
│   └── useAlert.ts           # Single alert hook
├── layouts/
│   └── AppLayout.tsx         # Sidebar navigation, user info, theme toggle
└── main.tsx                  # Entry point
```

## Tech Stack

- **React 19** with TypeScript
- **Vite 7** for build tooling
- **React Router 7** for routing
- **Recharts** for data visualisation
- **React Flow** (`@xyflow/react`) for corporate structure graph
- **Lucide React** for icons

## Authentication Flow

1. User navigates to any page → `ProtectedRoute` checks for token in localStorage
2. No token → redirect to `/login`
3. User submits email + password + tenant ID → `POST /api/v1/auth/login`
4. Backend returns JWT access + refresh tokens
5. Tokens stored in localStorage, user info cached
6. All subsequent API calls include `Authorization: Bearer <token>` header
7. On 401 response → auto-clear tokens, redirect to login

## License

Proprietary. All rights reserved.
