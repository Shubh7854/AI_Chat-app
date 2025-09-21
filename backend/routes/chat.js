const express = require('express');
const { body, validationResult } = require('express-validator');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const User = require('../models/User');
const auth = require('../middleware/auth');
const axios = require('axios');

const router = express.Router();

// @route   GET /api/chat/conversations
// @desc    Get user conversations
// @access  Private
router.get('/conversations', auth, async (req, res) => {
  try {
    const conversations = await Conversation.find({ userId: req.user._id })
      .sort({ updatedAt: -1 })
      .limit(20);

    res.json({ conversations });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/chat/conversations
// @desc    Create new conversation
// @access  Private
router.post('/conversations', [
  auth,
  body('title').notEmpty().withMessage('Title is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { title } = req.body;

    const conversation = new Conversation({
      userId: req.user._id,
      title: title.trim()
    });

    await conversation.save();

    res.status(201).json({ conversation });
  } catch (error) {
    console.error('Create conversation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/chat/messages/:conversationId
// @desc    Get messages for a conversation
// @access  Private
router.get('/messages/:conversationId', auth, async (req, res) => {
  try {
    const { conversationId } = req.params;

    // Verify conversation belongs to user
    const conversation = await Conversation.findOne({
      _id: conversationId,
      userId: req.user._id
    });

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    const messages = await Message.find({ conversationId })
      .sort({ timestamp: 1 });

    res.json({ messages });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/chat/messages
// @desc    Send new message
// @access  Private
router.post('/messages', [
  auth,
  body('conversationId').notEmpty().withMessage('Conversation ID is required'),
  body('content').notEmpty().withMessage('Message content is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { conversationId, content } = req.body;

    // Check if user has enough tokens
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.credits <= 0) {
      return res.status(400).json({ 
        message: 'Insufficient tokens. Please purchase more tokens to continue using AI chat.',
        credits: user.credits
      });
    }

    // Verify conversation belongs to user
    const conversation = await Conversation.findOne({
      _id: conversationId,
      userId: req.user._id
    });

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    // Create user message
    const userMessage = new Message({
      conversationId,
      sender: 'user',
      content: content.trim()
    });

    await userMessage.save();

    // Generate AI response
    let aiResponse;
    try {
      aiResponse = await generateAIResponse(content, conversationId);
    } catch (error) {
      console.error('AI API Error:', error);
      aiResponse = "I'm sorry, I'm having trouble connecting to the AI service right now. Please try again later.";
    }

    // Create AI message
    const aiMessage = new Message({
      conversationId,
      sender: 'ai',
      content: aiResponse
    });

    await aiMessage.save();

    // Deduct 1 token from user
    user.credits -= 1;
    await user.save();

    // Update conversation with last message
    conversation.lastMessage = aiResponse;
    conversation.lastMessageTime = new Date();
    await conversation.save();

    res.status(201).json({ 
      messages: [userMessage, aiMessage],
      credits: user.credits
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// AI response generator with multiple provider support
async function generateAIResponse(userMessage, conversationId) {
  const aiProvider = process.env.AI_PROVIDER || 'openai';
  
  switch (aiProvider.toLowerCase()) {
    case 'openai':
      return await generateOpenAIResponse(userMessage, conversationId);
    case 'anthropic':
      return await generateAnthropicResponse(userMessage, conversationId);
    case 'google':
      return await generateGoogleResponse(userMessage, conversationId);
    case 'mock':
    default:
      return generateMockResponse(userMessage);
  }
}

// OpenAI GPT Integration
async function generateOpenAIResponse(userMessage, conversationId) {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error('OpenAI API key not configured');
  }

  try {
    // Get conversation history for context
    const messages = await Message.find({ conversationId })
      .sort({ timestamp: -1 })
      .limit(10); // Last 10 messages for context
    
    const conversationHistory = messages.reverse().map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.content
    }));

    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful AI assistant. Provide clear, concise, and helpful responses to user questions.'
        },
        ...conversationHistory,
        {
          role: 'user',
          content: userMessage
        }
      ],
      max_tokens: 1000,
      temperature: 0.7
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API Error:', error.response?.data || error.message);
    throw error;
  }
}

// Anthropic Claude Integration
async function generateAnthropicResponse(userMessage, conversationId) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  
  if (!apiKey) {
    throw new Error('Anthropic API key not configured');
  }

  try {
    const response = await axios.post('https://api.anthropic.com/v1/messages', {
      model: process.env.ANTHROPIC_MODEL || 'claude-3-sonnet-20240229',
      max_tokens: 1000,
      messages: [
        {
          role: 'user',
          content: userMessage
        }
      ]
    }, {
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01'
      }
    });

    return response.data.content[0].text;
  } catch (error) {
    console.error('Anthropic API Error:', error.response?.data || error.message);
    throw error;
  }
}

// Google Gemini Integration
async function generateGoogleResponse(userMessage, conversationId) {
  const apiKey = process.env.GOOGLE_API_KEY;
  
  if (!apiKey) {
    throw new Error('Google API key not configured');
  }

  try {
    const response = await axios.post(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      contents: [{
        parts: [{
          text: userMessage
        }]
      }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1000
      }
    });

    return response.data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Google API Error:', error.response?.data || error.message);
    throw error;
  }
}

// Mock response for testing
function generateMockResponse(userMessage) {
  const responses = [
    "That's an interesting question! Let me help you with that.",
    "I understand what you're asking. Here's what I think...",
    "Great question! Let me break this down for you.",
    "I'd be happy to help you with that. Here's my response...",
    "That's a thoughtful question. Let me provide some insights...",
    "I can definitely help you with that. Here's what I know...",
    "Interesting! Let me share my thoughts on this topic...",
    "I'm here to help! Let me give you a comprehensive answer..."
  ];

  const randomResponse = responses[Math.floor(Math.random() * responses.length)];
  
  return `${randomResponse} This is a mock response. To use real AI, please configure an AI provider API key in your environment variables.`;
}

// @route   PUT /api/chat/conversations/:id
// @desc    Rename conversation
// @access  Private
router.put('/conversations/:id', [
  auth,
  body('title').notEmpty().withMessage('Title is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { title } = req.body;
    const conversationId = req.params.id;

    // Verify conversation belongs to user
    const conversation = await Conversation.findOne({
      _id: conversationId,
      userId: req.user._id
    });

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    // Update conversation title
    conversation.title = title.trim();
    await conversation.save();

    res.json({ 
      message: 'Conversation renamed successfully',
      title: conversation.title
    });
  } catch (error) {
    console.error('Rename conversation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/chat/conversations/:id
// @desc    Delete conversation
// @access  Private
router.delete('/conversations/:id', auth, async (req, res) => {
  try {
    const conversationId = req.params.id;

    // Verify conversation belongs to user
    const conversation = await Conversation.findOne({
      _id: conversationId,
      userId: req.user._id
    });

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    // Delete all messages in the conversation
    await Message.deleteMany({ conversationId });

    // Delete the conversation
    await Conversation.findByIdAndDelete(conversationId);

    res.json({ message: 'Conversation deleted successfully' });
  } catch (error) {
    console.error('Delete conversation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

