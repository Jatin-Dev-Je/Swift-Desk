FROM openjdk:17-jdk-slim

WORKDIR /app

# Copy all backend files
COPY backend/ backend/

# Make gradlew executable
RUN chmod +x backend/gradlew

# Build the application
WORKDIR /app/backend
RUN ./gradlew build -x test

# Expose port
EXPOSE 8080

# Run the application
CMD ["java", "-jar", "build/libs/ticketing-system-0.0.1-SNAPSHOT.jar"]
