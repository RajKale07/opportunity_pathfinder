#!/usr/bin/env bash
echo "========================================================"
echo " Opportunity Pathfinder - AI Career Operating System"
echo "========================================================"
echo ""

echo "[1/3] Starting Spring Boot Backend (Port 8080)..."
(cd backend && ./mvnw spring-boot:run || mvn spring-boot:run) &
BACKEND_PID=$!

echo "[2/3] Starting React Frontend Dev Server (Port 5173)..."
(cd frontend && npm run dev) &
FRONTEND_PID=$!

echo ""
echo "========================================================"
echo " System is starting!"
echo " Frontend: http://localhost:5173"
echo " Backend:  http://localhost:8080"
echo " Swagger:  http://localhost:8080/swagger-ui.html"
echo ""
echo " Demo Credentials:"
echo " Email:    student@example.com"
echo " Password: password123"
echo "========================================================"

wait $BACKEND_PID $FRONTEND_PID
