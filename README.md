# Fintech Bank Management — DevOps Mini Project

A production-grade, full-stack core banking administration and financial ledger platform designed with automated CI/CD pipelines, containerized micro-architecture, and real-time observability.

---

## 🏛️ System Architecture

```mermaid
graph TD
    User["Client Browser"] -->|Port 80 (HTTP)| Nginx["Nginx Frontend Container (React SPA)"]
    Nginx -->|Proxy /api/| Backend["Spring Boot 3 API Container (Port 8080)"]
    Backend -->|JDBC Connection| MySQL[("MySQL 8.0 Database (Port 3306)")]
    Backend -->|/actuator/prometheus| Prometheus["Prometheus Server (Port 9090)"]
    Grafana["Grafana Dashboards (Port 3000)"] -->|Query Metrics| Prometheus
```

---

## 🚀 Key Features

1. **Executive Dashboard**:
   - Live metrics for registered customers, open deposit accounts, and cumulative ledger vault balance.
   - Real-time audit trail of the latest banking transactions.
2. **Customer Management (Full CRUD)**:
   - Client registration, profile update, KYC contact verification, and safe deletion.
3. **Multi-Account Facilities**:
   - Creation and tracking of **Savings** and **Current** accounts.
   - Automated generation of unique bank account identifiers (`FTBK...`).
4. **Cashier Desk & Financial Ledger**:
   - High-integrity transactional deposits and withdrawals (`@Transactional` with `BigDecimal`).
   - Anti-overdraft & negative balance protection.
   - Comprehensive account-specific statement ledger with timestamps and descriptions.
5. **Observability & DevOps**:
   - Spring Boot Actuator with Micrometer metrics exported to Prometheus.
   - Pre-provisioned Grafana monitoring dashboards for JVM heap, CPU usage, and REST API latency.
   - Complete GitHub Actions pipeline for continuous integration and automated testing.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite 5, Tailwind CSS, Lucide Icons, Axios |
| **Backend** | Java 17, Spring Boot 3.2, Spring Data JPA, Hibernate, Actuator |
| **Database** | MySQL 8.0 (Production / Container), H2 Database (In-Memory Tests) |
| **Testing** | JUnit 5, Spring Boot Test, Vitest |
| **Containerization** | Docker, Docker Compose (Multi-stage builds) |
| **Observability** | Prometheus, Grafana |
| **CI/CD** | GitHub Actions |

---

## 📦 Prerequisites

- **Java JDK 17+** (for local backend development)
- **Apache Maven 3.8+**
- **Node.js 20+** and **npm** (for local frontend development)
- **Docker** and **Docker Compose** (for complete containerized deployment)

---

## 🐳 Docker Deployment (One-Command Setup)

To build and run all 5 services (MySQL, Backend, Frontend, Prometheus, Grafana) together in isolated containers:

```bash
docker compose up --build -d
```

### Checking Service Status
```bash
docker compose ps
```

### Viewing Container Logs
```bash
# Follow all service logs
docker compose logs -f

# Follow specific container logs
docker compose logs -f backend
docker compose logs -f frontend
```

### Stopping Services (Preserving Database Data)
```bash
docker compose down
```

### Complete Reset (Wipe Database Volumes)
```bash
docker compose down -v
```

---

## 🌐 Service Access URLs

| Service | URL | Default Credentials |
|---|---|---|
| **Banking Administration Web UI** | [http://localhost](http://localhost) | None (Public UI) |
| **Spring Boot REST API** | [http://localhost:8080/api](http://localhost:8080/api) | None |
| **Actuator Health Endpoint** | [http://localhost:8080/actuator/health](http://localhost:8080/actuator/health) | None |
| **Prometheus Metrics** | [http://localhost:8080/actuator/prometheus](http://localhost:8080/actuator/prometheus) | None |
| **Prometheus Dashboard** | [http://localhost:9090](http://localhost:9090) | None |
| **Grafana Monitoring Dashboard** | [http://localhost:3000](http://localhost:3000) | `admin` / `admin` |

---

## 💻 Local Development (Without Docker)

### 1. Run Backend Locally
```bash
cd backend
mvn clean spring-boot:run
```
*(By default, local backend can connect to a local MySQL instance or configure `application.properties`)*

To run backend automated tests:
```bash
mvn test
```

### 2. Run Frontend Locally
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173). The Vite development server automatically proxies `/api` and `/actuator` requests to `http://localhost:8080`.

To run frontend automated tests:
```bash
npm test
```

---

## 🔄 Continuous Integration (CI) Pipeline

The repository includes a production-ready GitHub Actions workflow in [`.github/workflows/ci.yml`](.github/workflows/ci.yml) that executes on every push and pull request to `main` or `master`:
- **Backend Job**: Sets up Temurin JDK 17, caches Maven dependencies, and executes `mvn clean verify` (running all 6 Spring Boot tests).
- **Frontend Job**: Sets up Node 20, caches npm packages, runs Vitest unit tests, and verifies `npm run build` production bundling.

---

## 📊 Monitoring & Observability Details

- **Prometheus Scrape Configuration**: Configured in [`docker/prometheus/prometheus.yml`](docker/prometheus/prometheus.yml) to poll Spring Boot Micrometer metrics at 5-second intervals.
- **Grafana Provisioning**: Automatically registers Prometheus as the default datasource and imports the custom **Fintech Bank Management — System Observability** dashboard (`banking-metrics.json`) showing:
  - JVM CPU usage vs Host CPU usage
  - JVM Heap memory allocated and consumed
  - HTTP Request throughput rate (`sum(rate(http_server_requests_seconds_count[1m]))`)
  - Endpoint latency percentiles and maximum durations

---

## 📋 Verification Evidence Checklist for Submission

Collect the following evidence/screenshots for your mini project submission:
1. **GitHub Actions**: Green pipeline checkmark for both backend and frontend jobs.
2. **Docker Compose**: Output of `docker compose ps` showing 5 healthy containers.
3. **Application Dashboard**: Screenshot showing non-zero customer count, total balance, and recent transaction log.
4. **Deposit/Withdrawal Flow**: Evidence of successful transaction execution and validation error preventing overdraft.
5. **Prometheus Targets**: Screenshot of `http://localhost:9090/targets` showing `fintech-bank-backend` in state `UP`.
6. **Grafana Dashboard**: Screenshot of the provisioned dashboard displaying live JVM and HTTP request time-series graphs.
