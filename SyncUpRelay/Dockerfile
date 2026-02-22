FROM python:3.9.18-alpine3.18

# Install system dependencies for Alpine
RUN apk add --no-cache build-base postgresql-dev gcc python3-dev musl-dev libffi-dev

WORKDIR /var/www

# Copy requirements
COPY requirements.txt .

# Upgrade pip and install all requirements
RUN pip install --upgrade pip "setuptools<70.0.0"
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the app
COPY . .

EXPOSE 10000

# Start command
CMD ["python3", "-m", "gunicorn", "-k", "geventwebsocket.gunicorn.workers.GeventWebSocketWorker", "-w", "1", "--timeout", "120", "--bind", "0.0.0.0:10000", "app:app"]