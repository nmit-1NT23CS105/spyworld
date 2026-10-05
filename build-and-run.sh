#!/usr/bin/env bash
set -e

echo "==================================================="
echo "  SpyWorld / InfiniteQuest - Production Packager"
echo "==================================================="

echo "[1/3] Building Frontend with Vite..."
cd frontend
npm run build
cd ..

echo "[2/3] Syncing Static Assets to Spring Boot..."
mkdir -p backend/src/main/resources/static
cp -r frontend/dist/* backend/src/main/resources/static/

echo "[3/3] Packaging Standalone Production JAR..."
cd backend
./mvnw clean package -DskipTests

echo "==================================================="
echo "  BUILD COMPLETE!"
echo "  Standalone JAR: backend/target/infinitequest-0.0.1-SNAPSHOT.jar"
echo "  Starting production server on http://localhost:8080 ..."
echo "==================================================="
java -jar target/infinitequest-0.0.1-SNAPSHOT.jar
