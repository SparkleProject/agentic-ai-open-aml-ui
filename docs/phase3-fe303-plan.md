# Architectural Implementation Plan: FE-303 (Corporate Structure Visualiser)

## 1. Executive Overview & Technical Strategy

**Task**: Build a Corporate Structure Visualiser providing an interactive graph of beneficial ownership, UBO (Ultimate Beneficial Owner) paths, and risk indicators for complex entities. 

**Architectural Philosophy**:
For Tranche 2 entities (real estate, legal, accounting), onboarding often involves complex trusts and nested corporate structures. Analysts need to instantly see:
- Who owns what (percentage ownership).
- Who controls what (directorships, trustee roles).
- Where the risk lies (which specific subsidiary or director has a sanctions hit or adverse media).

**Technology Choice**:
We will use **React Flow** (`@xyflow/react`) for the interactive graph. It provides zooming, panning, custom node rendering, and edge routing out-of-the-box, which is essential for complex corporate structures. `dagre` will be used to automatically calculate the hierarchical tree layout.

---

## 2. Component Architecture

```text
src/
├── pages/
│   └── KYCDetail.tsx                # Will be updated to include a "View Corporate Structure" action
├── components/
│   └── KYC/
│       └── CorporateStructure/
│           ├── CorporateVisualiser.tsx   # Main React Flow container
│           ├── EntityNode.tsx            # Custom React Flow node design
│           ├── EntityDetailPanel.tsx     # Slide-out panel for selected node details
│           └── graphLayoutUtils.ts       # Helper for auto-layout (using dagre)
├── services/
│   └── mockCorporateData.ts         # New mock data for the graph
```

---

## 3. Data Model Design

We need a graph data structure representing Entities (Nodes) and Relationships (Edges).

**Node (Entity)**
```typescript
interface CorporateEntity {
  id: string;
  name: string;
  type: 'Corporate' | 'Trust' | 'Individual';
  jurisdiction: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  isUBO: boolean;
  flags: ('PEP' | 'SANCTION' | 'ADVERSE_MEDIA')[];
}
```

**Edge (Relationship)**
```typescript
interface EntityRelationship {
  id: string;
  sourceId: string;
  targetId: string;
  type: 'OWNS' | 'DIRECTS' | 'TRUSTEE';
  percentage?: number; // e.g., 45% ownership
}
```

---

## 4. Step-by-Step Implementation

### Step 1: Install Dependencies
- Run `npm install @xyflow/react dagre` (Dagre is used for automatic hierarchical graph layout).

### Step 2: Define Mock Data (`mockCorporateData.ts`)
- Create a complex mock structure for `CUS-0014` (Pacific Trust & Advisory) featuring a Trust, a Corporate Trustee, and multiple individual beneficiaries (UBOs).
- Ensure one of the directors has an adverse media flag to demonstrate risk surfacing.

### Step 3: Create `EntityNode.tsx` (Custom Node)
- Design a beautiful custom node using our existing `Card` and CSS variables.
- Layout: 
  - Top border color coded by `riskLevel`.
  - Icon based on `type` (Building for Corporate, User for Individual, Shield for Trust).
  - Name and Jurisdiction.
  - Badges for `UBO` or Risk Flags (e.g., a red `! Adverse Media` pill).
- Use React Flow's `<Handle>` components for connection points.

### Step 4: Create `EntityDetailPanel.tsx`
- A side panel (right-aligned) that appears when a node is clicked.
- Shows deep details: Registration numbers, full address, date of birth (for individuals), and detailed risk notes.

### Step 5: Build the `CorporateVisualiser.tsx` Container
- Initialize React Flow with the nodes and edges.
- Use `dagre` to auto-position nodes in a top-down hierarchy (Parent Company -> Subsidiaries -> Individuals).
- Handle `onNodeClick` to open the `EntityDetailPanel`.
- Add a Minimap and Controls (zoom in/out) provided by React Flow.

### Step 6: Integrate into `KYCDetail.tsx`
- Add a button "View Corporate Structure" in the header of `KYCDetail.tsx` that triggers the visualiser.
- Render the visualiser inside a full-screen modal or an expandable section to maximize screen real estate for the graph.

---

## 5. UI/UX Design System Mapping

| Concern | Approach |
|---|---|
| **Graph Library** | `@xyflow/react` for robust panning, zooming, and node rendering. |
| **Auto Layout** | `dagre` for directed acyclic graph layout (hierarchical tree). |
| **Node Styling** | Glassmorphism cards with severity borders (Red for CRITICAL/HIGH, Green for LOW). |
| **Edge Styling** | Smooth step or bezier curves. Animated dashed lines for "Pending" or "Unverified" relationships. |
| **Interactivity** | Hover effects on nodes. Clicking a node highlights its connected edges (ancestors/descendants). |

---

## 6. Open Questions for Review

1. **Dependency Addition**: This plan introduces `@xyflow/react` (React Flow) and `dagre` as new dependencies. Are you comfortable adding these libraries for the graph visualization?
2. **Integration Pattern**: Should the Corporate Visualiser be a full-screen modal triggered from the KYC Detail page, or embedded directly within the KYC Detail page layout? (Recommendation: Full-screen modal to maximize screen real estate).
