FROM openjdk:17-jdk-slim

WORKDIR /app

# Copy backend files
COPY backend/gradlew backend/
COPY backend/gradle backend/gradle
COPY backend/build.gradle backend/
COPY backend/settings.gradle backend/
COPY backend/src backend/src

# Make gradlew executable
RUN chmod +x backend/gradlew

# Build the application
WORKDIR /app/backend
RUN ./gradlew build -x test

# Expose port
EXPOSE 8080

# Run the application
CMD ["java", "-jar", "build/libs/ticketing-system-0.0.1-SNAPSHOT.jar"]
