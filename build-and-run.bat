@echo off
echo ===================================================
echo   SpyWorld / InfiniteQuest - Production Packager
echo ===================================================

echo [1/3] Building Frontend with Vite...
cd frontend
call npm run build
if %errorlevel% neq 0 (
    echo Error building frontend!
    exit /b %errorlevel%
)

echo [2/3] Syncing Static Assets to Spring Boot...
cd ..
if not exist "backend\src\main\resources\static" mkdir "backend\src\main\resources\static"
xcopy /E /Y /I "frontend\dist\*" "backend\src\main\resources\static\"

echo [3/3] Packaging Standalone Production JAR...
cd backend
call mvnw.cmd clean package -DskipTests
if %errorlevel% neq 0 (
    echo Error packaging Spring Boot JAR!
    exit /b %errorlevel%
)

echo ===================================================
echo   BUILD COMPLETE! 
echo   Standalone JAR: backend\target\infinitequest-0.0.1-SNAPSHOT.jar
echo   Starting production server on http://localhost:8080 ...
echo ===================================================
java -jar target\infinitequest-0.0.1-SNAPSHOT.jar
