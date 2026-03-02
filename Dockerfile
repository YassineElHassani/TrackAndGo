FROM node:22-alpine

# Set the working directory
WORKDIR /app

# Enable legacy peer deps just in case for older React Native versions, though 19.1.0 and 0.81 are very recent
# RUN npm config set legacy-peer-deps true
RUN npm config set fund false
RUN npm config set audit false

# Copy the package.json and package-lock.json
COPY package*.json ./

# Install dependencies using npm install (or ci)
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose Metro bundler port and standard web port if needed
EXPOSE 8082
EXPOSE 19000
EXPOSE 19001
EXPOSE 19002

# The default command to start the Metro bundler
CMD ["npm", "run", "android"]
