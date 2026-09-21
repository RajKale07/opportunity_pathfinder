# Development Environment Audit & Setup Guide

**Audit Date**: September 2026  
**System Architecture**: Microsoft Windows 11 Home Single Language (64-bit, Build 10.0.26200)  
**Disk Space**: Drive D: 226 GB Free | Drive C: 66 GB Free  

---

## 1. Environment Inventory Matrix

| Tool / Runtime | Installed Status | Detected Version | Required Version | Verification Command | Notes |
| :--- | :---: | :--- | :--- | :--- | :--- |
| **Java (JDK)** | **YES** | OpenJDK 17.0.18 (Temurin-17) | 17+ or 21 | `java -version` | Active runtime. Backend configured for Java 17 compatibility. |
| **Maven** | **YES** | Apache Maven 3.9.6 | 3.8+ | `mvn -version` | Configured at `C:\maven\apache-maven-3.9.6`. |
| **Node.js** | **YES** | v25.9.0 | 18+ | `node -v` | Installed and operational. |
| **npm** | **YES** | 11.12.1 | 9+ | `npm -v` | Installed and operational. |
| **Python** | **YES** | Python 3.11.9 | 3.10+ | `python --version` | Installed at `C:\Users\rkale\AppData\Local\Programs\Python\Python311\`. |
| **pip** | **YES** | pip 24.0 | 22+ | `pip --version` | Operational. |
| **Git** | **YES** | git 2.53.0.windows.1 | 2.x+ | `git --version` | Operational. |
| **PostgreSQL** | **Optional (Dual Mode)** | `psql` client not on host PATH | 14+ | `psql --version` | Dual persistence enabled: Default dev uses persistent PostgreSQL-mode file database (`./data/pathfinder_db`). Production uses PostgreSQL 16. |
| **Docker** | **Optional** | Not detected on PATH | 24+ | `docker --version` | Optional for local standalone running; `docker-compose.yml` provided for containerized deployments. |

---

## 2. Standalone vs. Containerized Execution

### A. Local Standalone Execution (Default, Ready Now)
The application has been engineered to run directly on this workstation without requiring background system services or container virtualization:
1. **Backend**: Powered by Spring Boot 3 on Java 17. By default, it runs with `spring.profiles.active=dev`, persisting entities in PostgreSQL-compatible SQL mode under `./data/pathfinder_db`.
2. **Frontend**: Vite + React 19 + TypeScript, running on `http://localhost:5173`.
3. **ML Service**: Python 3.11 FastAPI service, running on `http://localhost:8001`.

### B. Production / PostgreSQL Container Execution (Docker)
When Docker Desktop or native PostgreSQL is available:
```bash
# 1. Start PostgreSQL & services via Docker Compose
docker compose up -d postgres

# 2. Run backend with production profile
mvn spring-boot:run -Dspring-boot.run.profiles=prod
```

---

## 3. Verification Commands
```powershell
# Verify Java & Maven
java -version
mvn -version

# Verify Node & NPM
node -v
npm -v

# Verify Python
python --version
```
