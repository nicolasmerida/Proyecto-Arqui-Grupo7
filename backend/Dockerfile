# 1. Usamos una versión oficial y súper liviana de Java 17 como base
FROM eclipse-temurin:17-jdk-alpine

# 2. Copiamos el archivo .jar que compilaste en el Paso 1 y lo metemos al contenedor con el nombre "app.jar"
COPY target/*.jar app.jar

# 3. Le avisamos a Docker que nuestro programa se comunica por el puerto 8080
EXPOSE 8080

# 4. Le damos el comando de arranque: "Cuando te prendan, ejecutá este archivo de Java"
ENTRYPOINT ["java", "-jar", "/app.jar"]