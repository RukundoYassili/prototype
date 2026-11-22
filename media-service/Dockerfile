FROM node:24-bookworm-slim
ENV NODE_ENV=production
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY src ./src
COPY editorial ./editorial
RUN groupadd --gid 10001 vugamedia && useradd --uid 10001 --gid 10001 --no-create-home vugamedia
USER 10001:10001
EXPOSE 3000
CMD ["node", "src/server.mjs"]
