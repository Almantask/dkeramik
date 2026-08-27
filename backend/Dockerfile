FROM node:20-slim AS build
WORKDIR /src
COPY backend/package.json backend/package-lock.json ./
RUN npm ci
COPY backend/tsconfig.json ./
COPY backend/src ./src
RUN npx tsc

FROM node:20-slim
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8080
COPY backend/package.json backend/package-lock.json ./
RUN npm ci --omit=dev
COPY --from=build /src/dist ./dist
COPY backend/fonts ./fonts
RUN chown -R node:node /app
USER node
EXPOSE 8080
CMD ["node", "dist/index.js"]
