FROM maven:3.8.4-openjdk-17 as builder
WORKDIR /app
COPY . .
RUN mvn clean package

FROM openjdk:17-jdk-alpine
COPY --from=builder /app/target/commit-tracker-0.0.1-SNAPSHOT.jar /commit-tracker.jar
EXPOSE 8081
ENTRYPOINT ["java", "-jar", "/commit-tracker.jar"]
