FROM node:22-slim

WORKDIR /app/backend

# Copy package.json and install dependencies
COPY package*.json ./

RUN npm install

# Copy the rest of the application code
COPY . ./

EXPOSE 4000

CMD ["node", "index.js"]