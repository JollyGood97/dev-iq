FROM maven:3.8.4-openjdk-17 as builder
WORKDIR /app
COPY . .
RUN mvn clean package

FROM openjdk:17-jdk-alpine
COPY --from=builder /app/target/init-0.0.1-SNAPSHOT.jar /init.jar
EXPOSE 8084
ENTRYPOINT ["java", "-jar", "/init.jar"]
