FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .

# Install system dependencies for building Python packages
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Expose port (default 5000)
EXPOSE 5000

# Run the application
CMD ["python", "app.py"]
