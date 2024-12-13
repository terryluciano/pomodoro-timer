FROM node:20-alpine

COPY package.json .
COPY package-lock.json .

RUN npm install

EXPOSE 8080

CMD ["npm", "run", "dev"]
