# End-to-End Demo Guide: The 16-Step Closed-Loop Career Operating System

## 1. Overview of the Demonstration

This guide walks through the exact **16-Step Closed-Loop Demonstration** specified in Section 43 of the Master Specification. It showcases how Opportunity Pathfinder moves from initial student onboarding to skill gap discovery, personalized learning, real failure detection, automated adaptive replanning, remediation mastery, digital twin evolution, and explainable opportunity matching.

---

## 2. Seed Student Persona (Alex Chen)

* **Name**: Alex Chen
* **Email**: `student@example.com`
* **Password**: `password123`
* **University**: State University | **Degree**: B.S. Computer Science | **GPA**: 3.72
* **Target Role**: Backend Developer
* **Starting Profile**:
  * Foundational Java (45%), Python (55%), Git (70%)
  * Missing / Incomplete: Spring Boot (25%), SQL (40%), System Design (15%), Docker (20%)
  * Digital Twin Starting State: **Version 1** (Readiness ~54%)

---

## 3. Step-by-Step Scenario Execution Walkthrough

You can execute this entire sequence with a single click in the UI via **Research Lab -> Execute 16-Step Closed Loop**, or via REST endpoint `POST /api/demo/execute-scenario`.

### Step 1: Student Profile Verified
* **What Happens**: System validates student identity, academic credentials, and current active skills in the database.
* **Audit**: User `1` active with GPA 3.72 and Computer Science degree.

### Step 2: Target Career Path Selected
* **What Happens**: Student selects **Backend Developer** from the career catalog.
* **Engine**: Path demands: Java (80%), Spring Boot (75%), SQL (75%), System Design (70%), Git (60%).

### Step 3: Student Digital Twin Feature Vector Extracted
* **What Happens**: `DigitalTwinEngine` normalizes 18 features into a mathematical vector.
* **Result**: Initial Twin **v1** persisted with Composite Readiness score of **54.0%**.

### Step 4: Skill Gap Engine Analyzes Gaps
* **What Happens**: `SkillGapEngine` calculates delta between target proficiencies and student's current proficiencies.
* **Result**: Critical gaps identified in Spring Boot (delta: 50%) and SQL (delta: 35%). Prerequisite blocker noted: Java must reach 60%+ before advanced Spring Boot.

### Step 5: Personalized Roadmap Generated
* **What Happens**: `LearningRoadmapEngine` generates 4-phase structured roadmap:
  * Phase 1: Java OOP & Advanced Collections
  * Phase 2: Relational Databases & SQL Joins
  * Phase 3: Spring Boot REST & Data JPA
  * Phase 4: Production Deployment & Docker

### Step 6: Student Completes Milestone with Verified Evidence
* **What Happens**: Student submits GitHub repo link for *Core Java Collections Lab*.
* **Result**: Java proficiency elevated from 45% to 65%. Digital Twin advances to **v2**.

### Step 7: Assessment Failure Incurred
* **What Happens**: Student takes the *SQL Joins & Complex Aggregation Diagnostic Assessment* and scores **42.0%** (Passing threshold is 70.0%).

### Step 8: Failure Intelligence Engine Diagnostics
* **What Happens**: `FailureAnalysisEngine` registers Failure Event #1:
  * **Confidence**: `OBSERVED` (ground-truth score recorded)
  * **Severity**: `HIGH` (deficit: 28.0%)
  * **Root Cause**: Deficiencies in subqueries, execution plans, and multi-table joins.

### Step 9: Adaptive Replanning Triggered
* **What Happens**: `AdaptivePlanningEngine` intercepts failure event. Closed-loop replanning policy activated: `INJECT_REINFORCEMENT` + `REORDER_DAG`.

### Step 10: Roadmap Structure Dynamically Adapted
* **What Happens**: The roadmap is dynamically mutated:
  * Injects new phase: *"Adaptive Reinforcement: SQL Mastery & Remediation"*.
  * Downstream Spring Boot phases are temporarily locked until SQL prerequisite is met.
  * Digital Twin advances to **v3** with trigger `ADAPTIVE_REPLANNING_EXECUTED`.

### Step 11: Remediation Completed & Reassessed
* **What Happens**: Student completes interactive SQL drills and retakes the diagnostic assessment, scoring **88.0%**.
* **Result**: SQL proficiency elevated from 40% to 85%. Prerequisite lock is removed.

### Step 12: Student Digital Twin Updated
* **What Happens**: Twin advances to **v4**:
  * Skill proficiency average jumps from 51% to 78%.
  * Consistency score elevated to 82%.
  * Composite Career Readiness jumps to **74.5%**.

### Step 13: Opportunity Ingestion & Evaluation
* **What Happens**: Market opportunities evaluated against student's updated Twin.
* **Target Detected**: **Backend Software Engineering Intern** at **Stripe** ($55/hr).

### Step 14: Match vs. Readiness Separation Computed
* **What Happens**: `OpportunityMatchingEngine` calculates:
  * **Skill Match**: **92%** (Java, SQL, Git satisfied; Spring Boot in progress).
  * **Career Readiness**: **76%** (High GPA, strong code quality, solid consistency).

### Step 15: Opportunity Formally Matched to Pipeline
* **What Happens**: Opportunity appears at Rank #1 in matched feed with green "High Fit" badge.

### Step 16: Explainable Recommendation Generated
* **What Happens**: Transparent rationale rendered to student:
  > *"Strong fit (92% skill match). Your recent SQL remediation (85% proficiency) and high academic record (GPA 3.72) satisfy Stripe's core internship requirements. Primary recommendation: complete the Spring Data JPA module to achieve 85%+ readiness."*

---

## 4. How to Verify via User Interface

1. Start both servers:
   ```cmd
   d:\pathfinder\start.bat
   ```
2. Open browser at `http://localhost:5173`.
3. Log in as:
   * **Email**: `student@example.com`
   * **Password**: `password123`
4. Navigate to **Research Lab** on the left sidebar.
5. Click **"Execute 16-Step Scenario"**.
6. Watch the live execution terminal log all 16 steps with real-time state changes!
7. Navigate to **Digital Twin** to see the 4 lineage versions and the 18-attribute feature vector.
8. Navigate to **Opportunities** to view the Stripe internship match and explainable rationale.
9. Navigate to **Readiness Radar** to view the 10-dimensional visual capability profile.
