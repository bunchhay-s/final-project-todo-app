# Apple Reminders — Custom Plum & Aqua Edition (INF 651 001)

A responsive, multi-view task management web application inspired by Apple Reminders and styled with a custom 5-color palette (**Deep Midnight Plum**, **Royal Violet**, **Vibrant Amethyst**, **Soft Lavender Lilac**, and **Bright Aqua Mint**).

- **Live Deployed App:** `[Paste your Vercel / Netlify / GitHub Pages URL here]`
- **Course:** INF 651 001 — Front-End Web Development
- **Team Members:** Member 1 (State, Persistence & Smart Views), Member 2 (Routing, Lists & Modals), Member 3 (UI/UX, Custom Palette, Settings & Deployment)

---

## Key Features

1. **6 Distinct Views (`react-router-dom`):**
   - **Overview (`/`):** Smart list summary cards (Today, Scheduled, Flagged, All Active, Overdue), custom list directory, and daily focus preview.
   - **Today (`/today`):** Overdue alert banner paired with reminders due today.
   - **Scheduled (`/scheduled`):** Chronological timeline grouped into Overdue, Today, Tomorrow, Upcoming, and No Due Date.
   - **Flagged & Priority (`/flagged`):** Segmented filter bar for All Focus, Flagged, High (`!!!`), and Medium (`!!`) tasks.
   - **Custom Lists (`/list/:listName`):** Dynamic category folders with custom colors, emoji icons, and inline delete confirmation.
   - **Settings & Data (`/settings`):** Live Light/Dark mode switch, student display name, JSON backup download, completed-task cleanup, and Reset Demo Data.
2. **Full Task & List CRUD:** Create, edit, complete, flag, search, and delete reminders and custom lists through accessible modals.
3. **Browser Persistence (`localStorage`):** Automatically saves tasks, custom lists, list styles, and theme preferences across page reloads.
4. **Dual Theme & Responsive Layout:** Sticky frosted-glass sidebar on desktop, slide-out drawer on mobile, and synchronized Midnight Plum Dark Mode & Soft Lavender Light Mode.

---

## Custom 5-Color Design System

| Color Name | Hex Code | Primary Role |
| :--- | :--- | :--- |
| **Deep Midnight Plum** | `#26124B` | Dark mode canvas, high-contrast button text |
| **Royal Violet** | `#5B2E91` | Elevated cards, light mode accents |
| **Vibrant Amethyst** | `#8A4EC4` | Interactive borders, secondary badges |
| **Soft Lavender Lilac** | `#D499F5` | Secondary typography, light mode sidebar |
| **Bright Aqua Mint** | `#76EAE6` | Primary CTAs, active tabs, completion rings |

---

## Local Setup & Running Instructions

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd <your-project-folder>
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Start the development server:**
   ```bash
   npm run dev
   ```
4. **Build for production:**
   ```bash
   npm run build
   ```