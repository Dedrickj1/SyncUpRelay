FROM python:3.9.18-alpine3.18

# Install system dependencies (Alpine uses 'apk')
RUN apk add --no-cache build-base postgresql-dev gcc python3-dev musl-dev libffi-dev

WORKDIR /var/www

COPY requirements.txt .

# 1. Upgrade pip/setuptools first to fix the 'pkg_resources' error
# 2. Install requirements
RUN pip install --upgrade pip setuptools && \
    pip install -r requirements.txt

COPY . .

# IMPORTANT: We move migrations and seeding to a shell script or the CMD 
# so they run when the container STARTS, not while it's BUILDING.
# For now, let's stick to getting the server up:

CMD gunicorn --worker-class gevent -w 1 --timeout 120 --bind 0.0.0.0:$PORT app:app