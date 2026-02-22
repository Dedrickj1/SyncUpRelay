FROM python:3.9.18-alpine3.18

# Install system dependencies
RUN apk add --no-cache build-base postgresql-dev gcc python3-dev musl-dev libffi-dev

WORKDIR /var/www

# Copy and install requirements
COPY requirements.txt .
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the app
COPY . .

# EXTREMELY IMPORTANT: We install setuptools AGAIN here, 
# just before the container finishes building, to force it into the image.
RUN pip install --no-cache-dir setuptools==69.0.3

EXPOSE 10000

# We use a shell-style CMD to ensure the environment variables are active
CMD python3 -m gunicorn -k geventwebsocket.gunicorn.workers.GeventWebSocketWorker -w 1 --timeout 120 --bind 0.0.0.0:10000 app:app