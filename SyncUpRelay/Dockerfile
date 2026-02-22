# Use a stable Python slim image
FROM python:3.9-slim

# Install OS dependencies needed for PostgreSQL and building packages
RUN apt-get update && apt-get install -y \
    gcc \
    python3-dev \
    libpq-dev \
    build-essential \
 && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /var/www

# Copy requirements and install them
COPY requirements.txt .
RUN pip install --upgrade pip setuptools wheel
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose port 10000 (Render will map the service port automatically)
EXPOSE 10000

# Start Gunicorn
CMD ["gunicorn", "--worker-class", "gevent", "-w", "1", "--timeout", "120", "app:app"]