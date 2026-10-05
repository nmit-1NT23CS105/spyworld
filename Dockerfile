# ==========================================
# Multi-Stage Dockerfile for SpyWorld (InfiniteQuest)
# Optimized for Render / Cloud Run (Low Memory & Fast Startup)
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
ENV MAVEN_OPTS="-Xmx512m -XX:+TieredCompilation -XX:TieredStopAtLevel=1"
COPY backend/.mvn/ .mvn/
COPY backend/mvnw backend/pom.xml ./
RUN chmod +x ./mvnw && ./mvnw dependency:go-offline -B || true

# Copy source code and pre-compiled frontend static assets from Stage 1
COPY backend/src/ src/
COPY --from=frontend-builder /app/frontend/dist/ src/main/resources/static/

RUN ./mvnw clean package -DskipTests -B

# Stage 3: Lightweight Production JRE Runtime
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Create data directory and non-root user with proper file permissions
RUN addgroup -S appgroup && adduser -S appuser -G appgroup && \
    mkdir -p /app/data && \
    chown -R appuser:appgroup /app

USER appuser

# Copy built fat JAR from backend builder
COPY --from=backend-builder --chown=appuser:appgroup /app/backend/target/infinitequest-0.0.1-SNAPSHOT.jar app.jar

ENV PORT=10000
EXPOSE 10000

# Run with shell expansion for PORT and container-aware memory tuning (suited for 512MB RAM free tier)
ENTRYPOINT ["sh", "-c", "exec java -Djava.security.egd=file:/dev/./urandom -XX:+UseSerialGC -Xss512k -XX:MaxRAMPercentage=75.0 -Dserver.port=${PORT:-10000} -jar app.jar"]
