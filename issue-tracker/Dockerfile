FROM maven:3.8.4-openjdk-17 as builder
WORKDIR /app
COPY . .
RUN mvn clean package

FROM openjdk:17-jdk-alpine
COPY --from=builder /app/target/issue-tracker-0.0.1-SNAPSHOT.jar /issue-tracker.jar
EXPOSE 8082
ENTRYPOINT ["java", "-jar", "/issue-tracker.jar"]
