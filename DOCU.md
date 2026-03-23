# Sunset Portfolio — Documentation Page

## What was built

A static visual architecture documentation page accessible at `/docu` from anywhere in the app.

---

## 1. Footer Link (`app.component.html`)

Added an `article` Material icon link **beside** the Facebook icon in the fixed bottom-right widget.

- Uses `routerLink="/docu"` (internal navigation)
- Icon: `article` (Material ligature)
- Same style as existing social icons (`text-gray-400 hover:text-gray-600`)
- `RouterLink` added to `AppComponent` imports

---

## 2. Route (`app.routes.ts`)

```
/docu  →  DocuComponent  (lazy-loaded)
``` 

Top-level route, no layout shell — fully standalone page.

---

## 3. Component (`src/app/utilities/docu/`)

| File | Purpose |
|------|---------|
| `docu.component.ts` | Standalone component, imports: CommonModule, RouterLink, MatIconModule |
| `docu.component.html` | Visual documentation template |
| `docu.component.scss` | Dark background host + connector line helpers |

---

## 4. Page Sections

### CI/CD Pipeline
Horizontal card flow showing the full deploy chain:
```
Git Push → Version Bump → Docker Build → Docker Hub → SSH Deploy
```
- Each card has a colored border indicating its category
- Commit prefix `[patch]` / `[minor]` / `[major]` controls semver bump

### Runtime Architecture (nested borders)
```
┌─ Server Environment ──────────────────────────────┐
│  ┌─ Docker (blue #2496ED) · sunset-angular ──────┐ │
│  │  port 4000:80                                  │ │
│  │  ┌─ Nginx Alpine (green) · port 80 ──────────┐ │ │
│  │  │  try_files for HTML5 routing               │ │ │
│  │  │  ┌─ Angular 17 (indigo) ────────────────┐  │ │ │
│  │  │  │  Vex · Tailwind · Angular Material   │  │ │ │
│  │  │  │  ┌─ Auth ─┐ ┌─ Guest ─┐ ┌─ Dash ─┐  │  │ │ │
│  │  │  │  └────────┘ └────────┘ └────────┘  │  │ │ │
│  │  │  └────────────────────────────────────┘  │ │ │
│  │  └───────────────────────────────────────────┘ │ │
│  └───────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────┘
```

### Feature Modules
Cards for: Budget, Physical, Auth, Profile, Error Pages, Documentation.

### Tech Stack
Pill badges: Angular 17, Vex, Tailwind, Angular Material, Node 18, Nginx, Docker, GitHub Actions, RxJS, TypeScript.

---

## Design Decisions

- **Dark theme** (`bg-slate-900`) — standalone page, no Vex layout shell
- **Monospace font** — reinforces technical/docs feel
- **Nested colored borders** exactly as requested: Docker = `#2496ED`, Nginx = green, Angular = indigo, inner modules = orange/blue/purple
- **No data fetching** — fully static
- **Back link** → `/guest/home` in header and footer
