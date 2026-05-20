# Architectural Implementation Plan: FE-302 (KYC Dashboard)

## 1. Executive Overview & Technical Strategy

**Task**: Build a KYC/CDD Dashboard providing compliance officers with a real-time view of customer onboarding progress, identity verification status, risk scoring breakdowns, and CDD checklist completion — specifically designed for Tranche 2 entities (lawyers, accountants, real estate) entering the AML regime for the first time.

**Architectural Philosophy: "Progress-Driven Compliance"**

Unlike traditional static customer lists, our KYC Dashboard must surface **actionable progress** at a glance. Compliance officers managing Tranche 2 onboarding waves need to immediately see:
- *Which customers are stuck?* (failed checks, stalled stages)
- *Which customers are high-risk?* (risk score visualisation)
- *What has the AI automated vs. what needs human intervention?* (CDD checklist with agent attribution)

The dashboard follows a **list → detail** drill-down pattern consistent with our existing Alert Queue (`/alerts`) → Case Workspace (`/cases/:id`) flow.

---

## 2. Route Structure

| Route | Page Component | Purpose |
|---|---|---|
| `/kyc` | `KYCDashboard.tsx` | Customer list with summary cards, filters, and onboarding stats |
| `/kyc/:customerId` | `KYCDetail.tsx` | Individual customer deep-dive: risk breakdown, verification status, CDD checklist |

> **Note:** This mirrors the existing `/alerts` → `/cases/:id` navigation pattern. The list page is the primary entry point accessible from the sidebar.

---

## 3. Component Architecture

### A. File Structure

```
src/
├── pages/
│   ├── KYCDashboard.tsx          # Step 3: Customer list view
│   └── KYCDetail.tsx             # Step 4: Customer detail view
├── components/
│   └── KYC/
│       ├── RiskScoreGauge.tsx     # Step 5: Animated circular risk gauge
│       ├── VerificationBadge.tsx  # Step 6: Status badge (reused in list + detail)
│       ├── CDDChecklist.tsx       # Step 7: Interactive checklist with agent attribution
│       ├── RiskBreakdownChart.tsx # Step 8: Horizontal bar chart for risk categories
│       └── OnboardingProgress.tsx # Step 9: Segmented progress bar with stage labels
├── services/
│   └── mockKYCData.ts            # ✅ ALREADY CREATED — mock BE-302 payloads
```

### B. State Management
- **No global state required.** Each page fetches its own data via the mock service.
- `KYCDashboard` uses `useState` for filter state (entity type, risk level, onboarding stage).
- `KYCDetail` uses `useState` + `useEffect` for async data loading (same pattern as `SMRWorkspace.tsx`).

---

## 4. Step-by-Step Implementation

### Step 1: Verify Mock Data Layer ✅ (Already Complete)

**File**: `src/services/mockKYCData.ts`

This was pre-created. It provides:
- `fetchMockKYCCustomers()` — returns all 4 mock customers
- `fetchMockKYCCustomer(id)` — returns a single customer by ID

**Data model covers**: `KYCCustomer`, `CDDChecklistItem`, `RiskScoreBreakdown`, `VerificationStatus`, `OnboardingStage`, `RiskLevel`.

**Verification**: Import the types into a scratch component and confirm TypeScript compiles without errors.

---

### Step 2: Route & Sidebar Wiring

**Files to modify**:
- `src/App.tsx` — Add two new `<Route>` entries
- `src/layouts/AppLayout.tsx` — Add a "COMPLIANCE" nav section with a KYC nav link

**App.tsx changes**:
```tsx
import { KYCDashboard } from './pages/KYCDashboard';
import { KYCDetail } from './pages/KYCDetail';

// Inside <Routes>:
<Route path="kyc" element={<KYCDashboard />} />
<Route path="kyc/:customerId" element={<KYCDetail />} />
```

**AppLayout.tsx changes**:
- Import `UserCheck` from `lucide-react` (represents identity/KYC verification)
- Add a new nav section `COMPLIANCE` between `ADMINISTRATION` and `WORKFLOWS`
- Add a `NavLink` to `/kyc` with the `UserCheck` icon and label "KYC Onboarding"

**Acceptance**:
- Navigating to `/kyc` renders the dashboard page (can be a placeholder `<h1>`)
- Sidebar shows the new nav item with correct active highlighting

---

### Step 3: KYC Dashboard Page (`KYCDashboard.tsx`)

**File**: `src/pages/KYCDashboard.tsx`

The main list view. Follows the same layout pattern as `AlertQueue.tsx`:
- Page header (title + subtitle + action buttons)
- Summary stats row (4 metric cards)
- Filterable customer table

#### 3a. Page Header
- Title: "KYC Onboarding"
- Subtitle: "Track customer due diligence progress and risk assessments."
- Action buttons: `Filter` (outline) + `New Customer` (primary)

#### 3b. Summary Stats Row
A horizontal row of 4 compact `Card` components showing aggregate metrics computed from mock data:

| Metric | Computation | Colour |
|---|---|---|
| **Total Customers** | `customers.length` | `--text-primary` |
| **Onboarding In Progress** | count where `onboardingStage !== 'COMPLETE'` | `--primary` |
| **High/Critical Risk** | count where `overallRiskLevel` is `HIGH` or `CRITICAL` | `--error` |
| **Fully Verified** | count where `onboardingStage === 'COMPLETE'` | `--success` |

Layout: `display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px`

#### 3c. Customer Table
Reuse the inline table pattern from `AlertQueue.tsx` (wrapped in a `Card`).

**Columns**:

| Column | Source | Rendering |
|---|---|---|
| Customer | `name` | Bold text |
| Type | `entityType` | Plain text |
| Tranche | `tranche` | Badge pill (styled with `--primary-transparent` for T2) |
| Jurisdiction | `jurisdiction` | Plain text, e.g. "AU" / "NZ" |
| Risk | `overallRiskLevel` | Colour-coded severity badge (reuse `getSeverityStyle` pattern from AlertQueue) |
| Progress | `onboardingProgress` | `OnboardingProgress` mini bar (inline) |
| Status | `onboardingStage` | Human-readable label |
| Actions | — | `Review` ghost button → navigates to `/kyc/:customerId` |

**Filter state** (optional enhancement):
- `useState<RiskLevel | 'ALL'>('ALL')` — filter by risk level
- Filter buttons above the table (All / Low / Medium / High / Critical)

**Acceptance**:
- Page renders 4 mock customers in a table
- Clicking "Review" navigates to `/kyc/CUS-0012` (etc.)
- Summary stats compute correctly from mock data
- Dark mode applies correctly

---

### Step 4: KYC Detail Page (`KYCDetail.tsx`)

**File**: `src/pages/KYCDetail.tsx`

The deep-dive view for a single customer. Follows `CaseWorkspace.tsx` layout pattern.

#### 4a. Header
- Back button (← navigates to `/kyc`)
- Title: Customer name
- Subtitle: Entity type • Industry • Jurisdiction • Tranche
- Action buttons: `Run Full Screening` (primary), `Export CDD Report` (outline)

#### 4b. Layout
A two-column grid: `grid-template-columns: 1fr 1fr; gap: 24px`

**Left Column**:
1. **Risk Score Gauge** — `RiskScoreGauge` component (Step 5) showing `overallRiskScore` and `overallRiskLevel`
2. **Risk Breakdown Chart** — `RiskBreakdownChart` component (Step 8) showing each category
3. **Verification Status** — 4x `VerificationBadge` components (Step 6) for ID, PEP, Sanctions, Adverse Media

**Right Column**:
1. **Onboarding Progress** — `OnboardingProgress` component (Step 9) showing stage and percentage
2. **CDD Checklist** — `CDDChecklist` component (Step 7) showing all items with status, agent attribution, and notes

#### 4c. Data Loading
```tsx
const { customerId } = useParams<{ customerId: string }>();
const [customer, setCustomer] = useState<KYCCustomer | null>(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
  if (customerId) {
    fetchMockKYCCustomer(customerId).then(data => {
      setCustomer(data);
      setLoading(false);
    });
  }
}, [customerId]);
```

Loading state: same centered "Loading..." pattern as `SMRWorkspace.tsx`.

**Acceptance**:
- Navigating to `/kyc/CUS-0014` (Pacific Trust) renders full detail view
- All sub-components display data correctly
- Back button navigates to `/kyc` list

---

### Step 5: `RiskScoreGauge` Component

**File**: `src/components/KYC/RiskScoreGauge.tsx`

A circular gauge/donut showing the overall risk score (0–100) with colour coding.

**Props**:
```tsx
interface RiskScoreGaugeProps {
  score: number;          // 0–100
  riskLevel: RiskLevel;   // drives colour
}
```

**Implementation**:
- Use an SVG `<circle>` with `stroke-dasharray` + `stroke-dashoffset` for the arc
- Centre text shows the numeric score
- Below the gauge: risk level label in a colour-coded badge
- Colour mapping:
  - `LOW` → `--success`
  - `MEDIUM` → `--warning`
  - `HIGH` → `--error` at 80% opacity
  - `CRITICAL` → `--error` full opacity with pulsing glow animation

**Wrap in a `Card` with `glass` variant**, title "Risk Assessment".

**Acceptance**:
- A score of 91 (CRITICAL) renders a nearly-full red arc with pulsing animation
- A score of 18 (LOW) renders a small green arc

---

### Step 6: `VerificationBadge` Component

**File**: `src/components/KYC/VerificationBadge.tsx`

A compact inline status indicator for each verification type.

**Props**:
```tsx
interface VerificationBadgeProps {
  label: string;              // e.g. "PEP Screening"
  status: VerificationStatus; // 'VERIFIED' | 'PENDING' | 'FAILED' | 'NOT_STARTED'
}
```

**Rendering**:

| Status | Icon | Colour | Background |
|---|---|---|---|
| `VERIFIED` | `CheckCircle` | `--success` | `hsla(var(--success) / 0.1)` |
| `PENDING` | `Clock` | `--warning` | `hsla(var(--warning) / 0.1)` |
| `FAILED` | `XCircle` | `--error` | `hsla(var(--error) / 0.1)` |
| `NOT_STARTED` | `MinusCircle` | `--text-muted` | `hsla(var(--bg-elevated))` |

Layout: Horizontal flex with icon + label + status text. Border radius `8px`. Padding `12px 16px`.

**Acceptance**:
- 4 badges for a customer with mixed statuses display distinct visual states
- Icons import from `lucide-react`

---

### Step 7: `CDDChecklist` Component

**File**: `src/components/KYC/CDDChecklist.tsx`

A structured checklist showing each CDD step with status, automation agent attribution, and optional notes.

**Props**:
```tsx
interface CDDChecklistProps {
  items: CDDChecklistItem[];
}
```

**Implementation**:
- Group items by `category` (identity → screening → risk → documentation)
- Render each group with a category header (uppercase, muted text, same style as sidebar nav sections)
- Each item is a row:
  - Status icon (COMPLETE = green check, IN_PROGRESS = spinning loader, PENDING = grey clock, FAILED = red X)
  - Label text (bold if active/failed, normal otherwise)
  - Right side: `automatedBy` tag (small pill with agent name) OR `notes` text
  - If `completedAt` present, show relative time (e.g. "12 May, 09:30")

**Wrap in a `Card`**, title "CDD Checklist", description showing completion percentage (e.g. "6 of 9 complete").

**Design**: Use alternating row backgrounds (`hsla(var(--bg-elevated))` on even rows) for readability.

**Acceptance**:
- Items grouped by category with visible section headers
- FAILED items stand out visually (red left border or red icon)
- Agent attribution pills are styled consistently with the existing typology pills in `AlertQueue.tsx`

---

### Step 8: `RiskBreakdownChart` Component

**File**: `src/components/KYC/RiskBreakdownChart.tsx`

A set of horizontal bar segments showing the contribution of each risk category.

**Props**:
```tsx
interface RiskBreakdownChartProps {
  breakdown: RiskScoreBreakdown[];
}
```

**Implementation**:
- Pure CSS horizontal bars (no charting library needed)
- Each row: category label (left), bar (middle, width = `score%`), score value (right)
- Bar colour gradient: green (0–30) → yellow (31–60) → orange (61–80) → red (81–100)
- Below each bar: list of signals as small muted text items
- Bars animate in from `width: 0` to actual width on mount (CSS transition `width 0.6s ease`)

**Wrap in a `Card`**, title "Risk Score Breakdown".

**Acceptance**:
- 4 bars render with correct widths proportional to score
- Bars animate smoothly on first render
- Signal list under each bar is collapsible or always visible (decide during implementation — leaning towards always visible for compliance context)

---

### Step 9: `OnboardingProgress` Component

**File**: `src/components/KYC/OnboardingProgress.tsx`

A segmented progress bar showing which onboarding stage the customer is at.

**Props**:
```tsx
interface OnboardingProgressProps {
  stage: OnboardingStage;
  progress: number;  // 0–100
}
```

**Implementation**:
- 5 segments representing stages: `IDENTITY` → `SCREENING` → `RISK_ASSESSMENT` → `APPROVAL` → `COMPLETE`
- Completed stages are filled with `--primary`
- Current stage is filled with `--accent` (teal) and has a subtle pulse
- Future stages are `--bg-elevated` (grey)
- Below the bar: stage labels with the current stage highlighted

Layout: Horizontal flex segments with `border-radius` on first/last. Gap `2px` between segments.

**Acceptance**:
- A customer at stage `SCREENING` (45%) shows IDENTITY filled, SCREENING partially filled with pulse, rest grey
- A customer at `COMPLETE` (100%) shows all 5 segments filled green

---

## 5. UI/UX Design System Mapping

| Concern | Approach |
|---|---|
| **Cards** | Reuse existing `Card` component with `glass` variant for elevated panels |
| **Severity colours** | Reuse `getSeverityStyle` pattern: `--error` for Critical/High, `--warning` for Medium, `--success` for Low |
| **Table styling** | Inline styles matching `AlertQueue.tsx` table pattern exactly |
| **Animations** | `animate-enter` class for page entrance. CSS transitions for progress bars and gauge arcs |
| **Typography** | `Inter` font. Headings: `fontWeight: 600`. Body: `0.875rem`. Muted: `--text-secondary` |
| **Icons** | `lucide-react` — `CheckCircle`, `XCircle`, `Clock`, `MinusCircle`, `UserCheck`, `ArrowLeft`, `Shield` |
| **Responsive** | Two-column grid collapses to single column below `768px` via `@media` query in CSS module |

---

## 6. Execution Order

> **Important:** Each step below is independently implementable and verifiable. Complete each step fully before moving to the next.

| Order | Step | Dependency | Deliverable |
|---|---|---|---|
| 1 | Verify mock data layer | None | Confirm `mockKYCData.ts` compiles cleanly |
| 2 | Route & sidebar wiring | Step 1 | `/kyc` route renders placeholder, sidebar link works |
| 3 | `KYCDashboard.tsx` (list page) | Step 2 | Full customer list with stats and navigation |
| 4 | `KYCDetail.tsx` (detail page skeleton) | Step 2 | Page shell with header, back button, loading state |
| 5 | `RiskScoreGauge.tsx` | None (standalone) | Render inside `KYCDetail` left column |
| 6 | `VerificationBadge.tsx` | None (standalone) | Render 4 instances inside `KYCDetail` left column |
| 7 | `CDDChecklist.tsx` | None (standalone) | Render inside `KYCDetail` right column |
| 8 | `RiskBreakdownChart.tsx` | None (standalone) | Render inside `KYCDetail` left column |
| 9 | `OnboardingProgress.tsx` | None (standalone) | Render inside `KYCDetail` right column + inline in dashboard table |
| 10 | Polish & dark mode verification | Steps 3–9 | Full visual QA pass in light + dark modes |

---

## 7. Open Questions for Review

1. **Inline progress bar in table**: Should the KYC Dashboard table include a miniature `OnboardingProgress` bar inline, or just show the percentage number? (Recommendation: miniature bar for visual impact.)
2. **Filtering strategy**: Should the dashboard support multi-select filters (risk level + entity type + tranche simultaneously), or is single-axis filtering sufficient for V1?
3. **CDD Checklist interactions**: Should the checklist support manual status overrides (e.g. analyst manually marking "Source of Wealth" as COMPLETE), or is it read-only in V1?
