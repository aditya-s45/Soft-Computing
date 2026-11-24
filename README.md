# FuzzyCraft: Interactive Fuzzy Logic Controller (FLC) & Mamdani Stepper

> **Subject:** Soft Computing (CS-401 / Professional Elective)  
> **Degree Program:** B.Tech Computer Science & Engineering  
> **Topic:** Fuzzy Logic Controller (FLC) — Mamdani Fuzzy Inference System & Centroid Defuzzification  
> **Textbook Benchmark Reference:** Timothy J. Ross, *Fuzzy Logic with Engineering Applications*, 3rd/4th Edition, Chapter 5; S.N. Sivanandam & S.N. Deepa, *Principles of Soft Computing*, Wiley India, Chapter 7 (Fuzzy Logic Controller, pp. 230–265).  
> **Submission Deadline:** 24 November 2026  
> **Team Size:** Max 2 Members  

---

## 🌟 Executive Overview & Public Links

**FuzzyCraft** is a clean, browser-based, interactive educational studio built to teach **Fuzzy Logic Controllers (FLC)** from first principles. Designed with an intuitive, visual-first interface inspired by [VisuAlgo](https://visualgo.net/en/), it eliminates confusing clutter and demonstrates the complete mathematical pipeline:

$$\text{Crisp Inputs} \xrightarrow{\text{Fuzzification}} \text{Fuzzy Sets} \xrightarrow{\text{Mamdani Inference}} \text{Clipped Rules} \xrightarrow{\text{Aggregation}} \text{Composite Area} \xrightarrow{\text{Defuzzification}} \text{Crisp Output}$$

- **🚀 Public Deployment (GitHub Pages):** [https://aditya-s45.github.io/Soft-Computing/](https://aditya-s45.github.io/Soft-Computing/)  
  *(Served directly from the repository's `/docs` directory with 0 build steps)*
- **📂 GitHub Repository:** [https://github.com/aditya-s45/Soft-Computing](https://github.com/aditya-s45/Soft-Computing)
- **📦 Zero-Config Offline Ready:** The pre-bundled production distribution is located in `dist/` and `docs/`. Simply open `docs/index.html` in Google Chrome, Microsoft Edge, or Mozilla Firefox without running any server.
- **💻 Local Development Server:** Run `npm run dev` to launch the Vite development server at `http://localhost:5173/` or `npm run preview` at `http://localhost:4173/`.

---

## 🎯 What the Tool Does & Why It's Simple to Explain

Unlike complex multi-page applications with dozens of confusing menus, **FuzzyCraft** keeps everything on a single, clear, reactive dashboard:

1. **Pick a Problem & Change Parameters:**
   - **Problem 1 (Textbook Benchmark):** *Restaurant Gratuity / Tipping Controller*  
     Inputs: **Service Quality** ($[0, 10]$) and **Food Quality** ($[0, 10]$) $\implies$ Output: **Tip Percentage** ($[0, 25\%]$).
   - **Problem 2 (Industrial Automation):** *Smart Washing Machine Controller*  
     Inputs: **Dirtiness Level** ($[0, 100\%]$) and **Grease Level** ($[0, 100\%]$) $\implies$ Output: **Wash Time** ($[0, 60\text{ mins}]$).
   - **Real-Time Responsiveness:** Move any input slider, and the membership graphs, rule firing bars, aggregated shape, and centroid line update instantaneously.

2. **Step Through the Algorithm (Play, Pause, Step, Reset):**
   - The top pipeline dock breaks the controller down into 5 sequential phases:
     - **Phase 1: Crisp Inputs** (Reading exact sensor measurements)
     - **Phase 2: Fuzzification** (Evaluating triangular/trapezoidal membership functions $\mu(x) \in [0, 1]$)
     - **Phase 3: Mamdani Rules** (Applying fuzzy AND ($\min$) or fuzzy OR ($\max$) and clipping output shapes)
     - **Phase 4: Aggregation** (Combining all clipped shapes via fuzzy union ($\max$))
     - **Phase 5: Defuzzification** (Calculating the Center of Gravity / COG balance line)
   - Controls include `AUTO PLAY`, `PAUSE`, `Next Phase`, `Prev Phase`, `Reset`, and a speed slider.

3. **Visualized on Screen with Plain-Language Explanations:**
   - Every phase has an accompanying explanation card that translates the abstract mathematics into plain English and renders the exact LaTeX equations.

4. **100% Checked Against Textbook Hand Calculation:**
   - Click the **"Load Textbook Benchmark"** button to load the canonical benchmark values ($\text{Service} = 7.0, \text{Food} = 8.0$).
   - A dedicated **Hand Calculations Window** proves line-for-line that the simulator output ($16.8\%$) matches the manual textbook calculation.

---

## 📐 Mathematical Formulation & Hand Calculation Proof

### 1. Fuzzification (Piecewise Membership Functions)
For a triangular membership function with vertices $(a, b, c)$:
$$\mu_A(x) = \begin{cases} 
0 & x \le a \text{ or } x \ge c \\
\frac{x - a}{b - a} & a < x \le b \\
\frac{c - x}{c - b} & b < x < c 
\end{cases}$$

For a trapezoidal membership function with vertices $(a, b, c, d)$:
$$\mu_A(x) = \begin{cases} 
0 & x \le a \text{ or } x \ge d \\
\frac{x - a}{b - a} & a < x < b \\
1 & b \le x \le c \\
\frac{d - x}{d - c} & c < x < d 
\end{cases}$$

### 2. Mamdani Rule Firing Evaluation
- **Fuzzy AND (Intersection / Zadeh t-norm):** $\alpha = \min(\mu_A(x_1), \mu_B(x_2))$
- **Fuzzy OR (Union / s-norm):** $\alpha = \max(\mu_A(x_1), \mu_B(x_2))$
- **Mamdani Implication (Clipping):** $\mu_{\text{clipped}}(z) = \min(\alpha, \mu_{\text{output}}(z))$

### 3. Rule Aggregation
$$\mu_{\text{agg}}(z) = \max_{k=1}^R [ \mu_{\text{clipped}, k}(z) ]$$

### 4. Defuzzification (Centroid Method / Center of Gravity)
$$z^* = \frac{\int z \cdot \mu_{\text{agg}}(z) \, dz}{\int \mu_{\text{agg}}(z) \, dz} \approx \frac{\sum_{i=1}^n z_i \cdot \mu_{\text{agg}}(z_i)}{\sum_{i=1}^n \mu_{\text{agg}}(z_i)}$$

---

### 📊 Step-by-Step Textbook Hand Calculation vs Live Simulator

*Reference: Timothy J. Ross, "Fuzzy Logic with Engineering Applications", Chapter 5; S.N. Sivanandam & S.N. Deepa, Chapter 7.*  
**Test Inputs:** $\text{Service Quality} = 7.0$, $\text{Food Quality} = 8.0$.

| Step | Mathematical Hand Calculation | Live FuzzyCraft Simulator Output | Verification Status |
| :--- | :--- | :--- | :---: |
| **Step 1: Fuzzification** | • $\text{Service} = 7.0$:<br>&nbsp;&nbsp;$\mu_{\text{Poor}}(7.0) = 0.00$<br>&nbsp;&nbsp;$\mu_{\text{Good}}(7.0) = \frac{9 - 7}{9 - 5} = \mathbf{0.50}$<br>&nbsp;&nbsp;$\mu_{\text{Excellent}}(7.0) = \frac{7 - 6}{8.5 - 6} = \mathbf{0.40}$<br>• $\text{Food} = 8.0$:<br>&nbsp;&nbsp;$\mu_{\text{Bad}}(8.0) = 0.00$<br>&nbsp;&nbsp;$\mu_{\text{Delicious}}(8.0) = \mathbf{1.00}$ | • $\mu_{\text{Poor}} = 0.00$<br>• $\mu_{\text{Good}} = 0.50$<br>• $\mu_{\text{Excellent}} = 0.40$<br>• $\mu_{\text{Bad}} = 0.00$<br>• $\mu_{\text{Delicious}} = 1.00$ | **✓ Exact Match** |
| **Step 2: Rule Firing Strengths** | • **Rule 1 (OR):** $\max(\mu_{\text{Poor}}, \mu_{\text{Bad}}) = \max(0.0, 0.0) = \mathbf{0.00}$ (Inactive)<br>• **Rule 2:** $\mu_{\text{Good}} = \mathbf{0.50}$ (Fired)<br>• **Rule 3 (OR):** $\max(\mu_{\text{Excellent}}, \mu_{\text{Delicious}}) = \max(0.40, 1.00) = \mathbf{1.00}$ (Fired) | • $\alpha_1 = 0.00$ (Inactive)<br>• $\alpha_2 = 0.50$ (Fired)<br>• $\alpha_3 = 1.00$ (Fired) | **✓ Exact Match** |
| **Step 3: Implication & Aggregation** | • Low Tip: Clipped at $0.00$<br>• Medium Tip ($[10, 15, 20]$): Clipped at $0.50$<br>• High Tip ($[15, 20, 25]$): Full active shape at $1.00$<br>• Union polygon spans $z \in [10, 25]$ | Composite polygon rendered on canvas with shaded areas for Medium & High tip sets | **✓ Exact Match** |
| **Step 4: Defuzzification (COG)** | $$z^* = \frac{\sum z_i \cdot \mu(z_i)}{\sum \mu(z_i)} = \frac{138.8}{8.28} \approx \mathbf{16.8\%}$$ | **$16.8\%$ Tip** (Red COG line with balance arrow) | **✓ Exact Match** |

---

## 🛠️ Tech Stack & Directory Structure

- **Framework:** React 19 + TypeScript (Strict Mode)
- **Bundler:** Vite 8 (Ultra-fast builds & optimized chunks)
- **Styling:** Tailwind CSS v4 + Dark Slate Theme
- **Math Formatting:** KaTeX (LaTeX equation rendering)
- **Canvas Rendering:** HTML5 2D Canvas API (hardware-accelerated live membership curve plotting)
- **Audio Feedback:** Web Audio API Synthesizer (100% offline procedural clicks and fanfares)

```
soft-computing-ga-visualizer/
├── .github/workflows/deploy.yml       # GitHub Actions CI/CD
├── docs/                              # Standalone deployment bundle for GitHub Pages
│   ├── index.html
│   └── assets/
├── src/
│   ├── components/
│   │   ├── MathView.tsx               # KaTeX LaTeX renderer
│   │   └── flc/
│   │       ├── NavbarFLC.tsx          # Top bar, problem switcher & benchmark loader
│   │       ├── StepperBar.tsx         # 5-step process stepper & playback controls
│   │       ├── MFCanvas.tsx           # Interactive membership function curve canvas
│   │       ├── RuleMatrix.tsx         # Mamdani rule cards with firing strength bars
│   │       ├── DefuzzCanvas.tsx       # Aggregated fuzzy shape & Centroid COG line
│   │       ├── PlainExplainerFLC.tsx  # Step-by-step plain English explanations
│   │       └── TextbookVerificationModal.tsx # Side-by-side textbook proof modal
│   ├── core/
│   │   ├── fuzzyMath.ts               # Triangle/Trapezoid math, Mamdani min/max, Defuzzification
│   │   └── problemConfigs.ts          # Tipping and Washing Machine configurations & proofs
│   ├── types/
│   │   └── fuzzy.ts                   # Domain types (FuzzyVariable, MembershipFunction, FuzzyRule)
│   ├── utils/
│   │   └── audio.ts                   # Web Audio synthesizer
│   ├── App.tsx                        # Master application layout
│   └── main.tsx
├── package.json
├── vite.config.ts
└── README.md
```

---

## ⚡ Quick Start & Local Execution

### Prerequisites
- Node.js (version 18 or higher)
- npm (version 9 or higher)

### Setup & Run Commands
```bash
# 1. Clone repository
git clone https://github.com/aditya-s45/Soft-Computing.git
cd Soft-Computing

# 2. Install dependencies
npm install

# 3. Launch development server
npm run dev
# Opens at http://localhost:5173/

# 4. Or launch production preview
npm run preview
# Opens at http://localhost:4173/
```

*(You can also simply double-click `docs/index.html` in Windows Explorer to run it completely offline in any browser!)*

---

## 🎬 3 to 5 Minute Demo Video Script & Storyboard

Use this verbatim script when recording your demonstration video:

```text
================================================================================
FUZZYCRAFT — 3 TO 5 MINUTE DEMO VIDEO RECORDING SCRIPT
================================================================================

[0:00 - 0:45] INTRODUCTION & TOPIC SELECTION
Screen: Show the FuzzyCraft interface in dark mode.
Narration:
"Hello respected evaluators. Today we present FuzzyCraft, an interactive, 
browser-based educational tool built for our B.Tech Soft Computing course.
Our project focuses on the Fuzzy Logic Controller — specifically the Mamdani 
Fuzzy Inference System and Centroid Defuzzification.
Inspired by VisuAlgo, our goal was to make fuzzy set theory transparent, 
visual, and easy to understand without overwhelming students with unnecessary 
clutter.
Across the top bar, users can toggle between two real-world control problems:
The canonical Restaurant Tipping benchmark and the Smart Washing Machine Controller."

[0:45 - 1:45] TEXTBOOK HAND-CALCULATION VERIFICATION
Screen: Click 'Load Textbook Benchmark' button. The Hand Calculation modal opens.
Scroll through the 4 steps.
Narration:
"A mandatory requirement of our project is validation against a textbook hand 
calculation. Clicking 'Load Textbook Benchmark' sets our crisp inputs to the exact 
values from Timothy J. Ross and S.N. Sivanandam's textbooks: Service Quality = 7.0 
and Food Quality = 8.0.
In this verification window, we walk through the exact hand calculations:
Step 1: Service = 7.0 produces membership grades of 0.50 in Good and 0.40 in Excellent.
Food = 8.0 produces 1.00 in Delicious.
Step 2: Mamdani rule evaluation computes firing strengths using Zadeh's min/max:
Rule 1 is inactive at 0.00. Rule 2 fires at 0.50, and Rule 3 fires at 1.00.
Step 3: Implication clips the output sets at these heights.
Step 4: Centroid Center of Gravity integration balances the composite shape at 
exactly 16.8% tip!
Notice our simulator output matches the textbook derivation to the decimal place with 
a 100% verified status."

[1:45 - 2:45] STEPPER CONTROLS & VISUAL PIPELINE
Screen: Close modal. In the Stepper bar, click 'Step Next' through the 5 phases.
Point to the Left Column and Right Column.
Narration:
"Now, let's observe how the tool teaches the algorithm step-by-step.
Our top stepper breaks the FLC down into five logical phases:
Phase 1: Crisp Inputs. The user adjusts sliders, and the white vertical cursor 
updates the reading.
Phase 2: Fuzzification. Notice the glowing dots on the membership curves: as we drag 
Service Quality, the μ grades for Poor, Good, and Excellent compute live.
Phase 3: Mamdani Rules. On the right, our rule matrix displays each linguistic rule. 
Active rules illuminate in amber, showing the exact min or max antecedent calculation 
and firing strength.
Phase 4: Aggregation. The output shapes from all active rules are unioned into a 
single composite polygon.
Phase 5: Defuzzification. Notice the red vertical line: this represents the physical 
Center of Gravity (COG), complete with a balance fulcrum underneath.
Pressing 'AUTO PLAY' smoothly loops through this entire pipeline automatically."

[2:45 - 3:30] PROBLEM 2: SMART WASHING MACHINE & DEFUZZIFICATION METHODS
Screen: Switch to 'Washing Machine' from the problem switcher. Drag Dirtiness to 80% 
and Grease to 75%. Switch defuzzification dropdown between Centroid, Bisector, and MOM.
Narration:
"Next, let's explore our second problem: the Smart Washing Machine Controller.
Here, our inputs represent optical turbidity sensor readings: Dirtiness Level and 
Grease Level, which determine Wash Duration from 0 to 60 minutes.
When clothes have 80% dirt and 75% grease, Rule 1 and Rule 4 fire strongly, clipping 
the 'Long' and 'Very Long' wash time sets and recommending a 48-minute cycle.
Additionally, students can switch between three defuzzification algorithms:
Centroid (Center of Gravity), Bisector of Area, and Mean of Maximum (MOM).
Notice how the mathematical fraction numerator and denominator display live values."

[3:30 - 4:15] CONCLUSION & PUBLIC DEPLOYMENT
Screen: Scroll through the clean layout and show footer metadata.
Narration:
"In summary, FuzzyCraft satisfies all project criteria:
It lets users select problems and change parameters, steps through the algorithm with 
playback controls, visualizes every stage on screen with plain-language explanations, 
and is verified against recognized textbook hand calculations.
The project is built with React and Tailwind, is 100% offline-ready in the docs/ folder, 
and is deployed live on GitHub Pages.
Thank you for your time and evaluation!"
================================================================================
```

---

## 🎓 Lab Viva Voce Cheat Sheet (Key Answers for Evaluator Questions)

When your professor or examiner asks questions during project defense:

1. **Q: What is the main difference between Mamdani and Sugeno Fuzzy Inference Systems?**  
   *A:* "In a Mamdani inference system, the consequents (rule outputs) are fuzzy sets, requiring geometric aggregation and centroid defuzzification. In a Takagi-Sugeno system, the consequents are mathematical functions or crisp constants (e.g. $z = ax + by + c$), eliminating the computationally expensive defuzzification step by using a weighted average."

2. **Q: Why is the Centroid (Center of Gravity) method the most widely used defuzzification technique?**  
   *A:* "Centroid defuzzification is physically intuitive—it calculates the center of mass of the aggregated fuzzy polygon:
   $$z^* = \frac{\int z \mu(z) dz}{\int \mu(z) dz}$$
   It exhibits smooth, continuous transitions when inputs change, avoiding abrupt output jumps that occur in Mean of Maximum (MOM) methods."

3. **Q: How does Mamdani implication perform clipping?**  
   *A:* "Mamdani implication applies the minimum operator ($\min(\alpha_k, \mu_{\text{output}}(z))$), which truncates or 'chops off' the top of the output membership function at the rule's firing strength height $\alpha_k$."

4. **Q: What happens if none of the fuzzy rules fire?**  
   *A:* "If all firing strengths $\alpha_k = 0$, the denominator $\sum \mu(z) = 0$. The controller returns a safe default fallback—typically the midpoint of the output universe of discourse (e.g., $(y_{\min} + y_{\max})/2$)."

---

## 📜 License
This project is open-source under the MIT License — designed with care for Soft Computing students and educators.
