#!/bin/bash
set -e

echo "🐳 TRAC App - Docker Hub Publisher"
echo "==================================="

# 1. Ask for Docker Hub username
read -p "Enter your Docker Hub username: " DOCKER_USER

if [ -z "$DOCKER_USER" ]; then
    echo "Error: Username cannot be empty."
    exit 1
fi

IMAGE_NAME="trac-app"
FULL_IMAGE="$DOCKER_USER/$IMAGE_NAME:latest"

echo ""
echo "Building image locally..."
docker build -f Dockerfile.combined -t $IMAGE_NAME .

echo ""
echo "Tagging image as $FULL_IMAGE..."
docker tag $IMAGE_NAME $FULL_IMAGE

echo ""
echo "Pushing to Docker Hub..."
echo "(You may be asked to log in if you haven't run 'docker login' recently)"
docker push $FULL_IMAGE

echo ""
echo "✅ Success! Your app is live at $FULL_IMAGE"
echo "To run it elsewhere:"
echo "  docker run -p 5000:5000 -e DB_HOST=... -e DB_PASS=... $FULL_IMAGE"
