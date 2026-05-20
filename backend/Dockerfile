# Use official lightweight Python image
FROM python:3.11-slim

# Install system dependencies: FFmpeg for processing, Node.js for signature decryption
RUN apt-get update && \
    apt-get install -y ffmpeg nodejs && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy dependency list and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the application code
COPY media-engine.py .

# Expose the port FastAPI runs on
EXPOSE 8000

# Start the server
CMD ["uvicorn", "media-engine:app", "--host", "0.0.0.0", "--port", "8000"]