#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 AI Chat App - Quick Deployment Setup\n');

// Check if we're in the right directory
if (!fs.existsSync('package.json') || !fs.existsSync('backend') || !fs.existsSync('frontend')) {
  console.error('❌ Please run this script from the root directory of your AI Chat App');
  process.exit(1);
}

console.log('📋 Deployment Checklist:\n');

console.log('1. 🗄️  MongoDB Atlas Setup:');
console.log('   - Create account at https://cloud.mongodb.com');
console.log('   - Create free cluster (M0 Sandbox)');
console.log('   - Create database user with read/write permissions');
console.log('   - Configure network access (0.0.0.0/0 for development)');
console.log('   - Get connection string\n');

console.log('2. 🔧 Backend Deployment Options:');
console.log('   A) Railway (Recommended):');
console.log('      - Go to https://railway.app');
console.log('      - Connect GitHub repository');
console.log('      - Set root directory to "backend"');
console.log('      - Add environment variables (see templates)\n');
console.log('   B) Render:');
console.log('      - Go to https://render.com');
console.log('      - Create Web Service from GitHub');
console.log('      - Set root directory to "backend"\n');

console.log('3. 🎨 Frontend Deployment Options:');
console.log('   A) Netlify (Recommended):');
console.log('      - Go to https://netlify.com');
console.log('      - Connect GitHub repository');
console.log('      - Set base directory to "frontend"');
console.log('      - Build command: "npm run build"');
console.log('      - Publish directory: "frontend/build"\n');
console.log('   B) Vercel:');
console.log('      - Go to https://vercel.com');
console.log('      - Import GitHub repository');
console.log('      - Set root directory to "frontend"\n');

console.log('4. 🔗 Environment Variables Needed:\n');

console.log('Backend (.env):');
console.log('NODE_ENV=production');
console.log('PORT=5000');
console.log('MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ai-chat-app');
console.log('JWT_SECRET=your-super-secret-jwt-key-for-production');
console.log('AI_PROVIDER=google');
console.log('GOOGLE_API_KEY=AIzaSyCVrLrV_UBHXQw0W__zCDk2soryQAapGsU\n');

console.log('Frontend (.env):');
console.log('REACT_APP_API_URL=https://your-backend-url.com/api\n');

console.log('5. ✅ Testing:');
console.log('   - Backend health check: https://your-backend-url.com/api/health');
console.log('   - Test user registration');
console.log('   - Test chat functionality');
console.log('   - Test conversation management\n');

console.log('📖 For detailed instructions, see: DEPLOYMENT_STEPS.md\n');

console.log('🎯 Quick Start Commands:');
console.log('1. Push your code to GitHub');
console.log('2. Set up MongoDB Atlas');
console.log('3. Deploy backend (Railway/Render)');
console.log('4. Deploy frontend (Netlify/Vercel)');
console.log('5. Update frontend API URL');
console.log('6. Test everything!\n');

console.log('🔐 Security Reminders:');
console.log('- Use strong, unique JWT secrets');
console.log('- Keep API keys secure');
console.log('- Never commit .env files to git');
console.log('- Use environment variables in deployment platforms\n');

console.log('🚀 Ready to deploy? Start with MongoDB Atlas setup!');
