
FROM python:3.9.18-alpine3.18

# Install system dependencies for Alpine
RUN apk add --no-cache build-base postgresql-dev gcc python3-dev musl-dev libffi-dev

# Set working directory
WORKDIR /var/www

# Copy requirements first for better caching
COPY requirements.txt .

# FIX 1: Explicitly install setuptools and upgrade pip
# FIX 2: Install gevent-websocket specifically to ensure the worker is available
RUN pip install --upgrade pip setuptools
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install --no-cache-dir gevent-websocket

# Copy the rest of the app
COPY . .

# Render defaults to 10000 for Docker services
EXPOSE 10000

# FIX 3: Use 'python -m gunicorn' to bypass the broken bin script
# FIX 4: Use the full GeventWebSocketWorker path
# FIX 5: Explicitly bind to 0.0.0.0:10000
CMD ["python", "-m", "gunicorn", "-k", "geventwebsocket.gunicorn.workers.GeventWebSocketWorker", "-w", "1", "--timeout", "120", "--bind", "0.0.0.0:10000", "app:app"]