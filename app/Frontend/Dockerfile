# Stage 1: Build frontend
FROM node:22-slim AS builder

WORKDIR /app/frontend

COPY package*.json ./
RUN npm install

COPY . ./
RUN npm run build

# Stage 2: Serve with custom Nginx config
FROM nginx:alpine

COPY --from=builder /app/frontend/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]