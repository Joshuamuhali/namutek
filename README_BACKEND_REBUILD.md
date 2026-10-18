# Namutek Logistics — Backend Rebuild Reference

Document type: Technical recovery and rebuild specification
Project: Namutek Logistics
Current application: Public-facing company website
Backend status: Removed; future rebuild required
Last documented: 18 October 2026

## 1. Purpose

This document records the backend functionality removed from the Namutek Logistics application during its conversion to a frontend-only public website. It provides a reference for rebuilding the operational system without relying on the previous implementation.

The future backend must be treated as a new implementation. This document describes intended functionality and architectural requirements; it does not guarantee that every feature listed was previously implemented or operational.

## 2. Current Application Scope

The active application is intended to serve as Namutek's public company website.

### Public services retained in scope:
- Freight & Transport
- Building Construction
- Civil Infrastructure
- Fleet & Plant Hire

### Other retained functionality:
- Company information and service pages
- Responsive navigation, animations, SEO metadata and branding
- Contact information, phone links and WhatsApp links
- Public quotation/service enquiry via WhatsApp-based form submission

### Current architecture:
- React 19
- TypeScript
- TanStack Start and TanStack Router
- Vite
- Tailwind CSS 4
- Existing public UI components and styling
- Frontend-based service and quotation enquiry workflows

The current website operates without Supabase credentials, PostgreSQL connections, internal authentication, or operational API services.

## 3. Backend Components Removed

The following backend components were removed from the active application:

| Component | Previous Purpose | Future Rebuild Status |
|-----------|-----------------|----------------------|
| Supabase client integration (`src/integrations/supabase/`) | Database and authentication access | Reimplement |
| PostgreSQL connection layer (`postgres` dependency) | Direct database access | Reimplement if required |
| Drizzle ORM and schema tooling (`drizzle-orm`, `drizzle-kit`, `drizzle.config.ts`) | Typed database queries and schema management | Reimplement if selected |
| Quote request server functions (`src/lib/quote.functions.ts`) | Server-authoritative pricing and service request submission | Reimplement |
| Operations server functions (`src/lib/operations.functions.ts`) | Admin metrics, recent requests, quotation status, request lookup | Reimplement |
| Workflow service (`src/server/domains/workflow.service.ts`) | End-to-end business workflow (requests → quotes → bookings → invoices) | Reimplement |
| Server infrastructure context (`src/server/infrastructure/context.ts`) | Supabase client, RBAC permissions, audit logging, domain events | Reimplement |
| API schemas (`src/server/api/schemas.ts`) | Zod validation schemas for all business operations | Reimplement |
| Internal server functions and API endpoints | Business operations and data access via TanStack Start server functions | Reimplement |
| Authentication and session management | User login, session handling, protected routes | Reimplement |
| Role-based access control | Restrict actions by user role (10 roles) | Reimplement |
| Admin dashboard route (`src/routes/admin.tsx`) | Internal operations workspace | Reimplement |
| Public request tracking route (`src/routes/track.tsx`) | Guest request status lookup by reference | Reimplement |
| Dashboard UI components (`src/components/dashboard/`) | 10-role dashboard workspaces | Reimplement |
| Drizzle schema and migrations (`drizzle/`) | Database schema definitions and migration files | Reimplement |
| Start.ts Supabase auth attacher | Global function middleware for Supabase bearer tokens | Removed (not replaced) |

### Dependencies removed from package.json:
- `@supabase/supabase-js` (was: `^2.117.2`)
- `postgres` (was: `^3.4.9`, devDependency)
- `drizzle-orm` (was: `^0.45.3`, devDependency)
- `drizzle-kit` (was: `^0.31.11`, devDependency)

## 4. Internal Routes and Functionality Removed

The following routes and interfaces are no longer accessible:

- `/admin` — Operations & Management Workspace with 10 role-based dashboards
- `/track` — Public request tracking portal with server function lookup
- All dashboard views: Super Admin, Managing Director, Quotation Officer, Sales Officer, Dispatcher, Project Coordinator, Fleet Manager, Finance Officer, Field Staff, Customer Portal
- All server functions: submitServiceRequestFn, lookupRequestStatusFn, getAdminMetricsFn, getRecentRequestsFn, updateQuotationStatusFn, calculateEstimateFn, submitQuoteRequest
- Navigation links to "/track" and "/admin" removed from public header and footer

## 5. Public Website Functionality Preserved

The following public features remain operational:

- Homepage with hero slider and service overview
- About page with company values, mission, vision, and leadership
- Services page covering Transportation, Logistics, Building Construction, Civil Infrastructure
- Fleet & Plant Hire page with fleet details and sectors served
- Contact page with phone numbers, office location, company details
- Quotation enquiry form (submits via WhatsApp, no database required)
- Credits page for website design attribution
- Responsive navigation, footer, animations, SEO metadata
- WhatsApp enquiry buttons and phone links throughout

### Quotation enquiry workflow (frontend-only):
The public quotation form constructs a WhatsApp message with all enquiry details (service type, origin, destination, contact info, project details) and opens it in WhatsApp (`https://wa.me/...`). No submission is recorded or confirmed by the frontend — the user must manually send the WhatsApp message.

## 6. Backend References Remaining

| Reference | Location | Reason |
|-----------|----------|--------|
| `package-lock.json` | Root | Still contains @supabase/supabase-js, postgres, drizzle-orm, drizzle-kit entries. Will be cleaned up on next `npm install` after package.json changes. |
| `roadmap.md` | Root | Documentation referencing past Supabase implementation milestones. Historical record only, no functional impact. |
| `.env` | Root | Contains SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, VITE_SUPABASE_* variables. No source code references these anymore. Should be cleared before deployment. |