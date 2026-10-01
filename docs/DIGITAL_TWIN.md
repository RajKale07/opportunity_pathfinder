# Student Digital Twin — Specification & Feature Vector Reference

## 1. Concept of the Student Digital Twin

In modern cyber-physical and manufacturing systems, a **Digital Twin** is a dynamic virtual representation of a physical asset, continuously updated with telemetry to reflect its real-time state, predict failures, and optimize performance.

**Opportunity Pathfinder** pioneers the application of this concept to career engineering. The **Student Digital Twin** is not a static resume or passive profile; it is an active, stateful, multidimensional software entity that:
1. Absorbs execution telemetry (tasks completed, hours logged, commits pushed).
2. Quantifies behavioral momentum (velocity, consistency, decay rates).
3. Detects emerging cognitive deficits and prerequisite bottlenecks.
4. Simulates future opportunity outcomes and adjusts guidance dynamically.

```mermaid
flowchart LR
    subgraph Real Student
        A[Code Commits]
        B[Lab Assessments]
        C[Interview Practice]
        D[Weekly Time Spent]
    end

    subgraph Digital Twin Entity
        FV[18-Dimensional Feature Vector]
        SNAP[Immutable Snapshot Lineage v1..vN]
        PRED[Outcome & Readiness Predictor]
    end

    subgraph Feedback Loop
        REC[Personalized Opportunity & Roadmap Adaptation]
    end

    A & B & C & D -->|Ingest Telemetry| FV
    FV --> SNAP
    SNAP --> PRED
    PRED --> REC
    REC -->|Targeted Tasks & Drills| Real Student
```

---

## 2. The 18-Dimensional Feature Vector

The Digital Twin state is formalized as a normalized vector \(\mathbf{x} \in \mathbb{R}^{18}\), where each feature is bounded in \([0.0, 100.0]\) or \([0.0, 1.0]\):

| Index | Feature Name | Range | Description | Computation Method |
| :--- | :--- | :--- | :--- | :--- |
| **01** | `skillProficiency` | `[0.0, 100.0]` | Weighted average across all student skills | \(\sum (w_i \cdot s_i) / \sum w_i\) |
| **02** | `projectCount` | `[0, \infty)` | Number of verified portfolio projects | Count of active `Project` entities |
| **03** | `projectQuality` | `[0.0, 10.0]` | Complexity and architectural maturity score | Average rating of verified repositories |
| **04** | `problemSolvingScore`| `[0.0, 100.0]` | Algorithmic and LeetCode-style rating | Direct diagnostic / quiz performance |
| **05** | `consistencyScore` | `[0.0, 100.0]` | Daily/weekly streak retention with decay | Exponential decay penalty for inactivity |
| **06** | `velocityScore` | `[0.0, 100.0]` | Hours executed relative to planned schedule | \(\min(100, (\text{Actual} / \text{Planned}) \times 100)\) |
| **07** | `completionRate` | `[0.0, 1.0]` | Ratio of completed roadmap tasks | \(\text{Tasks}_{\text{verified}} / \text{Tasks}_{\text{total}}\) |
| **08** | `interviewScore` | `[0.0, 100.0]` | Performance in mock interviews | Average of mock evaluation scores |
| **09** | `communicationScore`| `[0.0, 100.0]` | Clarity of writeups, READMEs, & articulation| Assessed via documentation reviews |
| **10** | `academicScore` | `[0.0, 100.0]` | Normalized undergraduate GPA | \((\text{GPA} / 4.0) \times 100\) |
| **11** | `compositeReadiness`| `[0.0, 100.0]` | 6-factor holistic career readiness | Master formula in Section 2.1 of AI Engine |
| **12** | `failureResilience` | `[0.0, 1.0]` | Ratio of recovered failures to total failures | \(\text{Failures}_{\text{remediated}} / \text{Failures}_{\text{total}}\) |
| **13** | `learningPace` | `[0.0, 2.0]` | Velocity multiplier relative to average student| Speed coefficient |
| **14** | `stagnationIndex` | `[0.0, 1.0]` | Probability that student is currently stalled | Inactivity days / 14 |
| **15** | `codeQualityIndex` | `[0.0, 100.0]` | Test coverage and modularity of code | Static code analysis & test pass rate |
| **16** | `breadthDepthRatio` | `[0.0, 1.0]` | T-shaped developer balance | Deep specialized skills vs general skills |
| **17** | `goalAlignment` | `[0.0, 1.0]` | Alignment between current skills and target role| Cosine similarity of skill vectors |
| **18** | `opportunityPotential`| `[0.0, 100.0]` | Aggregate match across all open market roles | Max match score in opportunity catalog |

---

## 3. Snapshot Lineage & State Immutability

Whenever a significant state transition occurs, a new immutable record is committed to `digital_twin_snapshots`:

```json
{
  "version": 4,
  "triggerEvent": "ADAPTIVE_REPLANNING_EXECUTED",
  "triggerDescription": "Adaptive replanning triggered by SQL Assessment failure (42%). Injected remediation phase.",
  "compositeReadinessScore": 61.5,
  "skillProficiencyAvg": 68.0,
  "consistencyScore": 82.0,
  "velocityScore": 75.0,
  "timestamp": "2026-10-01T12:53:33Z",
  "featureVector": {
    "skillProficiency": 68.0,
    "projectCount": 2,
    "problemSolvingScore": 65.0,
    "consistencyScore": 82.0,
    "interviewScore": 60.0,
    "academicScore": 93.0,
    "compositeReadiness": 61.5
  }
}
```

### Snapshot Guarantees:
1. **Auditability**: Every change in readiness can be traced back to a specific action, assessment, or adaptation.
2. **Time-Series Analysis**: The UI renders historical readiness and consistency trends over time using this lineage.
3. **Rollback & Counterfactual Simulation**: Enables the research module to test counterfactual scenarios (e.g., "What if the student took Cloud Architecture first instead of SQL?").
