FROM openjdk:21-slim

WORKDIR /app

# Copy all files into the Docker image
COPY . .

# Compile the Java application
RUN javac backend/src/Main.java backend/src/model/*.java backend/src/controller/*.java backend/src/service/*.java backend/src/repository/*.java

# Run the backend
CMD ["java", "-cp", "backend/src", "Main"]
