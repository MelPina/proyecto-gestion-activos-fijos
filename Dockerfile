FROM node:18-alpine AS builder
WORKDIR /app
COPY app/package*.json ./app/
RUN npm install
COPY app/ ./app/
RUN npm run build
RUN npm run export

FROM nginx:stable-alpine
COPY --from=builder /app/out /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
