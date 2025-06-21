FROM node:18-alpine

WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy app source
COPY . .

# Create uploads directory
RUN mkdir -p uploads

# Create logs directory
RUN mkdir -p logs

# Set permissions
RUN chmod -R 755 uploads logs

# Expose port
EXPOSE 3000

# Run the app
CMD ["node", "src/server.js"]
