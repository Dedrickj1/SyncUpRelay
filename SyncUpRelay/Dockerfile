FROM python:3.9.18-alpine3.18

# Install system dependencies for Alpine
RUN apk add --no-cache build-base postgresql-dev gcc python3-dev musl-dev libffi-dev

# Set working directory
WORKDIR /var/www

# Copy requirements and install
COPY requirements.txt .
RUN pip install --upgrade pip setuptools
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the app
COPY . .

# Render uses port 10000 by default for Docker
EXPOSE 10000

# Start Gunicorn using the python module path to avoid script errors
# We use the specific GeventWebSocketWorker for your SocketIO needs
CMD ["python3", "-m", "gunicorn", "-k", "geventwebsocket.gunicorn.workers.GeventWebSocketWorker", "-w", "1", "--timeout", "120", "--bind", "0.0.0.0:10000", "app:app"]