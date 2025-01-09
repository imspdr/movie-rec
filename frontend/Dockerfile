# build react
FROM node:22 AS builder
COPY . .
RUN npm install
RUN npm run build

# nginx on
FROM nginx:latest
RUN rm -rf /etc/nginx/conf.d
COPY ./nginx.conf /etc/nginx/conf.d/

COPY --from=builder /docs /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]