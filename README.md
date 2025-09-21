# 🤖 AI Chat Application

A modern, full-stack AI chat application built with React, Node.js, and MongoDB. Features real-time chat with AI assistants, conversation management, and a beautiful user interface.

## ✨ Features

- 🎨 **Modern UI/UX** - Beautiful, responsive design with Tailwind CSS
- 🤖 **AI Integration** - Support for multiple AI providers (Google Gemini, OpenAI, Anthropic)
- 💬 **Real-time Chat** - Instant messaging with typing indicators
- 📝 **Conversation Management** - Create, rename, and delete conversations
- 🔐 **User Authentication** - Secure signup/signin with JWT tokens
- 💰 **Token System** - Credit-based usage system (1250 tokens per user)
- 📱 **Responsive Design** - Works perfectly on desktop and mobile
- 🎯 **Smart Features** - Copy messages, upvote/downvote responses, demo questions

## 🚀 Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **Redux Toolkit** - State management
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication tokens
- **Bcrypt** - Password hashing

### AI Integration
- **Google Gemini API** - Primary AI provider
- **OpenAI API** - Alternative AI provider
- **Anthropic API** - Alternative AI provider

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Git

### Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd ai-chat-app
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install backend dependencies
   cd backend
   npm install
   
   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Environment Setup**
   
   Create `backend/.env`:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/ai-chat-app
   JWT_SECRET=your-super-secret-jwt-key-here
   NODE_ENV=development
   AI_PROVIDER=google
   GOOGLE_API_KEY=your-google-api-key
   ```

   Create `frontend/.env`:
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. **Start the application**
   ```bash
   # From root directory
   npm run dev
   ```

   This will start both backend (port 5000) and frontend (port 3000) concurrently.

## 🌐 Deployment

### Quick Deployment Guide

1. **MongoDB Atlas Setup**
   - Create free cluster at [MongoDB Atlas](https://cloud.mongodb.com)
   - Get connection string
   - Configure network access

2. **Backend Deployment (Railway)**
   - Go to [Railway](https://railway.app)
   - Connect GitHub repository
   - Set root directory to `backend`
   - Add environment variables

3. **Frontend Deployment (Netlify)**
   - Go to [Netlify](https://netlify.com)
   - Connect GitHub repository
   - Set base directory to `frontend`
   - Add environment variables

For detailed deployment instructions, see [DEPLOYMENT_STEPS.md](./DEPLOYMENT_STEPS.md)

## 🔧 Configuration

### AI Provider Setup

The application supports multiple AI providers. Configure your preferred provider in `backend/.env`:

```env
# Google Gemini (Recommended)
AI_PROVIDER=google
GOOGLE_API_KEY=your-google-api-key

# OpenAI
AI_PROVIDER=openai
OPENAI_API_KEY=your-openai-api-key
OPENAI_MODEL=gpt-3.5-turbo

# Anthropic
AI_PROVIDER=anthropic
ANTHROPIC_API_KEY=your-anthropic-api-key
ANTHROPIC_MODEL=claude-3-sonnet-20240229
```

### Environment Variables

#### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ai-chat-app
JWT_SECRET=your-super-secret-jwt-key-here
NODE_ENV=development
AI_PROVIDER=google
GOOGLE_API_KEY=your-google-api-key
```

#### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 📱 Usage

1. **Sign Up** - Create a new account with email and password
2. **Get Started** - You'll receive 1250 tokens to start chatting
3. **Chat with AI** - Ask questions, get help, or explore ideas
4. **Manage Conversations** - Rename or delete old conversations
5. **Track Usage** - Monitor your remaining tokens in the header

## 🎯 Features in Detail

### Chat Interface
- Real-time messaging with AI
- Typing indicators
- Message actions (copy, upvote, downvote)
- Conversation history
- Demo questions for quick start

### User Management
- Secure authentication
- Profile management
- Token-based usage system
- Session management

### Conversation Management
- Create new conversations
- Rename conversations
- Delete conversations
- Conversation history
- Last message preview

## 🔒 Security

- JWT-based authentication
- Password hashing with bcrypt
- Environment variable protection
- CORS configuration
- Input validation and sanitization

## 🚀 Performance

- Optimized React components
- Efficient state management
- Database indexing
- Connection pooling
- Error handling and logging

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Chat
- `GET /api/chat/conversations` - Get user conversations
- `POST /api/chat/conversations` - Create new conversation
- `GET /api/chat/messages/:id` - Get conversation messages
- `POST /api/chat/messages` - Send message
- `PUT /api/chat/conversations/:id` - Rename conversation
- `DELETE /api/chat/conversations/:id` - Delete conversation

### Health Check
- `GET /api/health` - API health status

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - Frontend framework
- [Express.js](https://expressjs.com/) - Backend framework
- [MongoDB](https://www.mongodb.com/) - Database
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Google Gemini](https://ai.google.dev/) - AI provider

## 📞 Support

If you have any questions or need help:

1. Check the [Issues](https://github.com/your-username/ai-chat-app/issues) page
2. Create a new issue with detailed description
3. Contact: [your-email@example.com]

---

**Made with ❤️ by [Your Name]**