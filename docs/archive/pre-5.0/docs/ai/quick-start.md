# ⚡ Quick Start: AI Features in 5 Minutes

Get the optional AuraGlass hosted AI runtime running in under 5 minutes.

AuraGlass package-only apps do not need this guide. Use it only when you want to self-host AI routes or collaboration transport in addition to importing the React package.

## 🎯 What You'll Get

- ✅ Smart form generation with GPT-4
- ✅ Semantic search with Pinecone
- ✅ Image analysis with Google Vision
- ✅ Real-time collaboration
- ✅ Safe provider-unconfigured responses when optional keys are missing

## 📝 Step 1: Get API Keys (2 minutes)

### OpenAI (Required for Smart Forms and Summaries)

1. Go to https://platform.openai.com/api-keys
2. Click "Create new secret key"
3. Copy the key (starts with `sk-...`)

**Free tier:** $5 credit for new users

### Pinecone (Required for Semantic Search)

1. Go to https://app.pinecone.io/
2. Sign up for free
3. Copy API key from dashboard

**Free tier:** 100K vectors, 5M queries/month

### Google Vision (Optional)

1. Go to https://console.cloud.google.com/
2. Create project → Enable "Cloud Vision API"
3. Create service account → Download JSON key

**Free tier:** 1,000 images/month free

## 🚀 Step 2: Setup (2 minutes)

```bash
# Clone/navigate to your project
cd auraglass

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

**Edit `.env` and add your keys:**

```env
# Hosted runtime contract
API_SERVER_PORT=3002
WS_PORT=3001
NEXT_PUBLIC_API_URL=http://localhost:3002
NEXT_PUBLIC_WS_URL=ws://localhost:3001
JWT_SECRET=replace-with-a-secure-random-secret

# Provider-backed features
OPENAI_API_KEY=sk-your-actual-key-here
PINECONE_API_KEY=your-pinecone-key-here
REDIS_URL=redis://localhost:6379

# Optional
GOOGLE_CLOUD_PROJECT_ID=your-project
GOOGLE_APPLICATION_CREDENTIALS=./config/google-cloud-key.json
```

## 🔧 Step 3: Start Redis (30 seconds)

**Easiest way - Docker:**
```bash
docker run -d -p 6379:6379 redis:alpine
```

**Or install locally:**
```bash
# macOS
brew install redis && brew services start redis

# Ubuntu
sudo apt-get install redis-server && sudo service redis-server start
```

## ▶️ Step 4: Run (30 seconds)

```bash
# Build server
npm run build:server

# Start all hosted services with canonical ports
API_SERVER_PORT=3002 WS_PORT=3001 npm run server:all

# In another terminal, start your app
NEXT_PUBLIC_API_URL=http://localhost:3002 \
NEXT_PUBLIC_WS_URL=ws://localhost:3001 \
npm run dev
```

## ✨ Step 5: Test It!

### Test in Your Browser

Open http://localhost:3000 and use the AI client:

```tsx
import { aiClient } from '@/lib/ai-client';

// Login (creates a test user)
await aiClient.login('test@example.com', 'password123');

// Generate smart form
const fields = await aiClient.generateFormFields('user registration form');
console.log(fields);

// Search
const { results } = await aiClient.search('how to use glassmorphism');
console.log(results);
```

### Test with cURL

```bash
# Health check
curl http://localhost:3002/health

# Login
curl -X POST http://localhost:3002/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Generate form (replace TOKEN)
curl -X POST http://localhost:3002/api/ai/generate-form \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"context":"contact form"}'
```

If OpenAI is not configured, the hosted route should return a safe provider-unconfigured response instead of mock fields:

```json
{
  "error": "Provider not configured",
  "message": "openai is not configured for generate-form",
  "code": "AURA_PROVIDER_UNCONFIGURED",
  "provider": "openai",
  "feature": "generate-form",
  "docsUrl": "https://auraglass.auraone.ai/docs/ai-providers"
}
```

## 🎨 Complete Example Component

Create `src/pages/ai-demo.tsx`:

```tsx
import { useState } from 'react';
import { aiClient } from '@/lib/ai-client';

export default function AIDemo() {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    try {
      // Login first
      await aiClient.login('test@example.com', 'password123');

      // Generate form
      const result = await aiClient.generateFormFields('contact form');
      setFields(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <button
        onClick={generate}
        disabled={loading}
        className="px-6 py-3 glass-surface-blue text-primary glass-radius-lg"
      >
        {loading ? 'Generating...' : 'Generate Contact Form'}
      </button>

      {fields.map((field, i) => (
        <div key={i} className="mt-4 p-4 glass-surface-subtle/10 glass-radius-lg">
          <h3>{field.label}</h3>
          <p className="text-sm">{field.fieldType}</p>
        </div>
      ))}
    </div>
  );
}
```

## 🎉 You're Done!

You now have:
- ✅ Real GPT-backed form generation when OpenAI is configured
- ✅ Semantic search with embeddings when OpenAI and Pinecone are configured
- ✅ Image analysis when Google Vision is configured
- ✅ Authentication working
- ✅ Clear provider-unconfigured states for missing optional providers

## 📊 Usage Examples

### Smart Forms

```tsx
const fields = await aiClient.generateFormFields('payment form');
// Returns: card number, CVV, expiry, billing address fields
```

### Semantic Search

```tsx
const { results } = await aiClient.search('dark mode button');
// AI enhances query and searches with meaning
```

### Image Analysis

```tsx
const analysis = await aiClient.analyzeImage(base64Image, ['faces', 'objects']);
// Returns: faces with emotions, objects with confidence scores
```

### Remove Background

```tsx
const processedImage = await aiClient.removeBackground(base64Image);
// Returns: image with background removed
```

## 💰 Cost Estimates

**For 1,000 requests:**

| Feature | Cost | Notes |
|---------|------|-------|
| Form Generation | $1-$20 | Depends on GPT-4 vs 3.5 |
| Semantic Search | $0.20 | Mostly free tier |
| Image Analysis | $1.50 | First 1000 free |
| **Total** | **$2.70-$21.50** | With caching: ~$1-$5 |

## 🔧 Troubleshooting

**"Connection refused on port 3002"**
```bash
# Make sure server is running
API_SERVER_PORT=3002 WS_PORT=3001 npm run server:all
```

**"Redis connection failed"**
```bash
# Test Redis
redis-cli ping
# Should return: PONG

# Start Redis if needed
docker run -d -p 6379:6379 redis:alpine
```

**"OpenAI API key invalid"**
- Double-check key in `.env`
- Make sure it starts with `sk-`
- No quotes around the value

## 📚 Next Steps

- [Full Setup Guide](./setup-guide.md) - Detailed configuration
- [API Reference](./api-reference.md) - All endpoints
- [Production Deployment](./production-deployment.md) - Deploy guide
- [Cost Optimization](./cost-optimization.md) - Reduce API costs

## 🆘 Need Help?

- Example component: `src/components/ai/examples/AIDemo.tsx`
- Test connection: `curl http://localhost:3002/health`
- Check logs: Look at terminal running `npm run server:all`

---

**Happy building with AI! 🚀**
