# Opportunity Pathfinder — REST API Specification

All endpoints are hosted by default at `http://localhost:8080/api`.
Interactive OpenAPI 3.0 / Swagger documentation is available at `http://localhost:8080/swagger-ui.html`.

---

## 1. Authentication & Identity (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new student/user | No |
| `POST` | `/api/auth/login` | Authenticate with email & password, returns JWT | No |
| `GET` | `/api/auth/me` | Fetch authenticated user identity and role | Bearer JWT |

---

## 2. Student Profile & Academics (`/api/profile`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/profile` | Get current student profile | Bearer JWT |
| `PUT` | `/api/profile` | Update profile demographics, GPA, links | Bearer JWT |
| `POST` | `/api/profile/projects` | Add a new project to portfolio | Bearer JWT |
| `POST` | `/api/profile/achievements` | Log a student achievement or competition | Bearer JWT |
| `POST` | `/api/profile/goals` | Set target career goals | Bearer JWT |

---

## 3. Skills & Prerequisite DAG (`/api/skills`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/skills` | List all catalog skills across categories | Bearer JWT |
| `GET` | `/api/skills/my` | List current student's tracked skills and ratings | Bearer JWT |
| `POST` | `/api/skills/my` | Add or update a student skill proficiency | Bearer JWT |
| `GET` | `/api/skills/prerequisites/{skillId}` | Inspect prerequisite DAG nodes for a skill | Bearer JWT |

---

## 4. Career Paths & Recommendations (`/api/career`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/career/paths` | List all career paths with required skill weights | Bearer JWT |
| `GET` | `/api/career/paths/{id}` | Get detailed career path breakdown | Bearer JWT |
| `GET` | `/api/career/recommendations` | Get personalized career path rankings & rationales | Bearer JWT |
| `GET` | `/api/career/gap-report/{careerPathId}` | Generate deep skill gap report with blockers | Bearer JWT |

---

## 5. Student Digital Twin (`/api/twin`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/twin` | Get current Digital Twin state & 18D vector | Bearer JWT |
| `GET` | `/api/twin/snapshots` | Get full immutable lineage history (v1..vN) | Bearer JWT |
| `POST` | `/api/twin/recalculate` | Force recalculation of twin state & save snapshot | Bearer JWT |

---

## 6. Learning Roadmap & Workbench (`/api/roadmap`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/roadmap/generate/{careerPathId}` | Generate personalized multi-phase learning plan | Bearer JWT |
| `GET` | `/api/roadmap/active` | Get student's current active learning roadmap | Bearer JWT |
| `POST` | `/api/roadmap/tasks/{taskId}/submit` | Submit verified evidence artifact for a task | Bearer JWT |
| `PUT` | `/api/roadmap/tasks/{taskId}/status` | Update task progress status | Bearer JWT |

---

## 7. Execution Monitoring & Logs (`/api/execution`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/execution/log` | Log study session hours and notes | Bearer JWT |
| `GET` | `/api/execution/metrics` | Retrieve velocity, consistency & hours stats | Bearer JWT |

---

## 8. Intelligence, Failures & Successes (`/api/intelligence`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/intelligence/failures` | Record an assessment failure or diagnostic event | Bearer JWT |
| `GET` | `/api/intelligence/failures` | List all historical failure events with RCA | Bearer JWT |
| `POST` | `/api/intelligence/successes` | Record a milestone celebration or breakthrough | Bearer JWT |
| `GET` | `/api/intelligence/successes` | List all recorded success events | Bearer JWT |

---

## 9. Adaptive Replanning (`/api/adaptive`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/adaptive/trigger/{failureId}` | Trigger closed-loop replanning for a failure | Bearer JWT |
| `GET` | `/api/adaptive/history` | List all adaptation events and injected phases | Bearer JWT |

---

## 10. Opportunities & Readiness Radar (`/api/opportunities`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/opportunities/matches` | Get matched opportunities with match vs readiness % | Bearer JWT |
| `GET` | `/api/opportunities/readiness-profile` | Get 10-dimensional radar assessment breakdown | Bearer JWT |
| `POST` | `/api/opportunities/{id}/apply` | Submit application and track status | Bearer JWT |

---

## 11. Mock Interview Simulator (`/api/interview`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/interview/questions` | Fetch curated diagnostic questions | Bearer JWT |
| `POST` | `/api/interview/assess` | Submit answer for weakness & competency scoring | Bearer JWT |

---

## 12. Research Benchmarks & 16-Step Demo (`/api/research`, `/api/demo`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/demo/execute-scenario` | Execute full 16-step closed-loop demonstration | Public/Dev |
| `GET` | `/api/research/benchmark-metrics` | Retrieve Precision@K, NDCG, & ablation results | Bearer JWT |
| `GET` | `/api/research/export/csv` | Download evaluation datasets in CSV format | Bearer JWT |
