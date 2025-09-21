const fs = require('fs');
const path = require('path');

console.log('🚀 Preparing AI Chat App for Deployment...\n');

// Backend environment template
const backendEnvContent = `PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ai-chat-app
JWT_SECRET=your-super-secret-jwt-key-for-production
NODE_ENV=production

# AI Provider Configuration
AI_PROVIDER=google

# Google Gemini API
GOOGLE_API_KEY=your-google-gemini-api-key-here

# OpenAI API (optional)
OPENAI_API_KEY=your-openai-api-key-here
OPENAI_MODEL=gpt-3.5-turbo

# Anthropic API (optional)
ANTHROPIC_API_KEY=your-anthropic-api-key-here
ANTHROPIC_MODEL=claude-3-sonnet-20240229
`;

// Frontend environment template
const frontendEnvContent = `REACT_APP_API_URL=https://your-backend-url.com/api
`;

// Create environment templates
const createEnvTemplate = (dir, filename, content) => {
  const filePath = path.join(dir, filename);
  fs.writeFileSync(filePath, content.trim() + '\n');
  console.log(`✅ Created: ${filePath}`);
};

console.log('📝 Creating environment templates:');
createEnvTemplate('./backend', '.env.production.template', backendEnvContent);
createEnvTemplate('./frontend', '.env.production.template', frontendEnvContent);

console.log('\n🔧 Creating deployment configuration files...');

// Railway configuration
const railwayConfig = {
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "healthcheckPath": "/api/health",
    "healthcheckTimeout": 100,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
};

fs.writeFileSync('./railway.json', JSON.stringify(railwayConfig, null, 2));
console.log('✅ Created: ./railway.json');

// Render configuration
const renderConfig = `services:
  - type: web
    name: ai-chat-backend
    env: node
    plan: free
    buildCommand: npm install
    startCommand: npm start
    healthCheckPath: /api/health
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 5000
`;

fs.writeFileSync('./render.yaml', renderConfig);
console.log('✅ Created: ./render.yaml');

// Netlify configuration
const netlifyConfig = `[build]
  base = "frontend"
  publish = "frontend/build"
  command = "npm run build"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
`;

fs.writeFileSync('./netlify.toml', netlifyConfig);
console.log('✅ Created: ./netlify.toml');

// Vercel configuration
const vercelConfig = {
  "version": 2,
  "builds": [
    {
      "src": "frontend/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/frontend/$1"
    }
  ]
};

fs.writeFileSync('./vercel.json', JSON.stringify(vercelConfig, null, 2));
console.log('✅ Created: ./vercel.json');

console.log('\n📋 Deployment Checklist:');
console.log('1. ✅ Environment templates created');
console.log('2. ✅ Railway config created');
console.log('3. ✅ Render config created');
console.log('4. ✅ Netlify config created');
console.log('5. ✅ Vercel config created');

console.log('\n🎯 Next Steps:');
console.log('1. Push your code to GitHub');
console.log('2. Set up MongoDB Atlas');
console.log('3. Deploy backend (Railway/Render)');
console.log('4. Deploy frontend (Netlify/Vercel)');
console.log('5. Update environment variables');
console.log('6. Test your deployment!');

console.log('\n🔐 Security Reminders:');
console.log('- Never commit .env files to git');
console.log('- Use strong, unique JWT secrets');
console.log('- Keep API keys secure');
console.log('- Use environment variables in deployment platforms');

console.log('\n🚀 Ready to deploy! Run: node deploy-steps.js');