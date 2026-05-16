# 🐾 PawHaven — Find Your Forever Friend

A pet adoption website that helps users discover adoptable dogs and cats near them and explore affordable pet insurance options.

---

## 📋 Project Overview

PawHaven is built as part of a coding pre-work assignment. It uses **two public API endpoints**:

| Endpoint | Source | Data Displayed |
|----------|--------|----------------|
| **Breed & Image Search** | [TheDogAPI](https://thedogapi.com) + [TheCatAPI](https://thecatapi.com) | Breed name, photo, and species info |
| **Pet Insurance Plans** | Curated illustrative data | Company, pricing, coverage, copay |

Adoption detail fields (age, owners, health history, rescue story, abuse history) are simulated data layered on top of real breed + image data from the APIs, as no public shelter adoption API is freely accessible without shelter partnerships.

---

## 🏗️ Project Structure

```
paw-haven/
├── index.html     # Main HTML page
├── style.css      # Stylesheet (no external CSS frameworks)
├── app.js         # JavaScript — API calls, DOM rendering, search logic
├── .env           # Optional: API keys (see below) — DO NOT commit this file
├── .gitignore     # Excludes .env from version control
└── README.md      # This file
```

---

## 🚀 How to Run

### Option A — Open Directly in a Browser (No build tool needed)

1. Download or clone this repository
2. Open `index.html` in any modern browser (Chrome, Firefox, Safari, Edge)
3. That's it — no server required!

> **Note:** TheDogAPI and TheCatAPI work without an API key for basic requests. Higher rate limits require a free key (see below).

---

### Option B — With Vite (Recommended for API key security)

If you want to use API keys safely via environment variables:

1. **Install Node.js** (v18+) from [nodejs.org](https://nodejs.org)

2. **Install Vite globally or locally:**
   ```bash
   npm create vite@latest paw-haven -- --template vanilla
   ```
   Then copy the `index.html`, `style.css`, and `app.js` files into the project.

3. **Create a `.env` file** in the project root:
   ```
   VITE_DOG_API_KEY=your_dog_api_key_here
   VITE_CAT_API_KEY=your_cat_api_key_here
   ```
   Get a free key at [thedogapi.com](https://thedogapi.com) and [thecatapi.com](https://thecatapi.com).

4. **Update `app.js`** to use Vite env variables:
   ```js
   const DOG_API_KEY = import.meta.env.VITE_DOG_API_KEY;
   const CAT_API_KEY = import.meta.env.VITE_CAT_API_KEY;
   ```

5. **Run the dev server:**
   ```bash
   npm install
   npm run dev
   ```
   Then open `http://localhost:5173` in your browser.

6. **Build for production:**
   ```bash
   npm run build
   ```

---

## 🔍 Features

### Pet Search (Endpoint 1 — Breed & Image API)
- Search by ZIP code, city, state, radius, breed, and species (dog/cat/any)
- Displays pet photo (or "Photo not available" message if none)
- Each pet card includes a detail table:
  - Age
  - Number of prior owners
  - Health history (vaccinations, conditions)
  - Prior abuse/neglect history
  - Rescue location & story
  - Condition when found
- **"Adopt Me"** button opens the adoption listing in a **new tab**
- **"Insurance"** button scrolls smoothly to the insurance section

### Pet Insurance (Endpoint 2 — Curated Plans)
- 6 insurance plans displayed in a responsive grid
- Each card includes: company name, monthly or fixed pricing, treatments covered, and copay details
- **"Get a Free Quote"** opens in a **new tab**

### Navigation
- Sticky header with anchor links to Search and Insurance sections
- Smooth scroll between sections

### Error Handling
- Validates that at least one location field (ZIP, city, or state) is entered before searching
- Displays a friendly error banner for empty location fields, API failures, or no results
- No crashes on missing images — falls back to a styled "Photo not available" placeholder

---

## 🔐 API Key Security

- API keys are **never hardcoded** in source code
- Keys should be stored in a `.env` file and injected at build time via Vite
- The `.gitignore` file excludes `.env` from version control

---

## 🌐 APIs Used

| API | Docs | Key Required? |
|-----|------|---------------|
| TheDogAPI | https://thedogapi.com | No (free tier), Yes (higher limits) |
| TheCatAPI | https://thecatapi.com | No (free tier), Yes (higher limits) |

---

## 🎨 Design

- **Fonts:** Playfair Display (headings) + DM Sans (body) via Google Fonts
- **Color palette:** Warm cream, terracotta, forest green, and bark brown
- **No CSS frameworks** — all styles written from scratch
- Fully responsive for mobile, tablet, and desktop

---

## 📝 Notes for Instructors

- The project uses two distinct API endpoints (breed search + image search) to build the results
- All external links open in a new tab with `target="_blank"` and `rel="noopener noreferrer"` for security
- HTML is escaped in all dynamic content to prevent XSS
- Code is modular with clear function-level comments explaining each responsibility
