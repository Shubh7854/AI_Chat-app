import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import chatService from '../../services/chatService';

// Async thunks
export const getConversations = createAsyncThunk(
  'chat/getConversations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await chatService.getConversations();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to get conversations'
      );
    }
  }
);

export const createConversation = createAsyncThunk(
  'chat/createConversation',
  async (title, { rejectWithValue }) => {
    try {
      const response = await chatService.createConversation(title);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create conversation'
      );
    }
  }
);

export const getMessages = createAsyncThunk(
  'chat/getMessages',
  async (conversationId, { rejectWithValue }) => {
    try {
      const response = await chatService.getMessages(conversationId);
      return { conversationId, messages: response.data.messages };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to get messages'
      );
    }
  }
);

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ conversationId, content }, { rejectWithValue }) => {
    try {
      const response = await chatService.sendMessage(conversationId, content);
      return { 
        conversationId, 
        messages: response.data.messages,
        credits: response.data.credits
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to send message'
      );
    }
  }
);

export const renameConversation = createAsyncThunk(
  'chat/renameConversation',
  async ({ conversationId, title }, { rejectWithValue }) => {
    try {
      const response = await chatService.renameConversation(conversationId, title);
      return { conversationId, title: response.data.title };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to rename conversation'
      );
    }
  }
);

export const deleteConversation = createAsyncThunk(
  'chat/deleteConversation',
  async (conversationId, { rejectWithValue }) => {
    try {
      await chatService.deleteConversation(conversationId);
      return conversationId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete conversation'
      );
    }
  }
);

const initialState = {
  conversations: [],
  currentConversation: null,
  messages: {},
  loading: false,
  error: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setCurrentConversation: (state, action) => {
      state.currentConversation = action.payload;
    },
    clearMessages: (state) => {
      state.messages = {};
      state.currentConversation = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Conversations
      .addCase(getConversations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getConversations.fulfilled, (state, action) => {
        state.loading = false;
        state.conversations = action.payload.conversations;
      })
      .addCase(getConversations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Conversation
      .addCase(createConversation.fulfilled, (state, action) => {
        state.conversations.unshift(action.payload.conversation);
        state.currentConversation = action.payload.conversation._id;
      })
      // Get Messages
      .addCase(getMessages.fulfilled, (state, action) => {
        const { conversationId, messages } = action.payload;
        state.messages[conversationId] = messages;
      })
      // Send Message
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false;
        const { conversationId, messages } = action.payload;
        
        // Append new messages to existing conversation
        if (state.messages[conversationId]) {
          // Get existing messages to avoid duplicates
          const existingMessages = state.messages[conversationId];
          
          // Only add messages that aren't already in the conversation
          const newMessages = messages.filter(msg => 
            !existingMessages.some(existing => existing._id === msg._id)
          );
          
          state.messages[conversationId] = [...existingMessages, ...newMessages];
        } else {
          state.messages[conversationId] = messages;
        }
        
        // Update conversation in list
        const conversation = state.conversations.find(
          conv => conv._id === conversationId
        );
        if (conversation) {
          const allMessages = state.messages[conversationId];
          conversation.lastMessage = allMessages[allMessages.length - 1].content;
          conversation.lastMessageTime = new Date();
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Rename Conversation
      .addCase(renameConversation.fulfilled, (state, action) => {
        const { conversationId, title } = action.payload;
        const conversation = state.conversations.find(conv => conv._id === conversationId);
        if (conversation) {
          conversation.title = title;
        }
      })
      // Delete Conversation
      .addCase(deleteConversation.fulfilled, (state, action) => {
        const conversationId = action.payload;
        state.conversations = state.conversations.filter(conv => conv._id !== conversationId);
        
        // If the deleted conversation was the current one, clear it
        if (state.currentConversation === conversationId) {
          state.currentConversation = null;
        }
        
        // Remove messages for the deleted conversation
        delete state.messages[conversationId];
      });
  },
});

export const { setCurrentConversation, clearMessages, clearError } = chatSlice.actions;
export default chatSlice.reducer;

