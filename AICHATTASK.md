# OpenRouter AI Chat Assistant - Implementation Plan

This is the detailed, markable task plan for building and integrating the `@openrouter/agent` powered chat widget for Pasha International Food & Bar.

## Phase 1: Setup & Initialization
- [x] Install required dependencies: `@openrouter/agent`, `lucide-react` (for icons).
- [x] Configure Environment Variables: Add `OPENROUTER_API_KEY`, `SUPABASE_URL`, and `SUPABASE_ANON_KEY` to `.env.local`.
- [x] Initialize Supabase client in the Next.js project.

## Phase 2: Database Schema (Supabase)
- [x] Create/Verify `menu` table (columns: id, name, description, price, category, image_url).
- [x] Create `reservations` table (columns: id, name, email, date, time, party_size, status, created_at).
- [x] Create `complaints` table (columns: id, name, email, message, status, created_at).
- [x] Set up basic Row Level Security (RLS) policies allowing public inserts for reservations and complaints, and public reads for the menu.

## Phase 3: OpenRouter Agent Backend (Next.js API Route)
- [x] Create the API Route endpoint (e.g., `app/api/chat/route.ts`).
- [x] Define the Agent System Prompt: Establish the persona (luxurious, polite, helpful restaurant assistant).
- [x] Implement Agent Tool: `getOpeningHours` (Returns hardcoded or DB-driven schedule).
- [x] Implement Agent Tool: `getMenuPrices` (Queries Supabase `menu` table for dish details and prices).
- [x] Implement Agent Tool: `bookReservation` (Inserts a new record into the Supabase `reservations` table).
- [x] Implement Agent Tool: `fileComplaint` (Inserts a new record into the Supabase `complaints` table).
- [x] Implement Agent Tool: `getRecommendations` (Uses LLM reasoning combined with the menu data to suggest dishes).
- [x] Hook the tools into the `@openrouter/agent` instance and process the chat loop.

## Phase 4: Frontend Chat Widget UI
- [x] Create `ChatWidget.tsx` component (Floating button in the bottom right corner).
- [x] Implement the Chat Window UI (Header, Message List, Input Field).
- [x] Apply luxury styling (Dark mode surfaces, gold/brass accents, sleek typography) matching the `DESIGN.md`.
- [x] Implement message state management (handling user inputs and streaming/waiting for agent responses).
- [x] Add loading indicators (e.g., "The assistant is typing...").
- [x] Render Markdown in the chat window (to gracefully display lists of menu items or bold text).

## Phase 5: Integration & Testing
- [x] Embed the `<ChatWidget />` globally in the Next.js root `layout.tsx`.
- [x] Test Flow 1: Ask for opening hours and general restaurant information.
- [x] Test Flow 2: Ask for the price of "Pacha Lamb" and other menu items.
- [x] Test Flow 3: Complete a table reservation booking through the chat.
- [x] Test Flow 4: Submit a test complaint and verify it appears in the Supabase database.
- [x] Test Flow 5: Ask for a vegetarian/special recommendation to test the agent's logic.

---
*Note: Use `[x]` to mark tasks as completed, and `[/]` for tasks currently in progress.*
