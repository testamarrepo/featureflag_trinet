# Use a lightweight Node image for building React app
FROM node:alpine AS frontendRunner

WORKDIR /app

COPY frontend ./
COPY backend ./


WORKDIR /app/frontend

RUN npm install

# Build React app for production
COPY . .
RUN npm run build



# Use a Python image for the backend
FROM python:3.8-slim

WORKDIR /app/backend

RUN pip install -r requirements.txt

# Copy static files from React build
COPY --from=frontend /app/frontend/build /app/backend/static

# Expose Django port
EXPOSE 8000

# Set working directory for Django app
WORKDIR /app/backend

# Run migrations and start Django development server
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
