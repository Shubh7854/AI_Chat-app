const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up AI Chat Application...\n');

// Create .env files if they don't exist
const backendEnvPath = path.join(__dirname, 'backend', '.env');
const frontendEnvPath = path.join(__dirname, 'frontend', '.env');

if (!fs.existsSync(backendEnvPath)) {
  const backendEnvContent = `PORT=5000
MONGODB_URI=mongodb://localhost:27017/ai-chat-app
JWT_SECRET=your-super-secret-jwt-key-here-please-change-this-in-production
NODE_ENV=development`;
  
  fs.writeFileSync(backendEnvPath, backendEnvContent);
  console.log('✅ Created backend/.env file');
} else {
  console.log('ℹ️  backend/.env already exists');
}

if (!fs.existsSync(frontendEnvPath)) {
  const frontendEnvContent = `REACT_APP_API_URL=http://localhost:5000/api`;
  
  fs.writeFileSync(frontendEnvPath, frontendEnvContent);
  console.log('✅ Created frontend/.env file');
} else {
  console.log('ℹ️  frontend/.env already exists');
}

console.log('\n📋 Setup Instructions:');
console.log('1. Install dependencies: npm run install-all');
console.log('2. Make sure MongoDB is running on your system');
console.log('3. Update the JWT_SECRET in backend/.env for security');
console.log('4. Start the application: npm run dev');
console.log('\n🌐 The application will be available at:');
console.log('   Frontend: http://localhost:3000');
console.log('   Backend:  http://localhost:5000');
console.log('\n📚 For deployment instructions, see README.md');
console.log('\n✨ Setup complete! Happy coding!');

