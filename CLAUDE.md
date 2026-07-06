# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

StanzSnap is a smart camera app (React Native / Expo SDK 55) for iOS & Android, designed for photography beginners. This repository (`StanzSnapSupport`) is the **official website / landing page** for the app — it is NOT the mobile app codebase. The mobile app lives in a separate repository.

The website has two parts:
- **Static site** in `stanzsnap/` — HTML/CSS/JS user guide pages
- **Node.js backend** in `stanzsnap/server/` — handles the feedback form submission

### Site Structure

```
root/
├── index.html              # Landing page → links to stanzsnap/
├── DEPLOY.md
├── PRIVACY.md
├── README.md
└── stanzsnap/
    ├── intro.html          # Main user guide
    ├── styles.css          # All styles
    ├── privacy.html        # Privacy page
    ├── script.js           # Feedback form → POST to backend API
    └── server/
        ├── package.json    # Express + better-sqlite3
        ├── server.js       # POST /api/feedback, GET /api/health
        ├── feedback.db     # SQLite DB (auto-created)
        └── feedback-*.log  # Daily log files (auto-created)
```

## CSS Architecture

- CSS custom properties for theme tokens (see `:root`)
- Guide sections use: `.guide-block` (flex row with `.guide-number` + `.guide-content`), `.screenshot-placeholder` (dashed border boxes for future screenshots), `.control-bar` (flex container for control items), `.settings-grid`
- All new section styles are in `stanzsnap/styles.css` only

## Feedback Flow

Frontend (`stanzsnap/script.js`) → `POST /api/feedback` → Backend (`stanzsnap/server/server.js`):

1. Backend logs the submission to `feedback.log`
2. **Tries GitHub Issues API first** — creates an issue on `cathywzeng/StanzSnapSupport` with label `feedback`
   - Requires `GITHUB_TOKEN` env var (GitHub Personal Access Token)
   - If successful → log the issue number, **drop the data** (don't dual-store)
3. **GitHub unreachable/fails** → save to SQLite (`feedback.db`) as fallback
4. Always returns `{ success: true }` to the frontend

No message list displayed — users submit feedback silently.

## App Feature Summary (for reference when updating the site)

The StanzSnap mobile app features:
- **AI Composition Guidance**: face positioning, body angle detection, multi-rule composition scoring (golden spiral, symmetry, negative space, clutter, triangle)
- **Pose Detection & Feedback**: MediaPipe Pose-based, 7 dimensions (head tilt, neck, shoulders, body angle, arms, hands, weight distribution), score 0–1
- **Camera Controls**: flash, zoom (1×/2×/3×), HDR, EV slider, portrait blur, burst (3/5 shots), 12 scene presets, AI scene detection
- **Gallery Editor**: highlights/shadows, blur, compare original, crop/rotate/flip
- **Pose Reference (Poser)**: gold-outline silhouettes overlaid on viewfinder, filterable by people count / view / tags
- **Tech Stack**: React Native (Expo SDK 55), MediaPipe Pose, expo-secure-store
