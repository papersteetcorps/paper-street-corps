# 🛠️ System Manifesto: Paper Street Corps
**Project Status:** Production-Ready Static Shell  
**Architecture:** Modular CSS / Component-based HTML / Vanilla JS

---

## 📂 1. Directory Structure
| Path | File | Purpose |
| :--- | :--- | :--- |
| `/` | `index.html` | **Entry Point.** Home page structure & content. |
| `/css` | `main.css` | **Global Brain.** Handles themes, variables, & navigation. |
| `/css` | `home.css` | **Page Skin.** Layout for cards, ethos, and hero sections. |
| `/js` | `theme.js` | **Engine.** Manages Dark/Light mode & mobile menu logic. |
| `/assets/img` | `*` | **Media.** Stores all optimized images and icons. |

---

## 🎨 2. Visual Style & Themes
The site uses **CSS Custom Properties (Variables)** located in `css/main.css`. To change a color globally, update it once in the `:root` (Dark) or `.light-mode` block.



### Color Palette
* **Dark (Navy):** `#000080` background | Yellow unhovered | Green hovered.
* **Light (White):** `#ffffff` background | Orange unhovered | Green hovered.
* **Accent:** Orange (`#ffa500`) used for "Active" underlines and labels.
* **Font:** 'Antonio' (imported via Google Fonts).

---

## 📈 3. Scalability: Adding Content

### Adding Cards (Updates & Suggestions)
The card system uses **CSS Flexbox**. Cards will automatically sit side-by-side and wrap to a new line when the row is full.

**To add a card:**
1. Copy an existing `<div class="update-card">` or `<div class="suggestion-card">`.
2. Paste it within the same `<section>` container.
3. The layout adjusts itself; no CSS changes required.

### Adding Navigation Tabs
1. Open `index.html`.
2. Add a `<li>` to the `.nav-links` list.
3. For dropdowns, follow this structure:
   ```html
   <li class="dropdown">
       <a href="page.html">Title</a>
       <div class="dropdown-content">...links...</div>
   </li>
   ```

---

## ⚙️ 4. Functional Logic (The "Serious" Bits)

### Theme Switching
Handled by `js/theme.js`. It performs three vital roles for production:
1. **Class Toggling:** Swaps the `.light-mode` class on the `<body>` tag to trigger CSS variable shifts.
2. **Persistence:** Saves the user's choice to `localStorage`. This prevents the "flash-bang" effect where a user is hit with a white screen on refresh if they prefer Dark Mode.
3. **State Sync:** Ensures the toggle switch position (checked/unchecked) matches the current theme on page load.

### Navigation Logic
* **Hover vs. Click:** On Desktop, hovering reveals the sub-menu. Clicking the parent tab (e.g., "Typology Tests") redirects the user to the full "List View" page.
* **Mobile Responsiveness:** A Hamburger menu (`☰`) is injected via JavaScript on smaller screens. This prevents the header tabs from overlapping the logo.

---

## 🛡️ 5. Maintenance Best Practices

* **Asset Management:** Store all photos in `assets/img/`. For the best performance, use `.webp` format. Card images should be center-cropped to a **1:1 (Square)** aspect ratio to maintain alignment.
* **Scalable Cards:** When adding new update or suggestion cards, ensure you wrap them in the existing `.updates-container` or `.suggestions-list` divs to maintain the automatic wrapping behavior.
* **New Page Setup:** When creating a sub-page (e.g., `team.html`):
    1. Copy `index.html`.
    2. Keep the `<header>` and `<footer>` (if added) identical.
    3. Move the `class="active"` attribute to the corresponding `<a>` tag in the navigation so the **Orange Underline** appears on the correct tab.
* **Production Deployment:** This folder is ready for "Drag and Drop" deployment on Netlify, Vercel, or GitHub Pages. No build command is required.

---

## 🏗️ 6. Global Components & UI Patterns

### The Auth Modal (Sign-up/Log-in)
The modal is a "Singleton" pattern—one HTML structure handles multiple purposes.
* **Trigger:** Any element with the class `.auth-trigger` will open the modal.
* **Logic:** The JavaScript automatically grabs the text of the button clicked (e.g., "Log-in") and sets it as the modal title.
* **Maintenance:** If you add more input fields (like "Username"), ensure they use the `.input-group` class and the `border-radius: 50px` style to stay consistent with the "oval" design language.

### The Footer Grid
The footer uses a 3-column **CSS Grid** on desktop that collapses into a 1-column list on mobile.
* **Left Column:** Brand identity and mission statement.
* **Middle/Right:** Categorized links.
* **Scaling:** To add a new category, copy a `<div class="footer-links">` block. The grid will automatically handle the spacing.

---

## 🖼️ 7. Asset Specifications (The "Serious" Checklist)

To keep the site looking "Production Ready," all new assets must meet these specs:

| Asset Type | Recommended Size | Format | Note |
| :--- | :--- | :--- | :--- |
| **Card Images** | 800 x 800px | .webp | Maintain 1:1 aspect ratio. |
| **Favicon** | 32 x 32px | .ico / .png | The small icon in the browser tab. |
| **Logo** | Max height 50px | .svg / .png | Transparent background preferred. |

---

## 🛠️ 8. Pre-Deployment Checklist
Before "dragging and dropping" your folder to a host like Netlify:
1.  **Check Links:** Ensure all `<a>` tags have a real file destination (e.g., `tests.html`) instead of `#`.
2.  **Alt Text:** Ensure every `<img>` has an `alt="..."` description for accessibility and SEO.
3.  **Theme Test:** Toggle the theme and refresh the page. If the color stays correct, the `localStorage` logic is working.