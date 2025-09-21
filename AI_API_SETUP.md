# AI API Setup Guide

This guide will help you set up real AI functionality for your chat application. The app supports multiple AI providers.

## 🚀 Quick Setup

### 1. Choose Your AI Provider

The app supports these AI providers:
- **OpenAI GPT** (Recommended for most users)
- **Anthropic Claude** (Great for complex reasoning)
- **Google Gemini** (Free tier available)
- **Mock** (Default - for testing)

### 2. Environment Configuration

Update your `backend/.env` file with your chosen provider:

```bash
# Set your AI provider
AI_PROVIDER=openai  # or anthropic, google, mock

# Add your API key (see provider-specific instructions below)
OPENAI_API_KEY=your-api-key-here
```

## 🔑 Provider-Specific Setup

### OpenAI GPT (Recommended)

**Best for:** General-purpose AI, coding help, creative writing

1. **Get API Key:**
   - Go to [OpenAI Platform](https://platform.openai.com/)
   - Sign up/Login
   - Go to API Keys section
   - Create a new secret key
   - Copy the key (starts with `sk-`)

2. **Configure Environment:**
   ```bash
   AI_PROVIDER=openai
   OPENAI_API_KEY=sk-your-actual-api-key-here
   OPENAI_MODEL=gpt-3.5-turbo  # or gpt-4 for better quality
   ```

3. **Pricing:** ~$0.002 per 1K tokens (very affordable)

### Anthropic Claude

**Best for:** Complex reasoning, analysis, long-form content

1. **Get API Key:**
   - Go to [Anthropic Console](https://console.anthropic.com/)
   - Sign up/Login
   - Go to API Keys
   - Create a new key
   - Copy the key (starts with `sk-ant-`)

2. **Configure Environment:**
   ```bash
   AI_PROVIDER=anthropic
   ANTHROPIC_API_KEY=sk-ant-your-actual-api-key-here
   ANTHROPIC_MODEL=claude-3-sonnet-20240229
   ```

3. **Pricing:** ~$0.003 per 1K tokens

### Google Gemini (Free Option)

**Best for:** Free usage, good for testing

1. **Get API Key:**
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Sign in with Google account
   - Create API key
   - Copy the key

2. **Configure Environment:**
   ```bash
   AI_PROVIDER=google
   GOOGLE_API_KEY=your-google-api-key-here
   ```

3. **Pricing:** Free tier available (60 requests/minute)

## 🛠️ Setup Steps

### Step 1: Update Environment File

1. Copy `backend/env.example` to `backend/.env`
2. Add your chosen AI provider configuration
3. Restart your backend server

### Step 2: Test the Integration

1. Start your application: `npm run dev`
2. Go to the chat interface
3. Send a test message
4. You should receive a real AI response!

### Step 3: Monitor Usage

- Check your AI provider dashboard for usage statistics
- Set up billing alerts if needed
- Monitor costs in your provider's console

## 💡 Recommendations

### For Development/Testing:
- **Google Gemini** - Free tier, good for testing
- **Mock** - No API costs, basic responses

### For Production:
- **OpenAI GPT-3.5** - Best balance of cost and quality
- **OpenAI GPT-4** - Highest quality, higher cost
- **Anthropic Claude** - Best for complex reasoning tasks

### Cost Optimization Tips:

1. **Use GPT-3.5-turbo** instead of GPT-4 for most use cases
2. **Set reasonable token limits** (default: 1000 tokens)
3. **Monitor usage** regularly
4. **Use conversation history** efficiently (limited to last 10 messages)

## 🔧 Advanced Configuration

### Custom System Prompts

You can modify the system prompt in `backend/routes/chat.js`:

```javascript
{
  role: 'system',
  content: 'You are a helpful AI assistant specialized in [your domain]. Provide clear, concise, and helpful responses.'
}
```

### Model Selection

Different models have different capabilities:

- **GPT-3.5-turbo**: Fast, cost-effective, good for most tasks
- **GPT-4**: Slower, more expensive, better reasoning
- **Claude-3-sonnet**: Great for analysis and long-form content
- **Gemini-pro**: Good free option

### Error Handling

The app includes fallback responses if the AI service is unavailable:

```javascript
// Automatic fallback message
"I'm sorry, I'm having trouble connecting to the AI service right now. Please try again later."
```

## 🚨 Security Notes

1. **Never commit API keys** to version control
2. **Use environment variables** for all sensitive data
3. **Rotate API keys** regularly
4. **Monitor usage** for unusual activity
5. **Set spending limits** in your AI provider dashboard

## 📞 Support

If you encounter issues:

1. Check your API key is correct
2. Verify your provider account has credits
3. Check the backend logs for error messages
4. Ensure your environment variables are set correctly

## 🎯 Next Steps

Once you have AI working:

1. **Customize the system prompt** for your use case
2. **Add conversation memory** features
3. **Implement user preferences** for AI behavior
4. **Add streaming responses** for better UX
5. **Set up monitoring** and analytics

Happy chatting with AI! 🤖✨
