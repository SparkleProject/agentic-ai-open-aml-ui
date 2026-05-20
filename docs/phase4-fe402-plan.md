# Architectural Implementation Plan: FE-402 (Audit Trail Explorer)

## 1. Executive Overview & Technical Strategy

**Task**: Build an Audit Trail Explorer, a searchable interface to filter AI decision logs by date, tenant, agent, case, and model, with functionality to export these logs for regulatory ISO 42001 audits.

**Architectural Philosophy**:
ISO 42001 governance requires an immutable audit trail for every AI decision. Compliance officers and auditors must be able to trace exactly *which* model made a decision, based on *what* input, and the agent's *reasoning chain*. This explorer acts as the "glass box" view into the agentic backend.

---

## 2. Component Architecture

```text
src/
├── pages/
│   └── AuditTrailExplorer.tsx           # Main page orchestrating state
├── components/
│   └── ResponsibleAI/
│       ├── AuditFilterBar.tsx           # Inputs for filtering logs
│       ├── AuditTrailTable.tsx          # Main data table 
│       └── AuditDetailPanel.tsx         # Slide-out panel for deep dive into a specific log (showing prompt/response)
├── services/
│   └── mockAuditTrailData.ts            # Mock data provider for audit logs
```

---

## 3. Data Model Design

**Audit Log Entry**
```typescript
interface AuditLogEntry {
  id: string;
  timestamp: string;
  tenantId: string;
  agentId: string;       // e.g., "CDD-Agent-v2"
  modelId: string;       // e.g., "claude-3-5-sonnet"
  caseId: string;
  action: string;        // e.g., "Generate SMR Narrative", "Screen Sanctions"
  inputTokens: number;
  outputTokens: number;
  latencyMs: number;
  status: 'SUCCESS' | 'ERROR' | 'HUMAN_OVERRIDE';
  details: {
    prompt: string;
    response: string;
    reasoningChain?: string;
  }
}
```

---

## 4. Step-by-Step Implementation

### Step 1: Define Mock Data (`mockAuditTrailData.ts`)
- Create an array of `AuditLogEntry` objects simulating various agent actions (e.g., Sanctions screening, generating SMRs, classifying risk).

### Step 2: Build `AuditFilterBar.tsx`
- Create a horizontal bar with `<input type="text">` for Case ID / Agent ID.
- Add `<select>` dropdowns for Status and Model.
- Add a Date range picker (or simple date inputs).

### Step 3: Build `AuditTrailTable.tsx`
- Create a standard HTML table inside a Card component.
- Display columns: Timestamp, Agent, Model, Case, Action, Status.
- Add an "Inspect" button to each row.

### Step 4: Build `AuditDetailPanel.tsx`
- A side panel (similar to `EntityDetailPanel`) that slides in from the right.
- Displays the raw input prompt, the model's raw response, and the token usage/latency.

### Step 5: Assemble `AuditTrailExplorer.tsx` and Routing
- Combine the components into the main page, handling the filtering state.
- Add an "Export to CSV" mock button.
- Add `<Route path="audit-trail" element={<AuditTrailExplorer />} />` to `App.tsx`.
- Add a sidebar `<NavLink>` to `AppLayout.tsx` under the "Administration" section using the `FileText` or `Database` icon.

---

## 5. UI/UX Design System Mapping

| Concern | Approach |
|---|---|
| **Data Density** | Use a clean, border-collapsed table. Maintain high contrast for readability. |
| **Code Formatting**| Use `<pre><code>` blocks inside the Detail Panel for prompts and JSON responses to ensure they are readable. |
| **Filtering** | Client-side filtering for the mock data, ensuring instant UI updates. |
