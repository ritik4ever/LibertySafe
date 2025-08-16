FROM node:18-alpine

WORKDIR /app

RUN apk add --no-cache curl

COPY package*.json ./
RUN npm ci --only=production

COPY . .

# Create uploads directory
RUN mkdir -p uploads

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S libertysafe -u 1001
RUN chown -R libertysafe:nodejs /app
USER libertysafe

EXPOSE 5000

# Start with Node.js directly
CMD ["node", "src/index.js"]