# Tree of Life Global Missions Web Platform

Official website and digital ministry platform for **Tree of Life Global Missions** (Bryan & College Station, TX). Reaching international students, scholars, and local communities with the gospel of Jesus Christ.

---

## 🌟 Key Features

- **Multi-Page Architecture**: Fast, accessible, and responsive multi-page layout built for all viewports (Mobile, Tablet, Desktop).
- **Staff Photo Archive & Gallery**:
  - Live photo grid with Instagram-style color filter presets (`Normal`, `Clarendon`, `Juno`, `Warm`, `Vintage`, `B&W`).
  - Interactive lightbox view with metadata, locations, and timestamps.
- **Supabase Cloud & Hybrid Storage Engine**:
  - Direct client-side connection to Supabase PostgreSQL and Storage buckets (`mission-photos`).
  - Local hybrid fallback engine ensuring persistent offline/preview functionality during development.
- **Role-Based Access Control (RBAC)**:
  - Staff & Admin authentication modal for media staff and ministry directors.
  - Safe client-side permission gates for photo uploads and content updates.
- **Interactive Ministries & Campus Sections**:
  - Highlights for International Student Ministries, Blinn College & Texas A&M Campus Fellowship, Downtown Outreach, and Bible Distribution.

---

## 🛠️ Tech Stack

- **Frontend**: Semantic HTML5, Vanilla CSS3 (Custom Design System: Deep Forest Green `#123625`, Warm Sand `#FAF7F2`, Accent Amber `#C96623`), Modern Vanilla JavaScript (ES6+).
- **Database & Storage**: [Supabase](https://supabase.com/) (PostgreSQL + Cloud Storage Buckets).
- **Icons & Typography**: FontAwesome 6.5.1, Pretendard WebFont.

---

## 🚀 Getting Started

### Local Development
To run the project locally on any web server:

```bash
# Python 3 built-in server
python3 -m http.server 3030

# Open in browser:
# http://localhost:3030
```

### Supabase Cloud Setup
Refer to [SUPABASE_SETUP.md](SUPABASE_SETUP.md) for step-by-step instructions on setting up your free database and media bucket.

---

## 📜 License & Copyright
&copy; 2026 Tree of Life Global Missions. All Rights Reserved.  
Bryan, Texas • 501(c)(3) Non-Profit
