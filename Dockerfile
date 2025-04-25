FROM python:3.10

# Install Node.js and npm
RUN apt-get update && \
    apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs && \
    npm install -g pnpm

RUN npm install -g pnpm

COPY . .
RUN cd frontend
RUN pnpm install
RUN pnpm build
RUN cd ..
RUN cd backend
RUN pip install --no-cache-dir -r requirements.txt
RUN cd ..
# Expose ports for frontend and backend
EXPOSE 8080 8000

# Set environment variables
ENV DJANGO_SECRET_KEY=your-secret-key
ENV DEBUG=1

# Run both frontend and backend servers
CMD (cd backend && python manage.py runserver 0.0.0.0:8000) & \
    (cd frontend && pnpm serve --port 8080)