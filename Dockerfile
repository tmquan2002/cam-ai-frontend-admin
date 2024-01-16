FROM node:21-alpine3.18 AS builder
WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .
RUN npm run build

FROM node:21-alpine3.18
WORKDIR /app/react-app
COPY --from=builder /app/dist /app/react-app/dist
COPY package*.json .
COPY vite.config.ts .
RUN npm install typescript
EXPOSE 4173
CMD npm run preview -- --host