# Build frontend image (stage 1)
FROM nikolaik/python-nodejs:latest  AS frontend-builder
WORKDIR /app

COPY frontend /app/
COPY backend /app/

WORKDIR /app/frontend
RUN npm install 
RUN npm run build


WORKDIR /app/backend
RUN pip install -r requirements.txt


# Copy static files from built frontend (stage 3)
COPY  /app/frontend/build /app/backend/static

# Expose Django port
EXPOSE 8000

# Set working directory for Django app
WORKDIR /app/backend

# Run migrations and start Django development server
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
