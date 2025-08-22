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

# This single command now installs all necessary packages,
# including the correct versions of gevent and greenlet,
# directly from your requirements file.
RUN pip install -r requirements.txt

COPY . .

RUN flask db upgrade
RUN flask seed all

# This start command is now correct because the dependencies are correct.
CMD ["gunicorn", "--worker-class", "gevent", "-w", "1", "--timeout", "120", "app:app"]