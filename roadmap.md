# Namutek Logistics Website & Management System — Task Roadmap

- [x] Upload brand logo as CDN asset
- [x] Generate hero (transport) and civil works imagery
- [x] Enable Lovable Cloud & Supabase database integration
- [x] quote_requests table migration (anon insert only)
- [x] Design tokens + fonts (red/black industrial, Bebas Neue + Barlow)
- [x] Favicon from logo; root layout with header/footer + fonts
- [x] Pages: Home, About, Services, Fleet & Sectors, Contact
- [x] Service-specific multi-step quotation booking wizard
- [x] Tappable phone numbers (+260 966 445513, +260 976 699145) + WhatsApp integration
- [x] Unique head() metadata per route

## PRD v1.0 Implementation (Service Booking & Quotation Management)
- [x] Server-authoritative Pricing Engine (`src/lib/pricing/engine.ts`) with line-items, taxes, and instant eligibility
- [x] Comprehensive database domain schema migration (`drizzle/migrations/0002_namutek_platform_schema.sql`) covering requests, quotations, revisions, bookings, assets, work orders, invoices, and payments
- [x] Upgraded server functions (`src/lib/quote.functions.ts` & `src/lib/operations.functions.ts`) with Zod input validation and dual-table fallback
- [x] Public request tracking portal (`src/routes/track.tsx`) with 5-stage progress indicator
- [x] Operations & Management Workspace (`src/routes/admin.tsx`) with 4 KPI queues (New Requests, Awaiting Approval, Today's Bookings, Overdue Invoices) and filterable requests table
- [x] Navigation & Hero integration with primary CTA (Get a Quote) and secondary CTA (Track a Request)
- [x] 10-Role Unified Industrial Dashboard Design System (`src/components/dashboard/`) featuring shared application shell, role switcher, and tailored operational workspaces (Super Admin, MD, Quotation, Sales, Dispatch, Projects, Fleet, Finance, Field Staff, Customer Portal) with backend-enforced RBAC rules.
