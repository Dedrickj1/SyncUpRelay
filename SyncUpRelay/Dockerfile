FROM python:3.9.18-alpine3.18

RUN apk add build-base
RUN apk add postgresql-dev gcc python3-dev musl-dev

ARG FLASK_APP
ARG FLASK_ENV
ARG DATABASE_URL
ARG SCHEMA
ARG SECRET_KEY

WORKDIR /var/www

COPY requirements.txt .

# 1. Install all dependencies from your requirements file
RUN pip install -r requirements.txt

# 2. Explicitly install gevent and its websocket library
# This ensures the necessary packages for your start command are present.
RUN pip install gevent gevent-websocket

COPY . .

RUN flask db upgrade
RUN flask seed all

# This start command will now work because gevent is installed.
CMD ["gunicorn", "--worker-class", "gevent", "-w", "1", "--timeout", "120", "app:app"]