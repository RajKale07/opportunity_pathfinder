# Opportunity Pathfinder

> An AI-powered life opportunity and growth intelligence ecosystem for students, job seekers, and low/middle-income individuals.

---

## What is Opportunity Pathfinder?

Opportunity Pathfinder is not a simple job portal. It is an intelligent platform that analyzes your profile, detects gaps, recommends personalized opportunities, and simulates your future career growth — all in one place.

It answers one core question:
**"What is the best possible path to improve my financial, educational, and career future?"**

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js, Tailwind CSS, Framer Motion, Axios, React Router |
| Backend | Java Spring Boot, REST APIs, JWT Authentication |
| Database | MySQL |
| AI / OCR | Tesseract OCR, OpenAI API, Custom Recommendation Engine |
| Storage | Firebase / Cloudinary |
| Job APIs | Adzuna API, JSearch API |
| Scheme Data | MyScheme API / Government Datasets |
| Scholarship | Government Scholarship Datasets + Custom Scraping |

---

## Project Folder Structure

```
opportunity-pathfinder/
│
├── frontend/                        # React.js Application
│   ├── public/
│   └── src/
│       ├── components/              # Reusable UI components
│       │   ├── Sidebar.jsx
│       │   ├── Navbar.jsx
│       │   ├── OpportunityCard.jsx
│       │   ├── AIAssistantWidget.jsx
│       │   └── ProfileMeter.jsx
│       ├── pages/                   # Route-level pages
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   ├── Dashboard.jsx
│       │   ├── Profile.jsx
│       │   ├── Jobs.jsx
│       │   ├── Scholarships.jsx
│       │   ├── Schemes.jsx
│       │   ├── ResumeBuilder.jsx
│       │   ├── AIAssistant.jsx
│       │   ├── CareerSimulation.jsx
│       │   └── AdminPanel.jsx
│       ├── context/                 # React Context (Auth, Profile)
│       ├── hooks/                   # Custom hooks
│       ├── services/                # Axios API calls
│       ├── utils/                   # Helper functions
│       └── App.jsx
│
├── backend/                         # Spring Boot Application
│   └── src/main/java/com/opportunitypathfinder/
│       ├── controller/              # REST Controllers
│       │   ├── AuthController.java
│       │   ├── UserController.java
│       │   ├── JobController.java
│       │   ├── ScholarshipController.java
│       │   ├── SchemeController.java
│       │   ├── ResumeController.java
│       │   ├── OCRController.java
│       │   ├── AIController.java
│       │   └── AdminController.java
│       ├── service/                 # Business Logic
│       ├── repository/              # JPA Repositories
│       ├── model/                   # Entity Classes
│       ├── dto/                     # Data Transfer Objects
│       ├── security/                # JWT + Spring Security
│       ├── ocr/                     # Tesseract OCR Integration
│       ├── recommendation/          # AI Recommendation Engine
│       └── config/                  # App Configuration
│
├── database/
│   └── schema.sql                   # MySQL Schema
│
└── README.md
```

---

## Database Schema (Tables)

| Table | Purpose |
|---|---|
| users | User accounts, roles, profile data |
| documents | Uploaded files metadata |
| skills | User skills extracted from OCR + manual |
| jobs | Cached job listings from APIs |
| scholarships | Scholarship data |
| schemes | Government scheme data |
| recommendations | AI-generated recommendations per user |
| resumes | Generated resume data |
| notifications | Alerts, deadlines, reminders |
| analytics | Platform usage and user progress |

---

## System Architecture

```
User Browser (React.js)
        ↓
   REST API Layer (Spring Boot)
        ↓
  ┌─────────────────────────────┐
  │  AI Recommendation Engine   │
  │  OCR Engine (Tesseract)     │
  │  Career Simulation Engine   │
  └─────────────────────────────┘
        ↓
   MySQL Database
        ↓
   Cloud Storage (Firebase/Cloudinary)
        ↓
   External APIs (Jobs, Schemes, Scholarships)
```

---

## User Flow

```
1. Register (Email + Password + OTP)
        ↓
2. Login → JWT Token issued
        ↓
3. Upload Documents (Marksheets, Certificates, Resume, Aadhaar, etc.)
        ↓
4. OCR Engine extracts:
   - Name, Education, Marks
   - Skills, Certifications
   - Experience, Projects
        ↓
5. Smart Profile is auto-created
        ↓
6. AI Recommendation Engine analyzes:
   - Education + Income + Location
   - Skills + Certifications + Projects
        ↓
7. System fetches real-time:
   - Jobs & Internships (Adzuna / JSearch)
   - Scholarships (Government Datasets)
   - Government Schemes (MyScheme API)
        ↓
8. Opportunities ranked by:
   - Eligibility match
   - Skill match
   - Future growth potential
   - Salary potential
        ↓
9. Dashboard shows:
   - Personalized Jobs
   - Scholarships + Approval Probability
   - Government Schemes
   - Career Roadmap
   - Skill Gaps
   - Missing Documents
   - Future Salary Simulation
```

---

## Features — Build Order

We build this platform feature by feature. Each feature is added to this README once completed.

| # | Feature | Status |
|---|---|---|
| 1 | Authentication System (Register, Login, JWT, OTP) | ✅ Complete |
| 2 | User Dashboard (UI Shell + Sidebar + Navbar) | ✅ Complete |
| 3 | OCR Document Upload + Extraction | ✅ Complete |
| 4 | Smart Profile Builder | ✅ Complete |
| 5 | Digital Document Vault | ✅ Complete |
| 6 | Job Recommendation Engine | ✅ Complete |
| 7 | Scholarship Recommendation Engine | ✅ Complete |
| 8 | Government Scheme Eligibility System | ✅ Complete |
| 9 | Career Guidance + Roadmap Engine | ✅ Complete |
| 10 | Skill Gap Analysis | ✅ Complete |
| 11 | Resume Builder + ATS Analyzer | ✅ Complete |
| 12 | AI Chat Assistant | ✅ Complete |
| 13 | Future Career Simulation Engine | ✅ Complete |
| 14 | Notification & Reminder System | ⬜ Pending |
| 15 | Admin Dashboard | ⬜ Pending |
| 16 | Real-Time API Integrations | ⬜ Pending |

---

## Security

- JWT-based stateless authentication
- Role-based access control (USER / ADMIN)
- BCrypt password hashing
- Secure file upload validation
- API rate limiting
- CORS configuration

---

## Pages

| Page | Route | Description |
|---|---|---|
| Login | `/login` | Email + password login |
| Register | `/register` | Sign up with OTP verification |
| Dashboard | `/dashboard` | Personalized opportunity feed |
| Profile | `/profile` | Smart profile builder (personal, education, career, links) |
| Documents | `/documents` | Document vault — upload, OCR extract, manage files |
| Jobs | `/jobs` | Real-time job listings |
| Scholarships | `/scholarships` | Scholarship recommendations |
| Schemes | `/schemes` | Government scheme eligibility |
| Resume Builder | `/resume` | AI resume generation + ATS score |
| AI Assistant | `/assistant` | Chat-based career guidance |
| Career Simulation | `/simulation` | Future salary + growth prediction |
| Admin Panel | `/admin` | User, content, and analytics management |

---

## Feature Details (Updated as we build)

> Each feature section below will be filled in as we complete it.

---

### Feature 1 — Authentication System
*Status: ✅ Complete*

**What was built:**
- `POST /api/auth/register` — Creates user, hashes password with BCrypt, generates 6-digit OTP, sends via Gmail SMTP
- `POST /api/auth/verify-otp` — Validates OTP (10 min expiry), marks user as verified
- `POST /api/auth/login` — Validates credentials, returns signed JWT (24hr expiry)

**Backend files:**
- `model/User.java` — JPA entity with role enum, OTP fields, verified flag
- `dto/AuthDto.java` — RegisterRequest, LoginRequest, OtpRequest, AuthResponse
- `repository/UserRepository.java` — JPA repo with findByEmail
- `security/JwtUtil.java` — Token generation + validation using HMAC-SHA256
- `security/JwtFilter.java` — OncePerRequestFilter that injects auth into SecurityContext
- `config/SecurityConfig.java` — Stateless JWT security, CORS for localhost:3000, BCrypt bean
- `service/AuthService.java` — Full auth business logic
- `controller/AuthController.java` — 3 REST endpoints

**Frontend files:**
- `pages/Register.jsx` — 2-step form: registration → OTP verification
- `pages/Login.jsx` — Login form with JWT storage
- `context/AuthContext.jsx` — Global auth state (user, login, logout)
- `services/api.js` — Axios instance with JWT interceptor

**How it works:**
1. User fills Register form → OTP sent to email
2. User enters OTP → account verified
3. User logs in → JWT stored in localStorage
4. All future API calls send `Authorization: Bearer <token>` automatically

**Tech used:** Spring Boot 3, Spring Security 6, JJWT 0.11.5, BCrypt, JavaMailSender, React, Tailwind CSS, Framer Motion, React Router, Axios, react-hot-toast

---

### Feature 2 — User Dashboard
*Status: ✅ Complete*

**What was built:**
- Protected dashboard layout with persistent Sidebar + Navbar
- All 8 app routes wired under a single `DashboardLayout` wrapper
- Dashboard home with 4 stat cards (Jobs, Scholarships, Schemes, Profile Score)
- Profile setup progress indicator
- Stub pages for all future features (Jobs, Scholarships, Schemes, Resume, AI Assistant, Simulation, Admin)
- `GET /api/user/me` backend endpoint returns logged-in user data

**Frontend files:**
- `components/DashboardLayout.jsx` — wraps all protected routes, renders Sidebar + Navbar + `<Outlet />`
- `components/Sidebar.jsx` — fixed left nav with SVG icons, active route highlight, user info, logout
- `components/Navbar.jsx` — top bar with current page title, notification bell, user avatar initial
- `pages/Dashboard.jsx` — overview page with stat cards and setup prompt
- `pages/StubPages.jsx` — placeholder pages for all 8 pending features

**Backend files:**
- `controller/UserController.java` — `GET /api/user/me` reads email from JWT SecurityContext, returns user data

**How frontend talks to backend:**
1. On Dashboard load → `api.get("/user/me")` is called
2. Axios interceptor in `services/api.js` automatically attaches `Authorization: Bearer <token>` from localStorage
3. `JwtFilter` on backend validates token → injects email into `SecurityContextHolder`
4. `UserController.getMe()` reads that email → queries MySQL → returns `{id, name, email, role}`
5. Dashboard displays the name from the response

**Route protection:**
- `DashboardLayout` checks `useAuth()` → if no user in context, redirects to `/login`
- All 8 dashboard routes are children of `DashboardLayout` so they are all protected automatically

**Tech used:** React Router v6 nested routes, Framer Motion, Tailwind CSS, Axios, Spring Security context

---

### Feature 3 — OCR Document Upload
*Status: ✅ Complete*

**What was built:**
- `POST /api/ocr/upload` — accepts file, runs Tesseract OCR, parses extracted text, saves document + skills to DB
- `GET /api/ocr/documents` — returns all uploaded documents for logged-in user
- `DELETE /api/ocr/documents/{id}` — deletes document from DB and disk

**Backend files:**
- `model/Document.java` — JPA entity storing file metadata + extracted text
- `model/Skill.java` — JPA entity storing skills per user
- `repository/DocumentRepository.java` — findByUserId
- `repository/SkillRepository.java` — findByUserId, existsByUserIdAndSkillName
- `ocr/OCREngine.java` — Tesseract wrapper + regex parser (email, phone, grades, skills, doc type detection)
- `service/OCRService.java` — saves file to disk, runs OCR, persists document + skills
- `controller/OCRController.java` — 3 REST endpoints

**Frontend files:**
- `pages/OCRUpload.jsx` — drag-and-drop upload zone, extracted data preview, document list with delete
- `services/api.js` — ocrService (upload, getDocuments, deleteDocument)

**How it works:**
1. User drags or selects a file (PNG/JPG/PDF)
2. Frontend sends `multipart/form-data` POST to `/api/ocr/upload` with JWT token
3. Backend saves file to `uploads/` folder on disk
4. Tesseract OCR reads the image/PDF and returns raw text
5. OCREngine parses text with regex — extracts email, phone, grades, skills, detects doc type
6. Document saved to `documents` table, new skills saved to `skills` table (no duplicates)
7. Frontend shows extracted data: doc type badge, email, phone, grades, skill tags, raw text preview
8. Document list shows all uploads with type color coding and delete option

**How frontend talks to backend:**
- `ocrService.upload(formData)` → `POST /api/ocr/upload` with `multipart/form-data` header
- `ocrService.getDocuments()` → `GET /api/ocr/documents` — fetches user's document list on page load
- `ocrService.deleteDocument(id)` → `DELETE /api/ocr/documents/{id}`
- All requests carry `Authorization: Bearer <token>` via Axios interceptor
- Backend reads user email from `SecurityContextHolder` (injected by JwtFilter)

**Tech used:** Tess4J 5.8.0, Spring Multipart, Java NIO Files, Regex parsing, React drag-and-drop, Framer Motion

---

### Feature 4 — Smart Profile Builder
*Status: ✅ Complete*

**What was built:**
- `GET /api/profile` — returns user profile, auto-creates and populates from OCR documents on first visit
- `PUT /api/profile` — saves all profile fields, returns updated completeness score
- Profile completeness score (0–100%) based on 18 fields, now drives the Dashboard profile score

**Backend files:**
- `model/UserProfile.java` — JPA entity mapping `user_profiles` table (18 fields across personal, education, career, social)
- `dto/ProfileDto.java` — `ProfileRequest` + `ProfileResponse` (includes `completeness` int)
- `repository/UserProfileRepository.java` — `findByUserId`
- `service/ProfileService.java` — get (auto-creates + OCR populate), update, completeness calculator
- `controller/ProfileController.java` — `GET /api/profile`, `PUT /api/profile`
- `controller/UserController.java` — updated to use real profile completeness score

**Frontend files:**
- `pages/ProfilePage.jsx` — 4-section form (Personal Info, Education, Career, Social Links), completeness ring, "auto-filled from documents" badge, Save button
- `App.jsx` — `/profile` now loads `ProfilePage`, `/documents` loads `OCRUpload`
- `components/Sidebar.jsx` — added Documents nav item
- `pages/Dashboard.jsx` — "Add documents" link updated to `/documents`
- `services/api.js` — `profileService.get()` and `profileService.update(data)` cleaned up

**How it works:**
1. User visits `/profile` → `GET /api/profile` called
2. If no profile exists → backend auto-creates one, populating fields from OCR document data (grades, degree, income, DOB, gender, experience, GitHub)
3. User fills/edits remaining fields → clicks Save → `PUT /api/profile`
4. Completeness ring updates live as user types (18 fields, each ~5.5%)
5. Dashboard profile score now reflects actual profile completeness

**Auto-populate logic:**
- `CLASS_10` doc → `tenthPercentage`
- `CLASS_12` doc → `twelfthPercentage`
- `GRADUATION` doc → `graduationCgpa`, `graduationDegree`, `graduationBranch`, `graduationYear`
- `AADHAAR` doc → `dob`, `gender`
- `INCOME` doc → `annualIncome`
- `RESUME` doc → `experience`, `githubUrl`

**Tech used:** Spring Data JPA, Lombok, React controlled forms, Framer Motion, CSS variable theming

---

### Feature 5 — Digital Document Vault
*Status: ✅ Complete*

**What was built:**
- Document Vault moved to dedicated route `/documents` (previously at `/profile`)
- 8 document types supported: 10th Marksheet, 12th Marksheet, Graduation, Certificate, Resume, Aadhaar, Income Certificate, Other
- Two-step flow per document: fill structured form → optionally upload physical file
- OCR runs on uploaded file and extracts text automatically
- Vault progress tracker shows which of 8 doc types are added

**Backend files (from Feature 3, fully operational):**
- `controller/OCRController.java` — `POST /api/ocr/upload`, `POST /api/ocr/manual`, `GET /api/ocr/documents`, `DELETE /api/ocr/documents/{id}`
- `service/OCRService.java` — file save, OCR extraction, manual document save, skill deduplication
- `ocr/OCREngine.java` — Tesseract wrapper + regex parser

**Frontend files:**
- `pages/OCRUpload.jsx` — 2-panel layout: Add Document (type selector + structured form + optional file upload) | My Documents (vault list + progress grid)
- `App.jsx` — routed to `/documents`
- `components/Sidebar.jsx` — Documents nav item added

**Route change summary:**

| Route | Before | After |
|---|---|---|
| `/profile` | OCR Document Vault | Smart Profile Builder |
| `/documents` | — (new) | OCR Document Vault |

---

### Feature 6 — Job Recommendation Engine
*Status: ✅ Complete*

**What was built:**
- `GET /api/jobs/search` — calls JSearch (RapidAPI) live, ranks results by skill match against user profile
- Smart auto-query: if no search term given, builds query from user's degree + branch from profile
- Skill match scoring per job (0–100%) with label: Strong / Good / Partial / Low Match
- Missing skills detection — shows what skills to learn to improve match for each job
- Filters: location, job type (Full Time / Part Time / Internship / Contract), remote only toggle
- Pagination support

**Backend files:**
- `service/JobService.java` — JSearch API caller, job enrichment, skill matcher, missing skill detector
- `controller/JobController.java` — `GET /api/jobs/search` with query, location, type, remoteOnly, page params
- `config/AppConfig.java` — `RestTemplate` bean
- `application.properties` — JSearch API key + host added

**Frontend files:**
- `pages/Jobs.jsx` — live job cards with match ring, matched/missing skill tags, description toggle, apply button, filters panel, pagination
- `services/api.js` — `jobService.search(params)`
- `App.jsx` — `/jobs` now loads real `Jobs` page

**How match scoring works:**
1. User's skills are loaded from the `skills` table (extracted from documents)
2. Each job's title + description is scanned for those skills
3. `matchScore = (matched skills / total user skills) × 100`
4. Missing skills = skills found in job description that user doesn't have
5. Jobs sorted by matchScore descending — best matches shown first

**Auto-query logic:**
- If user types nothing → query built from `graduationDegree + graduationBranch` from profile
- Falls back to first skill in skills list, then `"software developer jobs"`
- Location auto-filled from profile city if not specified

**Tech used:** JSearch API (RapidAPI), Spring RestTemplate, React, Framer Motion

---

### Feature 7 — Scholarship Recommendation Engine
*Status: ✅ Complete*

**What was built:**
- `GET /api/scholarships?filter=all|eligible|high` — returns all scholarships ranked by approval probability
- Eligibility engine checks: category, gender, marks, income, state — per scholarship
- Approval probability (0–100%) calculated from weighted criteria match
- 20 real Indian scholarships seeded: NSP, CSSS, PMSS, AICTE Pragati, Inspire, Tata, Reliance, state schemes and more
- Missing criteria detection — tells user exactly what's blocking eligibility

**Backend files:**
- `model/Scholarship.java` — JPA entity with all eligibility fields
- `repository/ScholarshipRepository.java` — findByActiveTrue
- `config/ScholarshipSeeder.java` — seeds 20 real scholarships on startup
- `service/ScholarshipService.java` — eligibility engine, probability calculator, profile matcher
- `controller/ScholarshipController.java` — `GET /api/scholarships`

**Frontend files:**
- `pages/Scholarships.jsx` — cards with probability ring, eligible badge, match reasons, missing criteria, required docs, apply link
- `services/api.js` — `scholarshipService.getRecommendations(filter)`
- `App.jsx` — `/scholarships` now loads real page

**How eligibility works:**
- Category match (30pts) — SC/ST/OBC/EWS/ALL
- Gender match (15pts) — Male/Female/Any
- Marks check (25pts) — compares best available marks vs minimum required
- Income check (20pts) — compares annual income vs maximum allowed
- State check (10pts) — state-specific scholarships filtered
- `approvalProbability = (score / maxScore) × 100`
- Eligible = probability ≥ 50% AND no hard disqualifiers

---

### Feature 8 — Government Scheme Eligibility System
*Status: ✅ Complete*

**What was built:**
- `GET /api/schemes?category=ALL&filter=all` — returns schemes ranked by eligibility match
- 25 real Indian government schemes seeded: PMKVY, Mudra, Startup India, Ayushman Bharat, PM Awas, PMJDY, APY, DDU-GKY, PMEGP, e-SHRAM and more
- Live schemes fetched from MyScheme API (no API key needed)
- Eligibility engine checks: target group, gender, income, employment status, state
- Category filters: Education, Employment, Finance, Health, Housing, Agriculture, Social

**Backend files:**
- `model/Scheme.java` — JPA entity
- `repository/SchemeRepository.java`
- `config/SchemeSeeder.java` — seeds 25 real schemes on startup
- `service/SchemeService.java` — eligibility engine + MyScheme API live fetch
- `controller/SchemeController.java` — `GET /api/schemes`

**Frontend files:**
- `pages/Schemes.jsx` — category tabs, filter row, scheme cards with match bar, benefits highlight, required docs, apply link
- `services/api.js` — `schemeService.getSchemes(category, filter)`
- `App.jsx` — `/schemes` now loads real page

---

### Feature 9 — Career Guidance + Roadmap Engine
*Status: ✅ Complete*

**What was built:**
- `GET /api/career/roadmap?role=` — returns personalized career roadmap based on user profile + skills
- 8 career paths: Backend Developer, Frontend Developer, Full Stack, Data Scientist, DevOps, Android Developer, UI/UX Designer, Cybersecurity Analyst
- Auto-detects best career path from user's skills and degree
- Each step shows: skills you have, skills to learn, salary range, duration, completion %
- Trending skills section per career path
- Career path switcher

**Backend files:**
- `service/CareerRoadmapService.java` — rule-based engine, path detection, skill gap analysis
- `controller/CareerRoadmapController.java` — `GET /api/career/roadmap`

**Frontend files:**
- `pages/CareerRoadmap.jsx` — visual timeline roadmap, step cards, skill gap panel, trending skills, path switcher
- `components/Sidebar.jsx` — Career nav item added
- `App.jsx` — `/career` route added
- `services/api.js` — `careerService.getRoadmap(role)`

---

### Feature 10 — Skill Gap Analysis
*Status: ✅ Complete*

**What was built:**
- `GET /api/skills/gap?role=` — returns skill gap analysis for target career role
- Skills categorized as Critical / Important / Nice to Have per role
- Free learning resource (YouTube/Coursera) linked per missing skill
- Readiness score (0–100%) based on critical + important skill coverage
- Role switcher for 8 career paths
- 45+ skills mapped with free course links

**Backend files:**
- `service/SkillGapService.java` — gap engine, resource map, readiness calculator
- `controller/SkillGapController.java` — `GET /api/skills/gap`

**Frontend files:**
- `pages/SkillGap.jsx` — readiness ring, category bars, skill cards with course links, role switcher
- `components/Sidebar.jsx` — Skill Gap nav item added
- `App.jsx` — `/skills` route added
- `services/api.js` — `skillGapService.getGap(role)`

---

### Feature 11 — Resume Builder + ATS Analyzer
*Status: ✅ Complete*

**What was built:**
- `GET /api/resume` — builds resume data from profile + skills + documents
- `GET /api/resume/pdf` — generates and downloads ATS-friendly PDF using iText
- ATS score (0–100) with 7 checks: contact info, skills, education, experience, certifications, links, location
- Improvement suggestions linked to profile sections

**Backend files:**
- `service/ResumeService.java` — builds resume from all user data, calculates ATS score
- `service/ResumePdfService.java` — iText PDF generation with clean ATS-friendly layout
- `controller/ResumeController.java` — `GET /api/resume`, `GET /api/resume/pdf`
- `pom.xml` — iText 5.5.13.3 dependency added

**Frontend files:**
- `pages/ResumeBuilder.jsx` — live resume preview, ATS score ring, checks panel, suggestions, PDF download
- `services/api.js` — `resumeService.get()`, `resumeService.downloadPdf()`
- `App.jsx` — `/resume` now loads real page

---

### Feature 12 — AI Chat Assistant
*Status: ✅ Complete*

**What was built:**
- `POST /api/ai/chat` — Accepts message array, calls Groq API (llama3-8b model), returns AI-generated response
- Full conversation history support — maintains multi-turn dialogue context
- User profile context injection — AI references user's education, skills, location, experience in responses
- Smart system prompt — guides AI to give career-focused, India-specific, actionable advice
- Real-time message streaming UI with typing indicator
- Suggested questions for new users to get started

**Backend files:**
- `service/AIService.java` — Groq API integration, context building from profile + skills, system prompt generation
- `controller/AIController.java` — `POST /api/ai/chat` REST endpoint
- `application.properties` — Groq API key, model name, API URL configuration

**Frontend files:**
- `pages/AIAssistant.jsx` — Full-screen chat interface with message history, typing animation, suggested questions
- `components/Sidebar.jsx` — AI Assistant nav item added
- `services/api.js` — `aiService.chat(messages)` service method
- `App.jsx` — `/assistant` route added to DashboardLayout

**How it works:**
1. User types message in chat input → clicks Send
2. Frontend sends `POST /api/ai/chat` with conversation history array (role: "user"/"assistant", content: message)
3. Backend reads user email from JWT → loads user profile + skills from DB
4. Builds system prompt with: user's education, experience, skills, location, income context
5. Calls Groq API with system prompt + conversation history
6. Groq returns AI response (using llama3-8b model)
7. Response displayed in UI with timestamp
8. Full conversation history maintained for multi-turn dialogue

**System Prompt includes:**
- User's degree, CGPA, graduation year, branch
- Current experience level and employment status
- Annual income and location (city, state)
- Category (SC/ST/OBC/General)
- All extracted skills from uploaded documents
- Instructions to give India-specific, actionable, encouraging advice
- Focus on career guidance, scholarships, schemes, resume, interviews

**Example conversations the AI can help with:**
- "What scholarships can I apply for?" → AI suggests based on profile
- "How do I improve my career prospects?" → AI analyzes profile + suggests actions
- "Which government schemes am I eligible for?" → AI checks profile against schemes
- "Help me prepare for interviews" → AI gives role-specific tips
- "What skills should I learn?" → AI recommends based on career path + gaps
- "How to optimize my resume?" → AI gives specific improvement suggestions

**Tech used:** Groq API (llama3-8b model), Spring RestTemplate, JWT auth, React hooks, Framer Motion, Tailwind CSS


### Feature 13 — Future Career Simulation Engine
*Status: ✅ Complete*

**What was built:**
- `GET /api/career/simulate?role=` — returns 5-year salary projection based on user profile + skills
- Auto-detects best career role from user's skills and degree
- 5-year salary projection with milestone labels per year
- Optimistic scenario — shows salary if user learns top missing power skills
- Role comparison — salary at Year 3 across all 8 career paths
- Power skills tracker — shows which high-value skills user has vs missing
- Personalized career insights based on profile data

**Backend files:**
- `service/CareerSimulationService.java` — simulation engine, salary projection, role detection, insights
- `controller/CareerSimulationController.java` — `GET /api/career/simulate`

**Frontend files:**
- `pages/CareerSimulation.jsx` — animated bar chart, role switcher, optimistic toggle, role comparison bars, power skills panel, insights
- `services/api.js` — `simulationService.simulate(role)` added
- `App.jsx` — `/simulation` now loads real `CareerSimulation` page

**How it works:**
1. User visits `/simulation` → `GET /api/career/simulate` called
2. Backend detects career role from user's skills + degree (or uses selected role)
3. Detects experience level from profile experience field or skill count
4. Calculates current estimated salary with power skill boost multiplier
5. Projects salary over 5 years with 15-25% annual growth rates
6. Optimistic scenario adds 15% base boost + higher growth assuming power skills learned
7. Compares all 8 roles at Year 3 salary
8. Returns personalized insights (open source, certifications, job switching tips)

---

### Feature — Profile Improvements
*Status: ✅ Complete*

**What was built:**
- Date of Birth field replaced with native calendar date picker
- Annual Family Income replaced with dropdown (income ranges)
- Graduation Year replaced with year dropdown (last 20 years)
- Skills section added to Profile page — manually add/remove skills
- Skills shown as colored tags: blue = manual, green = OCR-extracted
- Type skill + press Enter or comma to add instantly
- `GET /api/profile/skills` — fetch user skills
- `POST /api/profile/skills` — add skill manually (source = MANUAL)
- `DELETE /api/profile/skills/{id}` — remove skill

**Backend files:**
- `controller/ProfileController.java` — 3 new skill endpoints added

**Frontend files:**
- `pages/ProfilePage.jsx` — DatePicker component, income dropdown, year dropdown, full Skills section
- `services/api.js` — `profileService.getSkills()`, `addSkill()`, `deleteSkill()` added

---

### Feature 14 — Notification & Reminder System
*Status: ⬜ Pending*

---

### Feature 15 — Admin Dashboard
*Status: ⬜ Pending*

---

### Feature 16 — Real-Time API Integrations
*Status: ⬜ Pending*

---

## How to Run (Will be updated per feature)

### Frontend
```bash
cd frontend
npm install
npm start
```

### Backend
```bash
cd backend
./mvnw spring-boot:run
```

### Database
```bash
mysql -u root -p < database/schema.sql
```

---

*This README is a living document. It will be updated after every feature is built.*
