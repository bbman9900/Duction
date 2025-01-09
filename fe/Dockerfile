# 1. Nginx 이미지를 기반으로 생성
FROM nginx:alpine

# 2. Nginx의 기본 경로로 빌드된 React 파일을 복사
COPY dist/ /usr/share/nginx/html

# 3. Nginx 설정 파일 복사 (필요하면 설정 추가)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 4. Nginx 실행
CMD ["nginx", "-g", "daemon off;"]