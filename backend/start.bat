@echo off
echo Starting Ticketing System Backend...
echo.

cd /d "%~dp0"

echo Checking Java installation...
java -version
if %ERRORLEVEL% neq 0 (
    echo ERROR: Java not found. Please install Java 17 or higher.
    pause
    exit /b 1
)

echo.
echo Starting Spring Boot application...
echo Server will be available at: http://localhost:8080
echo Press Ctrl+C to stop the server
echo.

java -cp "src/main/resources;src/main/java" -Dspring.profiles.active=default com.ticketing.TicketingSystemApplication

pause
