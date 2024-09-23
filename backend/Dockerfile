# Use an official Python runtime as a parent image
FROM python:3.12-slim

# Install PostgreSQL development libraries and other dependencies
RUN apt-get update && apt-get install -y libpq-dev gcc

# Set the working directory inside the container
WORKDIR /app

# Copy the requirements file and install dependencies
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt


# Copy the rest of the application code
COPY . /app/

# Expose the port the app runs on
EXPOSE 8000

# Define the command to run the application
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
