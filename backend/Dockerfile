# Build Stage
FROM maven:3.9-eclipse-temurin-17-alpine AS builder
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn clean package -DskipTests

# Runtime Stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
RUN addgroup -S fintech && adduser -S fintech -G fintech
USER fintech:fintech
COPY --from=builder /app/target/bank-management-1.0.0.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
