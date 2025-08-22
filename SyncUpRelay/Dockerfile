FROM python:3.9.18-alpine3.18


RUN apk add --no-cache build-base postgresql-dev gcc python3-dev musl-dev


ARG FLASK_APP
ARG FLASK_ENV
ARG DATABASE_URL
ARG SCHEMA
ARG SECRET_KEY


WORKDIR /var/www


COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install psycopg2  # Only psycopg2, no gevent

# Copy project files
COPY . .

# Run database migrations and seeds
RUN flask db upgrade
RUN flask seed all

# Start Gunicorn with Eventlet worker
CMD ["gunicorn", "-k", "eventlet", "-w", "1", "--timeout", "120", "SyncUpRelay:app"]
