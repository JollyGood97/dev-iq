FROM maven:3.8.4-openjdk-17 as builder
WORKDIR /app
COPY . .
RUN mvn clean package

FROM openjdk:17-jdk-alpine
COPY --from=builder /app/target/api-gateway-0.0.1-SNAPSHOT.jar /api-gateway.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/api-gateway.jar"]
