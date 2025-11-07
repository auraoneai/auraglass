# 🚀 AuraGlass AI System - Production Deployment Guide

## Quick Start

The AuraGlass AI system is now production-ready with real AI integrations, WebSocket collaboration, and enterprise security.

## 📋 Prerequisites

- Node.js 18+ and npm
- Redis (for caching)
- Docker & Docker Compose (optional)
- API Keys for AI services

## 🔧 Installation Steps

### 1. Install Dependencies

```bash
# Install with legacy peer deps to avoid conflicts
npm install --legacy-peer-deps
```

### 2. Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit .env and add your API keys:
# - OPENAI_API_KEY (required for AI features)
# - PINECONE_API_KEY (for semantic search)
# - GOOGLE_VISION_API_KEY (for image processing)
# - REMOVEBG_API_KEY (for background removal)
# - JWT_SECRET (generate a secure random string)
```

### 3. Build the Project

```bash
# Build the application
npm run build

# Type checking (may show some warnings - non-blocking)
npm run typecheck
```

## 🏃 Running the Application

### Option 1: Local Development

```bash
# Start Redis (if installed locally)
redis-server

# Start all servers
npm run server:all

# Or start individually:
npm run server:api      # API server on port 3002
npm run server:websocket # WebSocket server on port 3001

# In another terminal, start the frontend
npm run dev  # Development mode on port 3000
```

### Option 2: Docker Deployment (Recommended)

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Option 3: Production Script

```bash
# Make script executable
chmod +x scripts/deploy.sh

# Run deployment
./scripts/deploy.sh production
```

## 🌐 Service URLs

Once running, access the services at:

- **Frontend**: http://localhost:3000
- **API Server**: http://localhost:3002
- **WebSocket**: ws://localhost:3001
- **Health Check**: http://localhost:3002/health

## 🎯 Key Features

### AI Services
- ✅ **OpenAI GPT-4**: Smart form generation, content summarization
- ✅ **Semantic Search**: Vector embeddings with Pinecone
- ✅ **Computer Vision**: Google Vision API for image analysis
- ✅ **Background Removal**: Remove.bg integration

### Infrastructure
- ✅ **Real-time Collaboration**: WebSocket server with room management
- ✅ **Authentication**: JWT tokens with role-based access
- ✅ **Caching**: Redis with automatic fallback
- ✅ **Rate Limiting**: Protection for AI endpoints
- ✅ **Error Monitoring**: Sentry integration

## 📁 Project Structure

```
AuraGlass/
├── src/
│   ├── services/
│   │   ├── ai/              # AI service implementations
│   │   ├── auth/            # Authentication & authorization
│   │   └── websocket/       # Real-time collaboration
│   └── components/
│       └── ai/              # AI-powered React components
├── server/
│   ├── api-server.js        # Express API server
│   └── websocket-server.js  # Socket.io server
├── docker-compose.yml       # Docker orchestration
├── nginx.conf              # Reverse proxy configuration
└── scripts/
    └── deploy.sh           # Deployment automation
```

## 🔐 Security Configuration

1. **Generate secure JWT secret**:
```bash
openssl rand -base64 32
```

2. **Configure CORS** in `.env`:
```
CLIENT_URL=https://yourdomain.com
```

3. **Enable SSL** (production):
- Add SSL certificates to `ssl/` directory
- Update nginx.conf with your domain

## 📊 Monitoring

### Health Check
```bash
curl http://localhost:3002/health
```

### View Logs
```bash
# Docker logs
docker-compose logs -f api websocket

# PM2 logs (if using PM2)
pm2 logs
```

## 🧪 Testing

```bash
# Run tests
npm test

# Linting
npm run lint:check

# Type checking
npm run typecheck
```

## 🚢 Production Deployment

### Using PM2
```bash
# Install PM2 globally
npm install -g pm2

# Start services
pm2 start server/api-server.js --name aura-api
pm2 start server/websocket-server.js --name aura-websocket

# Save configuration
pm2 save
pm2 startup
```

### Using systemd
Create service files in `/etc/systemd/system/` for automatic startup.

### Cloud Deployment
The system is ready for deployment on:
- AWS (ECS, EKS, EC2)
- Google Cloud (GKE, Cloud Run)
- Azure (AKS, Container Instances)
- Heroku
- DigitalOcean

## 📝 Environment Variables

Critical variables that must be configured:

```env
# Required
OPENAI_API_KEY=sk-...
JWT_SECRET=your-secure-secret

# Recommended
REDIS_URL=redis://localhost:6379
PINECONE_API_KEY=...
PINECONE_ENVIRONMENT=us-east-1

# Optional (for full features)
GOOGLE_VISION_API_KEY=...
REMOVEBG_API_KEY=...
SENTRY_DSN=...
```

## 🔧 Troubleshooting

### Common Issues

1. **Dependencies fail to install**:
   ```bash
   npm install --legacy-peer-deps --force
   ```

2. **Redis connection error**:
   - Ensure Redis is running: `redis-cli ping`
   - Check REDIS_URL in .env

3. **TypeScript errors**:
   - Non-blocking for runtime
   - Can be fixed by installing type definitions

4. **Port already in use**:
   ```bash
   # Find process using port
   lsof -i :3001
   # Kill process
   kill -9 <PID>
   ```

## 📚 API Documentation

### AI Endpoints

**Generate Form Fields**
```bash
POST /api/ai/generate-form
{
  "context": "user registration",
  "existingFields": []
}
```

**Semantic Search**
```bash
POST /api/ai/search
{
  "query": "authentication settings",
  "options": { "topK": 10 }
}
```

**Image Analysis**
```bash
POST /api/ai/analyze-image
{
  "image": "base64_encoded_image_data"
}
```

## 🎉 Success!

Your AuraGlass AI system is now ready for production use with:
- Real AI integrations (OpenAI, Google Vision, Pinecone)
- Production-grade infrastructure
- Enterprise security
- Scalable architecture

For questions or issues, check the logs and ensure all API keys are correctly configured.