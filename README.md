# 📊 Capital Structure Studio

> A modern, interactive **Capital Structure Analysis Calculator & Educational Tool** for finance students, professors, corporate finance analysts, and business decision-makers.

[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.x-purple.svg)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8.svg)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 🌟 Overview

**Capital Structure Studio** helps users analyze and compare how different debt, equity, and preference capital mixes impact a company's **Earnings Per Share (EPS)** and financial risk profile. 

It functions as both a **precision financial calculator** and an **interactive learning lab**, featuring:
* Real-time EBIT–EPS analysis
* Break-even / Indifference Point solver
* Side-by-side financing plan comparisons
* Sensitivity analysis matrices
* Mathematical step-by-step formula breakdowns
* Dynamic SVG / Canvas charts
* Interactive knowledge quiz with instant feedback

---

## 🚀 Key Modules & Features

### 1. 📊 EBIT–EPS Analysis
* **Dynamic Operating Profit Controls**: Adjust EBIT using direct number inputs, quick step buttons (`-50k`, `-10k`, `+10k`, `+50k`), or an interactive range slider.
* **Corporate Tax Shield**: Toggle corporate tax rates ($T$) with one-click presets (25%, 30%, 35%, 40%).
* **Financing Plan Cards**: Visualize capital breakdown bars (Debt %, Equity %, Preference Capital %), share count ($N$), and interest expense ($I$).
* **Master Summary Table**: Displays EBIT, Interest, EBT, Tax, PAT, Preference Dividend, Shares, **EPS**, D/E Ratio, and Financial Break-even point.
* **Interactive EBIT–EPS Trajectory Chart**: Multi-line SVG chart plotting EPS curves across EBIT levels, with markers for indifference points and financial break-even points.

### 2. ⚖️ Break-Even EBIT & Indifference Point Analyzer
* **Pairwise Comparison**: Select any two capital structures (e.g., Plan A: All Equity vs Plan B: Debt + Equity).
* **Exact Mathematical Equality**:
  $$\frac{(EBIT - I_1)(1 - T) - PD_1}{N_1} = \frac{(EBIT - I_2)(1 - T) - PD_2}{N_2}$$
  $$EBIT^* = \frac{N_2 [I_1(1-T) + PD_1] - N_1 [I_2(1-T) + PD_2]}{(N_2 - N_1)(1-T)}$$
* **Textbook Explanations**:
  > *“At an EBIT of ₹X, both financing alternatives generate the same EPS of ₹Y. This is the EBIT–EPS indifference point.”*
* **Dynamic Decision Guidance**:
  * **EBIT > Indifference EBIT:** Leveraged plan is optimal due to favorable financial leverage ("Trading on Equity").
  * **EBIT < Indifference EBIT:** Conservative/equity plan is optimal to minimize fixed financial risk.
* **All-Pairs Indifference Matrix**: Automatically evaluates all plan combinations when $\ge 3$ plans exist.

### 3. 🔄 Financing Plan Comparison Dashboard
* **Capital Structure Donut Charts**: Pie/donut charts displaying Debt, Equity, and Preference proportions.
* **Comparative EPS Bar Chart**: Direct visual EPS comparison at the current EBIT.
* **Detailed Financial Statements**: Full side-by-side income statement breakdowns with debt-equity ratios ($D/E$), degree of financial leverage ($DFL$), and interest coverage ratios ($ICR$).

### 4. 📈 Sensitivity Analysis
* **Configurable Scenarios**: Preloaded with textbook levels (₹50k, ₹75k, ₹100k, ₹125k, ₹150k) plus custom point creation.
* **Highlighting**: Flags the best-performing plan at every operating income tier.
* **Multi-Line Sensitivity Chart**: Displays trajectories across various operational scenarios.

### 5. 🎓 Educational Learning Lab & Formula Guide
* Explanations of capital structure concepts, financial risk, and interest tax shields.
* Interactive formula reference sheet with LaTeX notation.
* 5-question self-assessment quiz with detailed explanations and score tracking.

### 6. 📜 History, Multi-Currency & Data Export
* **Currency Switcher**: Supports **₹ Indian Rupee (INR)**, **$ US Dollar (USD)**, **€ Euro (EUR)**, and **£ British Pound (GBP)**.
* **Persistence**: Saves scenarios in `localStorage`.
* **Export**: Export scenario data to **CSV** or print structured financial reports.

---

## 📐 Financial Formulas Reference

| Metric | Formula |
| :--- | :--- |
| **Earnings Per Share (EPS)** | $$EPS = \frac{(EBIT - I)(1 - T) - PD}{N}$$ |
| **EBIT Indifference Point ($EBIT^*$)** | $$EBIT^* = \frac{N_2 [I_1(1-T) + PD_1] - N_1 [I_2(1-T) + PD_2]}{(N_2 - N_1)(1-T)}$$ |
| **Financial Break-Even EBIT** | $$EBIT_{BE} = I + \frac{PD}{1 - T}$$ |
| **Degree of Financial Leverage (DFL)** | $$DFL = \frac{EBIT}{EBIT - I - \frac{PD}{1 - T}}$$ |
| **Interest Coverage Ratio (ICR)** | $$ICR = \frac{EBIT}{Interest}$$ |

---

## 💻 Tech Stack

* **Frontend**: React 19, TypeScript
* **Build Tool**: Vite 6+
* **Styling**: Tailwind CSS v4
* **Charts**: Recharts & Pure HTML5 Canvas
* **Icons**: Lucide React
* **Testing**: Node test runner with 100% mathematical precision

---

## 🛠️ Getting Started

### Prerequisites
* [Node.js](https://nodejs.org/) (v18 or newer)
* [npm](https://www.npmjs.com/)

### Installation & Local Setup

```bash
# 1. Clone the repository
git clone https://github.com/your-username/capital-structure-app.git

# 2. Navigate to the project directory
cd capital-structure-app

# 3. Install dependencies
npm install

# 4. Start development server
npm run dev
```

Open your browser at **`http://localhost:5173/`**.

### Production Build

```bash
# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 📦 Standalone No-Build Edition (Zero Dependencies)

If you need a standalone version that runs offline without Node.js or npm, a ready-to-run bundle is located in the [`standalone/`](standalone/) directory:
* [`standalone/index.html`](standalone/index.html) - Complete HTML layout
* [`standalone/style.css`](standalone/style.css) - Standalone CSS stylesheet
* [`standalone/app.js`](standalone/app.js) - Complete standalone JavaScript engine & canvas charting
* [`standalone/CapitalStructureCalculator.cs`](standalone/CapitalStructureCalculator.cs) - C# .NET class library implementation

Simply double-click `standalone/index.html` in File Explorer or upload to any static hosting service (GitHub Pages, Netlify, Vercel).

---

## 📁 Repository Structure

```
capital-structure-app/
├── index.html                  # App entry HTML
├── package.json                # Project dependencies and scripts
├── vite.config.ts              # Vite configuration
├── tsconfig.json               # TypeScript configuration
├── src/
│   ├── main.tsx                # React root mount
│   ├── App.tsx                 # Main application state and tab routing
│   ├── index.css               # Tailwind CSS v4 directives & styling
│   ├── types/
│   │   └── finance.ts          # TypeScript type definitions
│   ├── utils/
│   │   ├── financialFormulas.ts# Pure financial formula engine
│   │   ├── formatters.ts       # Currency and number formatting
│   │   └── storage.ts          # LocalStorage and presets manager
│   └── components/
│       ├── common/
│       │   └── Navbar.tsx      # Navigation header & currency picker
│       ├── EbitEpsAnalysis/
│       │   ├── EbitEpsView.tsx # Main EBIT-EPS calculator
│       │   ├── EbitEpsChart.tsx# Interactive multi-line Recharts graph
│       │   ├── PlanTable.tsx   # Results table
│       │   └── PlanEditorModal.tsx # Plan creation/edit modal
│       ├── IndifferenceAnalysis/
│       │   └── IndifferenceView.tsx # Indifference point solver
│       ├── ComparePlans/
│       │   └── CompareView.tsx # Comparison dashboard & donut charts
│       ├── Sensitivity/
│       │   └── SensitivityView.tsx # Multi-tier sensitivity analysis
│       ├── StepByStep/
│       │   └── StepByStepModal.tsx # Educational formula breakdown
│       ├── LearningLab/
│       │   └── LearningLabView.tsx # Concepts guide & quiz
│       └── History/
│           └── HistoryView.tsx # Calculation history & CSV export
└── standalone/                 # No-build portable edition
    ├── index.html
    ├── style.css
    ├── app.js
    └── CapitalStructureCalculator.cs
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/your-username/capital-structure-app/issues).

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
