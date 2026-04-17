# ---------- Build Stage ----------
FROM maven:3.9.9-eclipse-temurin-17 AS build

WORKDIR /app

COPY . .

RUN mvn clean package -DskipTests

# ---------- Run Stage ----------
FROM eclipse-temurin:17-jdk

WORKDIR /app

# Copy generated jar (auto-detect jar name)
COPY --from=build /app/target/*.jar greencart.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "greencart.jar"]

