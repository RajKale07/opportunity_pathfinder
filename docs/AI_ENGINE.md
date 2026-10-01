# Opportunity Pathfinder — AI & Intelligence Engine Mathematical Specification

## 1. Principles of Deterministic & Explainable AI

Opportunity Pathfinder rejects "black-box" generative text generation for critical career pathing, skill gap prioritization, and opportunity recommendations. Every score, recommendation, and adaptation is computed using formal, deterministic mathematical models with explicit weight vectors and confidence intervals.

---

## 2. Mathematical Formulations

### 2.1 Composite Career Readiness Score (\(R_{\text{composite}}\))

The readiness score models how prepared a student is across practical skills, verified projects, consistency, problem-solving, mock interview ability, and academic foundation.

\[
R_{\text{composite}} = w_{\text{skill}} \cdot \bar{S} + w_{\text{proj}} \cdot P_{\text{norm}} + w_{\text{ps}} \cdot PS + w_{\text{cons}} \cdot C + w_{\text{int}} \cdot I + w_{\text{acad}} \cdot A_{\text{norm}}
\]

#### Normalized Parameter Definitions:
* \(\bar{S}\): Weighted average skill proficiency \([0, 100]\)
* \(P_{\text{norm}} = \min(100, N_{\text{projects}} \times 25.0)\): Verified projects normalized to 100 (4+ projects = 100)
* \(PS\): Algorithmic Problem Solving / LeetCode / DSA diagnostic score \([0, 100]\)
* \(C\): Consistency Score \([0, 100]\) factoring weekly streak and recency decay
* \(I\): Mock Interview / Behavioral assessment score \([0, 100]\)
* \(A_{\text{norm}} = \left(\frac{\text{GPA}}{4.0}\right) \times 100\): Normalized academic score \([0, 100]\)

#### Calibrated Weight Vector:
| Component | Weight (\(w_i\)) | Rationale |
| :--- | :--- | :--- |
| **Technical Skill Mastery** (\(\bar{S}\)) | **0.30** | Fundamental competency required to execute technical job duties |
| **Verified Project Output** (\(P_{\text{norm}}\)) | **0.20** | Demonstrated proof of building end-to-end working software |
| **Algorithmic Problem Solving** (\(PS\)) | **0.15** | Coding screen filter competency across FAANG/Tier-1 firms |
| **Execution Consistency** (\(C\)) | **0.15** | Reliable daily/weekly momentum, persistence, and low drift |
| **Interview Performance** (\(I\)) | **0.10** | Technical communication, architecture articulation, culture fit |
| **Academic Foundation** (\(A_{\text{norm}}\)) | **0.10** | Institutional coursework, foundational CS theory, and discipline |

$$\sum w_i = 0.30 + 0.20 + 0.15 + 0.15 + 0.10 + 0.10 = 1.00$$

---

### 2.2 Skill Gap Identification & Weighting (\(G_k\))

For a target career path \(P\) requiring skill set \(\{s_1, s_2, \dots, s_m\}\):

For each required skill \(k\):
\[
\text{Gap}_k = \max(0.0, T_k - S_k)
\]
Where:
* \(T_k\): Target proficiency defined by the career path \([0, 100]\)
* \(S_k\): Student's current verified proficiency in skill \(k\) \([0, 100]\)

#### Weighted Average Path Gap:
\[
\bar{G}_P = \frac{\sum_{k=1}^m w_k \cdot \text{Gap}_k}{\sum_{k=1}^m w_k}
\]

#### Prerequisite Blocker Detection:
A skill \(k\) is classified as `BLOCKED` if:
\[
\exists p \in \text{Prerequisites}(k) \quad \text{such that} \quad S_p < \theta_p
\]
Where \(\theta_p\) is the minimum threshold required for prerequisite \(p\) (default: 60.0%).

---

### 2.3 Opportunity Match vs. Readiness Score Separation

A foundational innovation of Opportunity Pathfinder is the explicit mathematical decoupling of **Match** from **Readiness**:

```
Match Percentage != Readiness Percentage
```

1. **Opportunity Match Score (\(M_{\text{opp}}\))**:
   Measures structural qualification overlap between company requirements and student skills:
   \[
   M_{\text{opp}} = \left( 0.70 \times \frac{|S_{\text{student}} \cap S_{\text{mandatory}}|}{|S_{\text{mandatory}}|} + 0.30 \times \frac{|S_{\text{student}} \cap S_{\text{preferred}}|}{|S_{\text{preferred}}|} \right) \times 100
   \]
   *Penalty*: If the opportunity has a minimum GPA requirement and \(\text{GPA}_{\text{student}} < \text{GPA}_{\text{min}}\), \(M_{\text{opp}}\) is multiplied by 0.70.

2. **Opportunity Readiness Score (\(R_{\text{opp}}\))**:
   Measures probability of passing the hiring bar and succeeding in the job:
   \[
   R_{\text{opp}} = 0.50 \cdot M_{\text{opp}} + 0.50 \cdot R_{\text{composite}}
   \]
   *Explainability Rule*:
   * If \(M_{\text{opp}} \ge 80\%\) but \(R_{\text{opp}} < 65\%\): "Strong keyword & skill profile match, but interview readiness and execution consistency need reinforcement."
   * If \(M_{\text{opp}} < 65\%\) but \(R_{\text{opp}} \ge 80\%\): "High foundational velocity and interview capability, but specific framework prerequisites are missing."

---

### 2.4 Execution Consistency & Velocity Metrics

* **Velocity Score (\(V\))**:
  \[
  V = \min\left(100.0, \frac{\text{Completed Hours Last 14 Days}}{\text{Target Planned Hours Last 14 Days}} \times 100.0\right)
  \]

* **Consistency Score (\(C_t\)) with Time Decay**:
  \[
  C_t = \max\left(10.0, C_0 \times e^{-\lambda \cdot \Delta t_{\text{days}}} + \text{Bonus}_{\text{streak}}\right)
  \]
  Where:
  * \(\lambda = 0.05\) (Half-life decay for inactivity)
  * \(\Delta t\): Days elapsed since last verified submission
  * \(\text{Bonus}_{\text{streak}} = \min(25.0, \text{Active Streak Days} \times 2.5)\)

---

### 2.5 Failure Intelligence & Confidence Assignment

When a student fails a milestone or assessment (Score \(< 70.0\%\)):

1. **Deficit Calculation**:
   \[
   \Delta_{\text{deficit}} = 70.0 - \text{Score}
   \]

2. **Severity Mapping**:
   * \(\Delta_{\text{deficit}} \ge 35.0\) (Score \(\le 35\%\)) \(\rightarrow\) `CRITICAL`
   * \(20.0 \le \Delta_{\text{deficit}} < 35.0\) (Score \(36\% - 50\%\)) \(\rightarrow\) `HIGH`
   * \(10.0 \le \Delta_{\text{deficit}} < 20.0\) (Score \(51\% - 60\%\)) \(\rightarrow\) `MEDIUM`
   * \(\Delta_{\text{deficit}} < 10.0\) (Score \(61\% - 69\%\)) \(\rightarrow\) `LOW`

3. **Confidence Level Assignment**:
   * `OBSERVED`: Ground-truth assessment score or test execution result recorded directly by the platform.
   * `LIKELY`: Inferred through multiple missed deadlines, stalled activity, or prerequisite failure.
   * `UNKNOWN`: Unverified external signal or self-reported failure without artifact evidence.

---

### 2.6 10-Dimensional Radar Assessment

Every student's comprehensive capability is projected across 10 orthogonal axes:
1. **Technical Skills**: Average proficiency across core domain skills \([0, 100]\).
2. **Projects**: Number and quality index of verified portfolio repositories \([0, 100]\).
3. **Problem Solving**: Algorithmic accuracy and time complexity rating \([0, 100]\).
4. **Communication**: Documentation quality, README depth, and structured answers \([0, 100]\).
5. **Interview Readiness**: Mock interview and diagnostic question performance \([0, 100]\).
6. **Resume Quality**: Density of quantifiable impact metrics and ATS keyword alignment \([0, 100]\).
7. **Portfolio Evidence**: Verified GitHub commits, live URLs, and deployment artifacts \([0, 100]\).
8. **Consistency & Velocity**: Weekly commitment adherence and low stagnation drift \([0, 100]\).
9. **System Knowledge**: Distributed architectures, caching, scalability, and security \([0, 100]\).
10. **Academics**: Institutional GPA and coursework foundation \([0, 100]\).
