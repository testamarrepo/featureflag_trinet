# Build frontend image (stage 1)
FROM node:alpine AS frontend-builder

WORKDIR /app

COPY frontend ./
RUN npm install -g npm
RUN npm install -g react-scripts
RUN npm install --legacy-peer-deps
COPY . .

RUN npm run build

# Build backend image (stage 2)
FROM python:3.8-slim

WORKDIR /app

COPY backend ./
RUN pip install -r requirements.txt

# Copy static files from built frontend (stage 3)
COPY --from=frontend-builder /app/frontend/build /app/backend/static

# Expose Django port
EXPOSE 8000

# Set working directory for Django app
WORKDIR /app/backend

# Run migrations and start Django development server
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
