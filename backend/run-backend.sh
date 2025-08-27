#!/bin/bash

echo "Starting Ticketing System Backend..."
echo

# Check if Java is available
if ! command -v java &> /dev/null; then
    echo "ERROR: Java not found. Please install Java 17 or higher."
    exit 1
fi

echo "Java version:"
java -version
echo

# Set classpath and run the application
echo "Starting Spring Boot application..."
echo "Server will be available at: http://localhost:8080"
echo "Press Ctrl+C to stop the server"
echo

# Create a simple classpath with the source directories
CLASSPATH="src/main/resources:src/main/java"

# Run the Spring Boot application directly
java -cp "$CLASSPATH" -Dspring.profiles.active=default com.ticketing.TicketingSystemApplication
