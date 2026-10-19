# Namutek Logistics Website

A client-side React website built with Vite, TypeScript, Tailwind CSS, and TanStack Router. It has no application server, database, authentication, or backend API. The contact form prepares an enquiry for WhatsApp; the visitor sends it themselves.

## Run locally

```sh
npm install
npm run dev
```

Useful commands:

```sh
npm run build
npm run preview
npm run lint
```

## Project layout

```text
index.html              Vite document and default SEO metadata
public/                 Public images, favicon, robots.txt, and sitemap.xml
src/
  main.tsx              React browser entry point
  router.tsx            TanStack Router setup
  routeTree.gen.ts      Generated file-route tree; do not edit manually
  routes/               One page per URL, plus the shared site shell
  components/           Site sections and reusable UI components
  assets/               Images imported and bundled by Vite
  lib/                  Small shared helpers and site/gallery data
  styles.css            Tailwind theme and global styles
vite.config.ts          Vite, React, Tailwind, and route-generation plugins
```

Routes are defined by files in `src/routes`. Add or remove a route there; Vite's TanStack Router plugin updates `src/routeTree.gen.ts`.

Deploy the generated `dist/` folder as a static site. Configure the host to serve `index.html` for unknown paths so direct visits to routes such as `/fleet` work.
