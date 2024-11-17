# Use a lightweight web server as a parent image
FROM nginx:alpine

# Set the working directory in the container
WORKDIR /usr/share/nginx/html

# Copy the built frontend files to the working directory
COPY . .

# Copy custom NGINX configuration
COPY default.conf /etc/nginx/conf.d/default.conf

# Expose port 80 to allow outside access to your application
EXPOSE 80

# Default command to start NGINX
CMD ["nginx", "-g", "daemon off;"]
