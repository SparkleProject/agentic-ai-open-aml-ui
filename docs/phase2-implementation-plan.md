# Frontend Implementation Plan - Phase 2

## Overview
This document outlines the technical implementation plan for Phase 2 of the `agentic-ai-open-aml-ui` frontend. 

Phase 2 focuses on the **Agentic Core UI** — establishing the primary human-in-the-loop workspace where compliance analysts will manage alerts, visualize AI decision-making layers, and interact conversationally with the specialized agents.

## Goal
To implement FE-201, FE-202, and FE-203 with a strong emphasis on Explainable AI (XAI), fluid micro-animations, and dynamic real-time data representation using our established Vanilla CSS design system.

---

## Proposed Execution Steps

### Step 1: FE-202 - Alert Queue & Case Management
> **Goal:** Build the primary analyst workspace for triaging workflow.

- **Route Setup**: Create `/alerts` and `/cases/:id` routes.
- **Components**:
  - `AlertQueueTable`: An advanced data table with built-in filtering, pagination, and color-coded severity badges (using the CSS tokens defined in Phase 1).
  - `CaseWorkspace`: The detailed view for an individual case, incorporating layouts for case summaries, evidence attachments, and manual investigation notes.
- **Mock Data Layer**: Develop a robust JSON mock representing complex FRAML (Fraud + AML) typologies to populate the queue.

### Step 2: FE-201 - XAI "Glass Box" Investigation View
> **Goal:** Visualize the agent's internal "Chain of Thought" and tool invocations transparently.

- **Components**:
  - `InvestigationTimeline`: A vertical, animated timeline tracking the execution trace.
  - `ReActNode`: A specialized UI element representing the Agentic Loop (`Observe` → `Think` → `Plan` → `Act` → `Reflect`).
  - `ToolCallInspector`: An expandable glassmorphism panel revealing raw contextual data (e.g., payloads sent to PEP screening tools or Milvus RAG layers).
- **Design Focus**: Use fluid entrance animations to make the reasoning timeline feel dynamic as steps "resolve".

### Step 3: FE-203 - Agent Chat Interface
> **Goal:** Construct a conversational interface allowing analysts to interrogate the AI agent.

- **Components**:
  - `AgentChatPanel`: A collapsible side-drawer accessible from the `CaseWorkspace`.
  - `MessageThread`: Rich message bubbles differentiating between Analysts and Agents. Provide rendering extensions for markdown or tables directly in the chat output.
  - `TypingIndicator`: Real-time skeleton loaders and smooth scrolling behaviors.
- **Integration**: Prepare the state management to optionally handle WebSocket streams since LLM reasoning outputs are heavily streaming-based.

---

## Verification Plan
1. **Manual UI Testing**: Verify that the `AlertQueueTable` filters function smoothly and the dark mode theme seamlessly applies to the new complex components.
2. **State Walkthrough**: Simulate clicking an alert, viewing the Glass Box timeline, and opening the Chat Panel to ensure the layout remains responsive and doesn't break at laptop viewport bounds.

## Open Questions for Review
1. **Chat Integration Strategy**: Should the initial UI mockup for the Chat Interface (FE-203) support streaming states (typing logic) natively, or is a static message list sufficient before backend wiring?
2. **Charting**: Do we want to incorporate a charting library (e.g., `recharts` or `chart.js`) for the Case Management dashboard to show alert velocity, or stick strictly to CSS grids and custom visualizations for now?
