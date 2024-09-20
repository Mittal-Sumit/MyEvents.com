# Use an official Node runtime as a parent image for building the React app
FROM node:18 as build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json /app/
RUN npm install

# Copy the rest of the application code and build the app
COPY . /app/
RUN npm run build

# Production stage: Use Nginx to serve the built React app
FROM nginx:alpine

# Copy the custom Nginx config file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the build output from the previous stage
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80 for the Nginx server
EXPOSE 80

# Start the Nginx server
CMD ["nginx", "-g", "daemon off;"]