# Deployment Guide

This guide will help you deploy the AI Chat Application to various platforms.

## Prerequisites

- GitHub repository with your code
- MongoDB Atlas account (for production database)
- Accounts on deployment platforms (Netlify, Vercel, Railway, etc.)

## Backend Deployment

### Option 1: Railway

1. **Connect Repository**
   - Go to [Railway](https://railway.app)
   - Sign up/login and connect your GitHub repository
   - Select the `backend` folder as the root directory

2. **Environment Variables**
   Set these in Railway dashboard:
   ```
   PORT=5000
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ai-chat-app
   JWT_SECRET=your-super-secret-jwt-key-for-production
   NODE_ENV=production
   ```

3. **Deploy**
   - Railway will automatically deploy when you push to main branch
   - Note the deployed URL (e.g., `https://your-app.railway.app`)

### Option 2: Render

1. **Create Web Service**
   - Go to [Render](https://render.com)
   - Connect your GitHub repository
   - Create a new "Web Service"
   - Set root directory to `backend`

2. **Environment Variables**
   ```
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ai-chat-app
   JWT_SECRET=your-super-secret-jwt-key-for-production
   ```

3. **Deploy**
   - Render will build and deploy automatically
   - Note the deployed URL

## Frontend Deployment

### Option 1: Netlify

1. **Connect Repository**
   - Go to [Netlify](https://netlify.com)
   - Connect your GitHub repository
   - Set build settings:
     - Build command: `cd frontend && npm run build`
     - Publish directory: `frontend/build`

2. **Environment Variables**
   ```
   REACT_APP_API_URL=https://your-backend-url.com/api
   ```

3. **Deploy**
   - Netlify will build and deploy automatically
   - Your app will be available at a Netlify subdomain

### Option 2: Vercel

1. **Connect Repository**
   - Go to [Vercel](https://vercel.com)
   - Import your GitHub repository
   - Set root directory to `frontend`

2. **Environment Variables**
   ```
   REACT_APP_API_URL=https://your-backend-url.com/api
   ```

3. **Deploy**
   - Vercel will build and deploy automatically

## MongoDB Atlas Setup

1. **Create Cluster**
   - Go to [MongoDB Atlas](https://cloud.mongodb.com)
   - Create a new cluster (free tier available)
   - Create a database user with read/write permissions

2. **Get Connection String**
   - Go to "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with your database name

3. **Network Access**
   - Add your IP address or use `0.0.0.0/0` for all IPs (less secure)

## Environment Variables Summary

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ai-chat-app
JWT_SECRET=your-super-secret-jwt-key-for-production
NODE_ENV=production
```

### Frontend (.env)
```env
REACT_APP_API_URL=https://your-backend-url.com/api
```

## Testing Deployment

1. **Backend Health Check**
   - Visit `https://your-backend-url.com/api/health`
   - Should return: `{"message": "AI Chat API is running!"}`

2. **Frontend**
   - Visit your frontend URL
   - Try registering a new account
   - Test the chat functionality

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Make sure your backend CORS is configured for your frontend domain
   - Check the `cors()` middleware in `backend/server.js`

2. **Environment Variables**
   - Double-check all environment variables are set correctly
   - Make sure there are no typos in variable names

3. **Database Connection**
   - Verify MongoDB Atlas connection string
   - Check network access settings
   - Ensure database user has correct permissions

4. **Build Failures**
   - Check build logs for specific error messages
   - Ensure all dependencies are properly installed
   - Verify Node.js version compatibility

### Logs and Debugging

- **Railway**: Check logs in the Railway dashboard
- **Render**: View logs in the Render dashboard
- **Netlify**: Check build logs in Netlify dashboard
- **Vercel**: View function logs in Vercel dashboard

## Security Considerations

1. **JWT Secret**
   - Use a strong, random JWT secret in production
   - Never commit secrets to version control

2. **MongoDB Access**
   - Use specific IP whitelisting instead of `0.0.0.0/0`
   - Regularly rotate database passwords

3. **HTTPS**
   - All production deployments should use HTTPS
   - Most platforms provide this automatically

## Performance Optimization

1. **Frontend**
   - Enable gzip compression
   - Use CDN for static assets
   - Implement proper caching headers

2. **Backend**
   - Use connection pooling for MongoDB
   - Implement rate limiting
   - Add proper error handling and logging

## Monitoring

Consider adding monitoring tools:
- **Sentry** for error tracking
- **LogRocket** for session replay
- **MongoDB Atlas** built-in monitoring
- **Uptime monitoring** services

## Support

If you encounter issues:
1. Check the deployment platform's documentation
2. Review error logs carefully
3. Test locally first to isolate issues
4. Check environment variables and configuration

