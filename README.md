# Research-Buddy 🧠✨
> **Your Intelligent Research Co-Pilot**

![Project Status](https://img.shields.io/badge/Status-Active-emerald?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)
![Stack](https://img.shields.io/badge/Tech-React%20%7C%20Vite%20%7C%20AI-blueviolet?style=flat-square)

**Research-Buddy** is a next-generation research analysis tool designed to deconstruct complex scientific papers into actionable insights. Powered by **Google Gemini 2.0 Flash**, it transforms static PDFs into interactive knowledge graphs, executable code replication, and deep comparative analysis.

---

## 🚀 Key Features

### 🔍 Deep Semantic Analysis
- **Multi-Paper Synthesis**: Upload multiple PDFs to automatically detect commonalities, contradictions, and architectural differences.
- **Interactive Method Pipelines**: Visualizing complex methodologies as dynamic, force-directed graphs using **D3.js**.

### 💻 Automated Code Replication
- **Auto-Coder**: Generates PyTorch/Python implementation code directly from the paper's methodology section.
- **Downloadable Packs**: Export replication scripts (`.py`) and full experiment data (`.json`) with one click.

### 🧪 AI-Driven Experimentation
- **Creative Variants**: The AI suggests novel experimental modifications (e.g., "Speed Demon" or "Efficiency Mod") to improve the paper's results.
- **Impact Prediction**: Estimates the computational cost and accuracy impact of each suggested variant.

### 💬 Context-Aware Chat
- **Research Assistant**: A built-in chat console that "reads" the paper with you, answering technical queries with precise citation context.

---

## 🛠️ Technology Stack

Built with a focus on performance, modern aesthetics, and scalability.

- **Frontend**: [React 19](https://react.dev/), [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (Deep Glassmorphism Design System)
- **AI Engine**: [Google Gemini ](https://deepmind.google/technologies/gemini/) (via Google GenAI SDK)
- **Visualization**: [D3.js](https://d3js.org/) (Force-directed graphs)
- **Infrastructure**: [Docker](https://www.docker.com/), [Google Cloud Run](https://cloud.google.com/run)

---

## 🏁 Getting Started

### Prerequisites
- Node.js 20+
- A Google Gemini API Key

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/research-buddy.git
    cd research-buddy
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment**
    Create a `.env.local` file in the root directory:
    ```env
    VITE_GEMINI_API_KEY=your_api_key_here
    ```

4.  **Run Development Server**
    ```bash
    npm run dev
    ```

---

## 🐳 Docker Deployment

Research-Buddy is containerized for easy deployment to Google Cloud Run or any Docker-compatible host.

```bash
# Build the image
docker build -t research-buddy .

# Run locally (injecting API key)
docker run -p 8080:8080 -e VITE_GEMINI_API_KEY=your_key research-buddy
```

> **Cloud Run Note**: This project uses a runtime environment injection script (`env.sh`) so you can update environment variables in the Cloud Console without rebuilding the image.

---

## 🎨 Design Philosophy

The UI follows a **"Deep Void"** aesthetic—utilizing deep blacks, emerald accents, and glassmorphism to create a futuristic, distraction-free reading environment.

---
