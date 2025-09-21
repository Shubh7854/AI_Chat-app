import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout, updateCredits } from '../store/slices/authSlice';
import { getConversations, createConversation, getMessages, sendMessage, setCurrentConversation, renameConversation, deleteConversation } from '../store/slices/chatSlice';
import { getNotifications } from '../store/slices/notificationSlice';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import ChatArea from '../components/ChatArea';
import NotificationPanel from '../components/NotificationPanel';

const Chat = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { conversations, currentConversation, messages, loading } = useSelector((state) => state.chat);
  const { notifications } = useSelector((state) => state.notifications);

  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    dispatch(getConversations());
    dispatch(getNotifications());
  }, [dispatch]);

  const handleNewChat = async () => {
    const title = 'New Chat';
    dispatch(createConversation(title));
  };

  const handleSelectConversation = (conversationId) => {
    dispatch(setCurrentConversation(conversationId));
    dispatch(getMessages(conversationId));
  };

  const handleSendMessage = async (content) => {
    if (content.trim()) {
      if (currentConversation) {
        const result = await dispatch(sendMessage({ conversationId: currentConversation, content }));
        if (result.payload?.credits !== undefined) {
          dispatch(updateCredits(result.payload.credits));
        }
      } else {
        // Create new conversation first, then send message
        const title = content.length > 50 ? content.substring(0, 50) + '...' : content;
        const createAction = await dispatch(createConversation(title));
        if (createAction.payload?.conversation?._id) {
          const result = await dispatch(sendMessage({ conversationId: createAction.payload.conversation._id, content }));
          if (result.payload?.credits !== undefined) {
            dispatch(updateCredits(result.payload.credits));
          }
        }
      }
    }
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const handleRenameConversation = (conversationId, newTitle) => {
    dispatch(renameConversation({ conversationId, title: newTitle }));
  };

  const handleDeleteConversation = (conversationId) => {
    dispatch(deleteConversation(conversationId));
  };

  return (
    <div className="h-screen flex flex-col bg-white">
      <Header
        user={user}
        onLogout={handleLogout}
        onToggleNotifications={toggleNotifications}
        showNotifications={showNotifications}
        notifications={notifications}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          conversations={conversations}
          currentConversation={currentConversation}
          onNewChat={handleNewChat}
          onSelectConversation={handleSelectConversation}
          onRenameConversation={handleRenameConversation}
          onDeleteConversation={handleDeleteConversation}
        />
        
        <ChatArea
          currentConversation={currentConversation}
          messages={messages}
          onSendMessage={handleSendMessage}
          isLoading={loading}
          user={user}
        />
      </div>

      {showNotifications && (
        <NotificationPanel
          notifications={notifications}
          onClose={() => setShowNotifications(false)}
        />
      )}
    </div>
  );
};

export default Chat;

