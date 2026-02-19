# BKT Advisory - Development Guidelines

This document serves as the **source of truth** for maintaining the site's modern aesthetic and complex functionality, including the AI Assistant and Project Estimator.

---

## 1. Project Overview

**Name:** BKT Advisory Marketing & Estimation Platform

**Goal:** A tech-forward marketing site integrated with a complex lead-generation tool (Tech Project Estimator) and an AI Assistant powered by OpenAI.

**Core Tech Stack:**
- React (with TypeScript)
- Tailwind CSS v4.0
- Shadcn UI Components
- Lucide React (Icons)
- OpenAI Responses API (model 4o)
- Supabase Backend (Edge Functions, Auth, Storage)

---

## 2. Design System & UI Standards

### Visual Theme
"Tech-forward" aesthetic using deep gradients (Blue/Indigo), glassmorphism effects, and clean typography.

### Color Palette
- **Primary:** Slate-900 (Dark backgrounds), Blue-600 to Indigo-600 (Gradients/Accents)
- **Text:** Slate-50 for headings on dark backgrounds, Slate-300 for body text
- **Accents:** Blue-500, Indigo-500 for interactive elements

### Typography
- **Important:** Do NOT override default typography settings in `/styles/globals.css` unless specifically requested
- The project has default font sizes, weights, and line-heights configured for each HTML element
- Only apply Tailwind typography classes (`text-2xl`, `font-bold`, `leading-none`) when explicitly needed

### Print Styles
**Crucial:** The site uses specific CSS overrides for printing. All dark backgrounds are forced to white and text to black during PDF generation (`window.print()`).

### Animations
- Use subtle entrance animations (fade-in, slide-up) for sections
- Avoid aggressive motion that distracts from content
- Prefer smooth transitions over jarring effects

### Component Styling Override
Some base Shadcn UI components have default styling (gap, typography) baked in. **Always explicitly set styling information** from these guidelines in generated React components to override the defaults.

---

## 3. Component Architecture

### ScheduleCallButton (`/components/ScheduleCallButton.tsx`)
- **Usage:** Shared component used by all CTA buttons ("Schedule Strategy Call," "Book Strategy Call")
- **Configuration:** Integrates with Google Calendar Appointment Scheduler
- **Variants:** `primary`, `nav`, `footer`, `secondary` for different visual contexts
- **Maintenance:** Update URL in the component's `window.calendar.schedulingButton.load()` call to reflect changes across the entire site instantly
- **Important:** All scheduling CTAs use this single component for consistency

### AI Chatbot (`/components/AIChatbot.tsx`)
- **Behavior:** Persistent floating component accessible site-wide
- **Backend:** Powered by OpenAI Responses API (model o1) with Supabase backend
- **Route Detection:** Detects current page route to customize greetings
- **Estimator Integration:** Contains specific logic to read user intent and generate structured prompts for the Estimator form
- **State Architecture:** Communicates with lifted state in `App.tsx` for real-time form updates

#### UI Behaviors
- **Scrolling:**
  - Independent message scrolling with "hidden-until-hover" scrollbar on desktop
  - Momentum scrolling on mobile
- **Chat Input:**
  - Dynamic textarea that expands up to 4 lines
  - Auto-adjusts height based on content
- **Quick Prompts:**
  - Context-aware prompts based on current page
  - Special prompts for Project Estimator (visible from Step 2+)

#### AI Toolbar Integration
- **Location:** Embedded within Project Estimator's "Project Description" textarea
- **Modes:**
  - **"Generate from Selections"**: Creates project description from selected checkboxes
  - **"Autofill Configuration"**: Parses free-form text to automatically update checkboxes across Steps 2-3
- **Default Behavior:** Defaults to "Nearshore" team configuration when autofilling

### Estimator Tool (`/components/Estimator.tsx`)
- **State Management:** Multi-step form wizard with state lifted to `App.tsx`
- **Data Persistence:** State persists until submission or page refresh
- **PDF Generation:** **Do NOT use html2canvas**. The system relies on native browser printing (`window.print()`) with a dedicated `@media print` CSS block to generate clean quotes
- **AI Integration:**
  - Quick Prompts within Chat Interface (Step 2+ only)
  - Embedded AI Toolbar in "Project Description" field
  - Intelligent autofill that updates checkboxes based on natural language input

#### Lifted State Architecture
- Estimator state is managed in `App.tsx`, NOT within the component itself
- Enables real-time communication between AI Chatbot and form configuration
- AI can read current selections and modify form state directly
- Maintains synchronization between user manual input and AI-driven changes

---

## 4. Development & Contribution

### Adding New Pages
1. Create the component in `/components/` (pages are components in this architecture)
2. Add the route in `App.tsx`
3. Update `Navigation.tsx` (ensure mobile menu is also updated)
4. Consider adding context-aware AI prompts for the new page

### Modifying the Estimator
- When adding new tech stack options, update:
  1. Selection UI in the appropriate step
  2. Cost calculation logic to ensure quotes remain accurate
  3. AI parsing logic to recognize new options in autofill mode
- Maintain consistency with the lifted state pattern in `App.tsx`

### Working with Supabase Backend
- **Server Location:** `/supabase/functions/server/index.tsx`
- **Routes:** All routes must be prefixed with `/make-server-defb8dbd`
- **CORS:** Server responds with open CORS headers
- **Error Handling:** Include detailed error messages with context for debugging
- **Environment Variables:**
  - `SUPABASE_URL`
  - `SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `OPENAI_API_KEY`

### Protected Files
**DO NOT modify these files:**
- `/supabase/functions/server/kv_store.tsx`
- `/utils/supabase/info.tsx`
- `/components/figma/ImageWithFallback.tsx`

---

## 5. Accessibility (A11y) Checklist

### Modals
- Ensure `DialogTitle` and `DialogDescription` are present (even if visually hidden via `sr-only`) for screen readers

### Forms
- All inputs in the Estimator must have associated labels
- Use proper ARIA attributes for multi-step wizards
- Ensure keyboard navigation works throughout the form

### Contrast
- Verify that text over gradient backgrounds maintains a 4.5:1 contrast ratio
- Test with tools like WebAIM Contrast Checker

### Focus Management
- Maintain visible focus indicators on all interactive elements
- Ensure logical tab order through forms and navigation

---

## 6. AI & Estimator Integration Details

### Current Implementation State (Hybrid Architecture)
✅ **Main Chatbot:** Uses `openai.responses.create` (Stored Prompt API) to leverage "Version 15/16" logic directly from OpenAI.
✅ **Scope Refiner:** Uses `openai.chat.completions.create` (Standard API) with **hardcoded system instructions** in `index.tsx`.
* **Reason:** The beta `responses` API caused "Unknown parameter: prompt_id" errors on this specific route.
* **Model:** `gpt-4o` (Temperature: 0.25) for strict formatting.
✅ **Shared Auth:** Both `bktadvisory.com` and `estimator.bktadvisory.com` utilize a single shared `OPENAI_API_KEY` stored in Supabase secrets.

### Key Technical Requirements
* **State Sharing:** Estimator state (checkboxes, text inputs) is lifted to `App.tsx` and exposed to the AI via the `variables` object.
* **Refiner Constraints:** The Scope Refiner enforces strict rules via the system prompt:
  * **No Quotes:** Output must be sanitized of all quotation marks.
  * **Numeric Consistency:** Digits ("2") must be used instead of words ("two").
  * **Strict Headers:** Output maps directly to the "Project Charter" format (Objectives -> Tech Stack -> Problems -> Requirements -> Automations).

---

## 7. Best Practices

### Code Organization
- Keep components focused and single-purpose
- Extract reusable logic into custom hooks
- Use TypeScript for type safety
- Comment complex AI parsing logic

### Performance
- Lazy load routes where appropriate
- Optimize re-renders when working with lifted state
- Debounce AI API calls to avoid excessive requests

### Error Handling
- Provide user-friendly error messages
- Log detailed errors to console for debugging
- Gracefully handle API failures (OpenAI, Supabase)

### Testing Strategy
- Test AI prompt variations manually
- Verify autofill logic with various input formats
- Test print/PDF generation across browsers
- Validate form submission flows end-to-end

---

## 8. Maintenance Notes

### When Updating AI Prompts (CRITICAL)
* **For Main Chatbot:** Update the prompt in the OpenAI Dashboard. Then, simply update the `version` number in `supabase/functions/server/index.tsx` (Chat Route).
* **For Scope Refiner:** You must **MANUALLY COPY** the system instructions from OpenAI and paste them into the `messages` array in `supabase/functions/server/index.tsx` (Refine Route).
* *Note:* Changing the version number alone will NOT update the Refiner logic because it is currently using the fallback method.

### When Modifying Navigation
* **Smart Scroll Logic:** The `Navigation.tsx` component handles routing differently based on context:
  * **On Homepage:** Links to "Work", "Services", etc., trigger a smooth scroll to the section ID.
  * **On Subpages/Estimator:** Links perform a hard navigation to `https://bktadvisory.com/#section-id`.

---

## 9. Known Constraints

* **Beta API Instability:** The `openai.responses.create` method is unstable for the `/refine-scope` route. Do not revert to Stored Prompts for this specific function until the SDK fully supports it.
* **PDF Generation:** Cannot use `html2canvas`; rely on the browser's native `window.print()` functionality.
* **Server Routing:** All backend routes must be prefixed with `/make-server-defb8dbd`.
* **Supabase Secrets:** The Service Role Key must never leak to the frontend.

---

**Last Updated:** February 15, 2026
**Version:** 1.1
