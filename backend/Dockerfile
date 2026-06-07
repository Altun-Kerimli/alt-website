# Use official lightweight Python image
FROM python:3.11-slim

# Install system dependencies: 
# FFmpeg (media processing), Node.js (yt-dlp signatures), libzbar0 (QR decoding)
RUN apt-get update && \
    apt-get install -y ffmpeg nodejs libzbar0 && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy dependency list and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the application code
COPY . .

# Expose the port FastAPI runs on
EXPOSE 8000

# Start the master routing server
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]