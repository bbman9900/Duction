# 1. Base image
FROM openjdk:17-jdk-alpine

# 2. Application JAR file 위치
ARG JAR_FILE=build/libs/be-0.0.1-SNAPSHOT.jar

# 3. 작업 디렉토리 설정
WORKDIR /app

# 4. JAR 파일 복사
COPY ${JAR_FILE} app.jar

# 5. 환경 변수 파일 복사
COPY local.env /app/local.env

# 6. 환경 변수 로드 및 애플리케이션 실행
ENTRYPOINT ["sh", "-c", "export $(cat /app/local.env | xargs) && java -jar app.jar"]