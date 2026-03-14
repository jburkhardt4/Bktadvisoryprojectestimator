# BKT Advisory - Project Estimator

## Overview
A React + Vite web application that helps potential clients estimate the scope, timeline, and cost of Salesforce and AI-related consulting projects. It features a multi-step guided form with AI-powered analysis to generate professional service quotes.

## Architecture
- **Frontend**: React 18 + TypeScript, Tailwind CSS, Radix UI components
- **Build Tool**: Vite 6
- **Package Manager**: npm
- **Backend (AI/Functions)**: Supabase Edge Functions (Hono + Deno) for OpenAI integration
- **AI**: OpenAI GPT-4 for document analysis, chat assistance, and scope refinement
- **Document Processing**: mammoth (DOCX), pdfjs-dist (PDF), docx/jspdf (generation)

## Key Features
1. Multi-step project estimation wizard
2. Document upload and AI analysis (RFP/spec parsing)
3. Salesforce/AI service scope builder
4. Team configuration
5. AI-powered quote generation (PDF/DOCX)
6. Floating AI chatbot assistant

## Project Layout
```
src/
  App.tsx                   # Main app entry
  main.tsx                  # React root mount
  components/
    Estimator.tsx            # Core estimation wizard
    Quote.tsx                # Quote result page
    AIChatbot.tsx            # Floating AI assistant
    ui/                      # Radix-based reusable components
    figma/                   # Image components
  supabase/
    functions/server/        # Hono API (Deno) - OpenAI proxy & quote submission
  assets/                    # Images exported from Figma
  styles/                    # Global CSS
  utils/                     # Helpers & Supabase config
  guidelines/                # Design & dev standards
docs/                        # Critical flow documentation
```

## Development
- **Dev server**: `npm run dev` — runs on port 5000 (0.0.0.0)
- **Build**: `npm run build` — outputs to `build/`
- **Workflow**: "Start application" (`npm run dev`)

## Deployment
- Target: Static site
- Build command: `npm run build`
- Public directory: `build/`

## Environment Variables
- Supabase URL and anon key (for Edge Functions)
- OpenAI API key (used within Supabase Edge Functions)
