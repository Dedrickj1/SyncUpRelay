FROM python:3.9-slim

RUN apt-get update && apt-get install -y gcc python3-dev libpq-dev build-essential

WORKDIR /var/www

COPY requirements.txt .

RUN pip install --upgrade pip setuptools wheel
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["gunicorn", "--worker-class", "gevent", "-w", "1", "--timeout", "120", "app:app"]
