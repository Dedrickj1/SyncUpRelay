FROM python:3.9.18-alpine3.18

RUN apk add --no-cache build-base postgresql-dev gcc python3-dev musl-dev

WORKDIR /var/www

COPY requirements.txt .

# 🔥 IMPORTANT FIX
RUN pip install --upgrade pip setuptools wheel
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# RUN flask db upgrade
#RUN flask seed all

CMD ["gunicorn", "--worker-class", "gevent", "-w", "1", "--timeout", "120", "app:app"]