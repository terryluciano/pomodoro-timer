FROM node:20-alpine AS build

COPY . .

RUN npm install

RUN npm run build

FROM nginx

COPY --from=build ./dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
