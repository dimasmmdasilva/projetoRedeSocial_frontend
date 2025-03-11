# Etapa de Construção
FROM node:18 AS build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci --frozen-lockfile

COPY . .

RUN npm run build && npm cache clean --force

# Etapa de Deploy no Nginx
FROM nginx:latest AS deploy

WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

COPY --from=build /app/dist/ ./

RUN chmod -R 755 /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
