import React, { useState, useRef, useEffect } from 'react';

const Sidebar = ({ conversations, currentConversation, onNewChat, onSelectConversation, onRenameConversation, onDeleteConversation }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [hoveredConversation, setHoveredConversation] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [editingConversation, setEditingConversation] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const dropdownRef = useRef(null);
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    } else if (diffInHours < 24 * 7) {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const truncateText = (text, maxLength = 50) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleThreeDotsClick = (e, conversationId) => {
    e.stopPropagation();
    setOpenDropdown(openDropdown === conversationId ? null : conversationId);
  };

  const handleRenameClick = (conversation) => {
    setEditingConversation(conversation._id);
    setEditTitle(conversation.title);
    setOpenDropdown(null);
  };

  const handleRenameSubmit = (e, conversationId) => {
    e.preventDefault();
    if (editTitle.trim() && editTitle !== conversations.find(c => c._id === conversationId)?.title) {
      onRenameConversation(conversationId, editTitle.trim());
    }
    setEditingConversation(null);
    setEditTitle('');
  };

  const handleRenameCancel = () => {
    setEditingConversation(null);
    setEditTitle('');
  };

  const handleDeleteClick = (conversationId) => {
    if (window.confirm('Are you sure you want to delete this conversation? This action cannot be undone.')) {
      onDeleteConversation(conversationId);
    }
    setOpenDropdown(null);
  };

  return (
    <div className={`${isCollapsed ? 'w-16' : 'w-80'} ${isCollapsed ? 'bg-white shadow-sm' : 'bg-gray-50'} border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out`}>
      {/* Conversations Header */}
      {!isCollapsed && (
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800">Conversations</h2>
            <button 
              onClick={() => setIsCollapsed(true)}
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background hover:bg-accent hover:text-accent-foreground active:scale-[0.98] text-xs h-8 w-8 p-0 rounded-lg"
              type="button"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-left h-4 w-4" aria-hidden="true">
                <path d="m15 18-6-6 6-6"></path>
              </svg>
            </button>
          </div>
          <button
            onClick={onNewChat}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background hover-shadow-blue hover:bg-primary/90 active:scale-[0.98] h-10 px-6 py-2 w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-md rounded-xl"
            type="button"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus h-4 w-4 mr-2" aria-hidden="true">
              <path d="M5 12h14"></path>
              <path d="M12 5v14"></path>
            </svg>
            New Chat
          </button>
        </div>
      )}

      {/* Collapsed State */}
      {isCollapsed && (
        <>
          <div className="p-3">
            <button 
              onClick={() => setIsCollapsed(false)}
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background hover:bg-accent hover:text-accent-foreground active:scale-[0.98] text-xs w-full h-10 p-0 rounded-xl"
              type="button"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right h-4 w-4" aria-hidden="true">
                <path d="m9 18 6-6-6-6"></path>
              </svg>
            </button>
          </div>
          <div className="p-3 pt-0">
            <button
              onClick={onNewChat}
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background bg-blue-600 text-white hover:shadow-lg hover:shadow-blue/20 hover:bg-blue-700 active:scale-[0.98] text-xs w-full h-10 p-0 rounded-xl shadow-md"
              type="button"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus h-4 w-4" aria-hidden="true">
                <path d="M5 12h14"></path>
                <path d="M12 5v14"></path>
              </svg>
            </button>
          </div>
        </>
      )}

      {/* Conversations List */}
      {!isCollapsed && (
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <p className="text-gray-500">No conversations yet</p>
            </div>
          ) : (
            <div className="px-4 space-y-2">
              {conversations.map((conversation) => (
                <div
                  key={conversation._id}
                  onMouseEnter={() => setHoveredConversation(conversation._id)}
                  onMouseLeave={() => setHoveredConversation(null)}
                  className={`group relative p-3 rounded-lg cursor-pointer transition-colors duration-200 ${
                    currentConversation === conversation._id
                      ? 'bg-gray-200'
                      : 'bg-white hover:bg-gray-100'
                  }`}
                >
                  <div 
                    onClick={() => onSelectConversation(conversation._id)}
                    className="flex items-start space-x-3"
                  >
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      {editingConversation === conversation._id ? (
                        <form onSubmit={(e) => handleRenameSubmit(e, conversation._id)} className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="flex-1 text-sm font-medium text-gray-900 bg-transparent border border-blue-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            autoFocus
                            onBlur={handleRenameCancel}
                            onKeyDown={(e) => {
                              if (e.key === 'Escape') {
                                handleRenameCancel();
                              }
                            }}
                          />
                          <button
                            type="submit"
                            className="text-green-600 hover:text-green-700"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </button>
                        </form>
                      ) : (
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {conversation.title}
                        </h3>
                      )}
                      {conversation.lastMessage && (
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                          {truncateText(conversation.lastMessage)}
                        </p>
                      )}
                      <p className="text-xs text-gray-400 mt-1">
                        {formatTime(conversation.lastMessageTime)}
                      </p>
                    </div>
                  </div>

                  {/* Three dots menu - only visible on hover */}
                  {hoveredConversation === conversation._id && editingConversation !== conversation._id && (
                    <div className="absolute top-2 right-2" ref={dropdownRef}>
                      <button
                        onClick={(e) => handleThreeDotsClick(e, conversation._id)}
                        className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                      >
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="1"></circle>
                          <circle cx="19" cy="12" r="1"></circle>
                          <circle cx="5" cy="12" r="1"></circle>
                        </svg>
                      </button>

                      {/* Dropdown menu */}
                      {openDropdown === conversation._id && (
                        <div className="absolute top-8 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[140px]">
                          <div
                            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors"
                            onClick={() => handleRenameClick(conversation)}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Rename
                          </div>
                          <div
                            className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer transition-colors"
                            onClick={() => handleDeleteClick(conversation._id)}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Sidebar;

