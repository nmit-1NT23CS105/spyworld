# ==========================================
# Multi-Stage Dockerfile for SpyWorld (InfiniteQuest)
# Builds Frontend + Backend into a single self-contained production container
# ==========================================

# Stage 1: Build React + Vite Frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci --prefer-offline --no-audit
COPY frontend/ ./
RUN npm run build

# Stage 2: Build Spring Boot Executable JAR
FROM eclipse-temurin:21-jdk-alpine AS backend-builder
WORKDIR /app/backend
# Copy Maven wrapper and pom first for layer caching
COPY backend/.mvn/ .mvn/
COPY backend/mvnw backend/pom.xml ./
RUN ./mvnw dependency:go-offline -B || true

# Copy source code and pre-compiled frontend static assets from Stage 1
COPY backend/src/ src/
COPY --from=frontend-builder /app/frontend/dist/ src/main/resources/static/

RUN ./mvnw clean package -DskipTests -B

# Stage 3: Lightweight Production JRE Runtime
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Run as non-root user for cloud security best practices
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Copy built fat JAR from backend builder
COPY --from=backend-builder /app/backend/target/infinitequest-0.0.1-SNAPSHOT.jar app.jar

# Cloud deployment dynamic port injection
ENV PORT=8080
EXPOSE 8080

ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-Dserver.port=${PORT}", "-jar", "app.jar"]
