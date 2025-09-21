#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Preparing AI Chat App for Deployment...\n');

// Create production environment template
const backendEnvTemplate = `# Production Environment Variables
PORT=5000
NODE_ENV=production

# Database - Replace with your MongoDB Atlas connection string
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/ai-chat-app?retryWrites=true&w=majority

# JWT Secret - Generate a strong secret for production
JWT_SECRET=your-super-secret-jwt-key-for-production-change-this-to-something-very-secure

# AI Provider Configuration
AI_PROVIDER=google
GOOGLE_API_KEY=AIzaSyCVrLrV_UBHXQw0W__zCDk2soryQAapGsU

# Optional: Other AI providers
OPENAI_API_KEY=your-openai-api-key-here
OPENAI_MODEL=gpt-3.5-turbo
ANTHROPIC_API_KEY=your-anthropic-api-key-here
ANTHROPIC_MODEL=claude-3-sonnet-20240229`;

const frontendEnvTemplate = `# Frontend Environment Variables
# Replace with your actual backend URL after deployment
REACT_APP_API_URL=https://your-backend-url.com/api`;

// Write environment templates
fs.writeFileSync(path.join(__dirname, 'backend', '.env.production.template'), backendEnvTemplate);
fs.writeFileSync(path.join(__dirname, 'frontend', '.env.production.template'), frontendEnvTemplate);

console.log('✅ Created environment templates:');
console.log('   - backend/.env.production.template');
console.log('   - frontend/.env.production.template');
console.log('\n📝 Next steps:');
console.log('1. Copy these templates to .env files');
console.log('2. Update with your actual values');
console.log('3. Never commit .env files to git!');
console.log('\n🔐 Security reminder:');
console.log('- Use strong, unique JWT secrets');
console.log('- Keep API keys secure');
console.log('- Use environment variables in deployment platforms');
