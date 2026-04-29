# Architectural Implementation Plan: FE-301 (SAR/SMR Editor & Review)

## 1. Executive Overview & Technical Strategy
**Task**: Build a powerful, split-pane Suspicious Activity / Matter Report (SAR/SMR) Editor specifically tailored for AUSTRAC/NZ FIU standardizations, driven by Agentic AI drafts.

As the tech lead, the architectural philosophy here is **"Context-First Explainability"**. Compliance officers (MLROs) refuse to just approve AI-generated reports without knowing *where* the AI got its facts. Therefore, our UI must rigidly lock the **Source Evidence** to the **Drafted Narrative**, proving a visual 1:1 mapping so analysts don't have to navigate between different application tabs. 

## 2. Component Architecture

### A. Route Structure
- `/reports/smr/:caseId` — The dedicated workspace for reviewing an AI-prepared SMR.

### B. Core Layout (`SMRWorkspace.tsx`)
A `CSS Grid` defining a hard split-screen view:
- **Left Panel (Grid Column 1: `EvidenceViewer`)**: An un-editable, strictly read-only view of the data the AI Agent consumed to make its decision.
- **Right Panel (Grid Column 2: `NarrativeEditor`)**: The interactive, state-managed form where the AI's drafted paragraphs populate and the analyst edits them.

### C. State Management & Flow
The report has a strict lifecycle matching AUSTRAC requirements:
`AI Draft` ➔ `Analyst Editing` ➔ `Pending MLRO Approval` ➔ `Submitted (Locked)`

We will manage this locally via React `useState` and eventually `Context API` or `Zustand` to prevent accidental data loss if the analyst clicks away before saving.

---

## 3. Step-by-Step Implementation Details

### Step 1: The API Mock Layer (`src/services/mockSMRData.ts`)
Since Backend tasks (BE-301 / BE-303) are running asynchronously, we must strictly define the payload shape. We will mock the `GET /api/v1/cases/:id/smr-draft` to return:
```typescript
interface SMRDraftPayload {
  reportId: string;
  caseId: string;
  status: 'DRAFT' | 'IN_REVIEW' | 'APPROVED' | 'SUBMITTED';
  evidenceContext: {
    transactions: Array<{ id: string, amount: number, date: string, recipient: string, flagged: boolean }>;
    kycAlerts: Array<{ type: string, description: string']>;
  };
  narrativeDraft: {
    suspicionBasis: string;
    transactionDetails: string;
    customerProfile: string;
  };
}
```

### Step 2: The Left Panel - `EvidenceViewer.tsx`
- **Objective**: Display immutable facts.
- **Implementation**: We will build a tabbed component. 
  - **Tab 1: Transactions**: Render a filtered variant of our `Table` component isolating the exact transactions the AI used. 
  - **Tab 2: KYC/PEP Signals**: A display of the customer's risk triggers.
  - **Interaction**: Implementing deep-linking so clicking a transaction ID in the text editor highlights the transaction row in the left panel.

### Step 3: The Right Panel - `NarrativeEditor.tsx`
- **Objective**: Provide an AUSTRAC-compliant form interface.
- **Implementation**: 
  - We won't use a single generic text box. AUSTRAC demands structured reasoning. We will build sectioned textareas matching our `narrativeDraft` interfaces.
  - Incorporate "AI Sparkle" styling indicating that the text was generated via the LLM (e.g., subtle purple borders with a "Drafted by Claude 3.5 Sonnet" badge).
  - Track `isDirty` state when an analyst modifies the AI's original words.

### Step 4: The Approval Workflow Engine (`SMRActionBar.tsx`)
- **Objective**: The floating action bar at the top or bottom of the right panel controlling submission.
- **Implementation**: 
  - Buttons: `Save Draft`, `Request Rewrite (Agent Chat)`, `Submit to AUSTRAC`.
  - The "Submit" button invokes a mock of `BE-303`, transitioning the UI to a loading state, applying a successful checkmark animation, and locking all `Textareas` to `readonly`.

---

## 4. UI/UX Design System Mapping
- **Layout Structure**: We will leverage the CSS `glass` utility built in Phase 1 for elevated panels.
- **Colors**: 
  - Use `var(--text-secondary)` for un-edited AI text.
  - Switch to `var(--text-primary)` once a human edits it (creating a visual shift of ownership).
  - Use our established `Button` component with `variant="success"` for the final submission.

## 5. Next Steps for Execution
1. Create `mockSMRData.ts` to simulate the BE-301 response.
2. Initialize the CSS Grid in a new `SMRWorkspace` page component.
3. Build the `EvidenceViewer` component logic.
4. Construct the `NarrativeEditor` blocks and wiring to mock submission API BE-303.
