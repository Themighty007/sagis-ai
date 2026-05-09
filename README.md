<div align="center">
  <div style="padding: 1.5rem; background-color: #0F1115; border-radius: 12px; border: 1px solid #2A2D35; display: inline-block;">
    <h1 style="margin: 0; color: #fff; font-size: 2.5rem; letter-spacing: -0.05em;">SAGIS <span style="color: #6366f1;">AI</span></h1>
    <p style="margin: 0; color: #64748b; font-size: 1rem; letter-spacing: 0.1em; text-transform: uppercase;">Student Academic Growth Intelligence System</p>
  </div>
</div>

<br />

<div align="center">
  <img src="https://img.shields.io/badge/React-19.0.0-blue?style=for-the-badge&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.8.2-blue?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4.1.14-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Express-4.21.2-lightgrey?style=for-the-badge&logo=express&logoColor=black" alt="Express.js" />
  <img src="https://img.shields.io/badge/Gemini_AI-Enabled-orange?style=for-the-badge&logo=google&logoColor=white" alt="Gemini AI" />
</div>

<br />

## 🌟 Overview

**SAGIS AI** is an elite, production-ready educational intelligence platform designed to transform raw student academic data into highly actionable, predictive, and prescriptive insights. Built with a modern full-stack architecture, it empowers educators with a "Command Center" to identify at-risk students, understand class-wide cognitive bottlenecks, and orchestrate targeted interventions.

Leveraging the power of **Google Gemini** and **Groq (Llama-3)** models, SAGIS AI synthesizes complex student metrics into clear, terminal-style dossiers and executive-level audits, acting as an automated Senior Educational Data Scientist.

## ✨ Key Features

- **🚀 Live Command Center:** Real-time dashboard displaying Class Health Scores, Growth Velocity, and overarching performance metrics.
- **🚨 Risk Heatmap Engine:** Visual matrix automatically segmenting students into `Critical`, `Warning`, and `Stable` zones based on algorithmic performance thresholds.
- **🧬 Deep Student Dossiers:** Individualized "Learning DNA" profiles featuring:
  - **Cognitive Velocity:** Trend-line analysis of granular chapter scores.
  - **Polar Synthesis:** Radar charts mapping intellectual dominance and vulnerability zones.
  - **Granular Feedback Vault:** Searchable, system-generated diagnostic records.
- **🧠 AI-Powered Inference Engine:** 
  - Generates bespoke "Teacher Intervention Windows" using live LLM inference.
  - Compiles class-wide "Extraordinary Audits" to advise on strategic resource allocation.
- **📊 Synthetic Data Engine:** Automatically seeds highly realistic, normalized academic datasets across 5 core subjects (Math, Science, English, CS, History) with built-in biases for realistic analytical stress testing.

## 🛠️ Technology Stack

| Category | Technologies |
| --- | --- |
| **Frontend** | React 19, TypeScript, Tailwind CSS, Recharts, Framer Motion, Zustand, Lucide React |
| **Backend** | Node.js, Express.js, Multer (for dataset syncing) |
| **AI / LLMs** | `@google/genai` (Gemini 1.5 Flash), `groq-sdk` (Llama-3) |
| **Build & Tooling** | Vite, TSX, TypeScript |

## 🚀 Getting Started

Follow these instructions to spin up the entire intelligence platform locally.

### Prerequisites

- **Node.js** (v18+ recommended)
- API Keys for **Gemini** and **Groq**

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Themighty007/sagis-ai.git
   cd sagis-ai
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Rename `.env.example` to `.env` and inject your API keys:
   ```env
   GEMINI_API_KEY="your_gemini_api_key_here"
   GROQ_API_KEY="your_groq_api_key_here"
   ```

4. **Launch the Platform:**
   ```bash
   npm run dev
   ```
   > SAGIS AI uses `tsx` to run the integrated Express/Vite server. It will automatically generate the synthetic `students.json` dataset on first boot.

5. **Access the Dashboard:**
   Navigate to `http://localhost:3000` in your browser.

## 🏗️ Architecture overview

- **`/src`**: Houses the React frontend.
  - **`App.tsx`**: Main dashboard view, routing, and intelligence modals.
  - **`/components`**: Reusable UI blocks, charts, and the Landing page.
  - **`/store`**: Zustand global state management (`useStore.ts`).
- **`server.ts`**: The Node.js/Express backend that handles API routing, file uploads (`/api/upload`), LLM inference, and serves the built Vite app in production.

## 📦 Building for Production

To compile the application for a production environment:

```bash
npm run build
```
This generates the optimized bundle into the `/dist` directory. The integrated Express server is configured to serve these static assets automatically when `NODE_ENV="production"`.

## 📜 License

This project is licensed under the MIT License.
