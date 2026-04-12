# Frontend Implementation Plan - Phase 1

## Overview
This document outlines the technical implementation plan for Phase 1 of the `agentic-ai-open-aml-ui` frontend, mapping directly to the requirements defined in the `agentic-ai-open-aml` development plan. 

Phase 1 establishes the **Multi-Tenant Foundation**, specifically focusing on the **Design System & Shell (FE-102)** and the **Tenant Configuration Portal (FE-101)**.

## Goal
Establish a premium, highly responsive frontend architecture that supports tenant configuration and provides a robust foundation for future agentic AI workflows. The design will emphasize rich aesthetics, custom styling, and modern web interaction patterns.

> [!IMPORTANT]
> The primary focus of this phase is to build the "chassis" of the frontend application. It must be beautiful, scalable, and fully prepared to integrate with the multi-tenant APIs developed by the backend team.

## Proposed Tech Stack
- **Framework**: React with TypeScript (via Vite for fast, modern builds)
- **Styling**: Vanilla CSS (CSS Modules) to allow maximum flexibility, dynamic animations, and meticulous control over the premium design aesthetic. 
- **Routing**: `react-router-dom`
- **State Management**: React Context / Zustand (for simple global states like user sessions and theme)
- **Icons**: `lucide-react` 

## Execution Steps

### Step 1: Project Initialization & Structure
- Initialize the Vite React-TS project directly in the repository root.
- Establish the scalable directory structure:
  - `src/components`: Reusable UI elements (cards, buttons, inputs).
  - `src/layouts`: The application shell (sidebars, headers).
  - `src/pages`: Distinct page views (e.g., Risk Configuration, User Management).
  - `src/styles`: Global CSS variables, animations, and design tokens.
  - `src/hooks`: Custom React hooks (e.g., `useTheme`).
  - `src/services`: API abstraction layer for backend integration.

### Step 2: FE-102 - Design System & Shell
- **Theming & Variables**: 
  - Define sleek dark/light mode CSS variables using HSL color space. 
  - Implement modern typography integrations (e.g., `Inter` or `Geist`).
- **Core Components**:
  - Build foundational UI elements from scratch to ensure a state-of-the-art feel: `Button`, `Card`, `Slider`, `Select`, `Table`, and `Modal`.
  - Bake in micro-interactions: smooth gradients, glassmorphism panel effects, and hover animations.
- **Application Shell (`AppLayout`)**:
  - Responsive sidebar with navigation categories (Dashboard, Alerts, Configuration, Team).
  - Header with dynamic breadcrumbs, user profile dropdown, and a theme toggle.
  - Main functional area with smooth entrance transitions.

### Step 3: FE-101 - Tenant Configuration Portal
- **Routing Setup**: Implement paths like `/admin/config` and `/admin/users`.
- **Risk Appetite Settings**: 
  - Implement a dedicated dashboard view using a custom `Slider` component to adjust AML and Fraud risk thresholds.
- **Model Selection & Cost Thresholds**: 
  - Create interactive, selectable cards for assigning AI models (e.g., Claude 3.5 Sonnet, Titan).
  - Provide localized input forms for setting budgetary token thresholds and configuring cost alerts.
- **User Management View**: 
  - Develop a data table to view, add, modify, and delete tenant users.
  - Include role-based access control (RBAC) designations (Admin, Compliance Officer, Analyst, Auditor) via form selections.

## Quality & Automation Setup
- Strict TypeScript configurations for all properties and API responses.
- Implement code-splitting based on routes to optimize performance.
- Linting using ESLint and Prettier integrated from day one.
- Meaningful semantic HTML tags and ARIA attributes for accessibility.

> [!TIP]
> By focusing on Vanilla CSS rather than an opinionated utility framework, we guarantee a bespoke look that feels deeply native to the Agentic AML use case and stands out from generic dashboards.

## Open Questions for Review
1. **Design Inspiration**: Do we have specific brand colors (e.g., specific blues/purples for AI branding) to be used as the primary HSL tokens, or should a premium palette be proposed?
2. **Mock APIs**: Should we mock the backend APIs for Phase 1 inside the UI repository to unblock development before the Python backend is completed?

> [!NOTE]
> Once this plan is approved, we will proceed immediately with Step 1 (Project Initialization).
