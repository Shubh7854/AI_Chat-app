import api from './api';

const chatService = {
  getConversations: () => {
    return api.get('/chat/conversations');
  },

  createConversation: (title) => {
    return api.post('/chat/conversations', { title });
  },

  getMessages: (conversationId) => {
    return api.get(`/chat/messages/${conversationId}`);
  },

  sendMessage: (conversationId, content) => {
    return api.post('/chat/messages', { conversationId, content });
  },

  renameConversation: (conversationId, title) => {
    return api.put(`/chat/conversations/${conversationId}`, { title });
  },

  deleteConversation: (conversationId) => {
    return api.delete(`/chat/conversations/${conversationId}`);
  },
};

export default chatService;

