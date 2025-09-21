import React, { useState, useRef, useEffect, useMemo } from 'react';

const ChatArea = ({ currentConversation, messages, onSendMessage, isLoading, user }) => {
  const [inputValue, setInputValue] = useState('');
  const [copiedMessages, setCopiedMessages] = useState(new Set());
  const [upvotedMessages, setUpvotedMessages] = useState(new Set());
  const [downvotedMessages, setDownvotedMessages] = useState(new Set());
  const [openDropdown, setOpenDropdown] = useState(null);
  const messagesEndRef = useRef(null);

  const currentMessages = useMemo(() => {
    return currentConversation ? messages[currentConversation] || [] : [];
  }, [currentConversation, messages]);

  useEffect(() => {
    scrollToBottom();
  }, [currentMessages]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openDropdown && !event.target.closest('.dropdown-container')) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdown]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      // Check if user has tokens
      if (user?.credits <= 0) {
        alert('You have no tokens remaining. Please purchase more tokens to continue using AI chat.');
        return;
      }
      
      if (currentConversation) {
        onSendMessage(inputValue.trim());
      } else {
        // Create new conversation and send message
        onSendMessage(inputValue.trim());
      }
      setInputValue('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const suggestedPrompts = [
    "Explain quantum computing in simple terms",
    "Write a Python function to sort a list",
    "What are the benefits of meditation?",
    "Help me plan a weekend trip to Paris"
  ];

  const handleSuggestedPrompt = (prompt) => {
    // Check if user has tokens
    if (user?.credits <= 0) {
      alert('You have no tokens remaining. Please purchase more tokens to continue using AI chat.');
      return;
    }
    
    setInputValue(prompt);
    onSendMessage(prompt);
    setInputValue(''); // Clear input after sending
  };

  const handleCopyMessage = async (content, messageId) => {
    try {
      await navigator.clipboard.writeText(content);
      // Add message to copied set
      setCopiedMessages(prev => new Set([...prev, messageId]));
      
      // Remove from copied set after 2 seconds
      setTimeout(() => {
        setCopiedMessages(prev => {
          const newSet = new Set(prev);
          newSet.delete(messageId);
          return newSet;
        });
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleThumbsUp = (messageId) => {
    // Toggle upvote state
    setUpvotedMessages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(messageId)) {
        newSet.delete(messageId);
      } else {
        newSet.add(messageId);
        // Remove from downvoted if it was downvoted
        setDownvotedMessages(prevDown => {
          const newDownSet = new Set(prevDown);
          newDownSet.delete(messageId);
          return newDownSet;
        });
      }
      return newSet;
    });
  };

  const handleThumbsDown = (messageId) => {
    // Toggle downvote state
    setDownvotedMessages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(messageId)) {
        newSet.delete(messageId);
      } else {
        newSet.add(messageId);
        // Remove from upvoted if it was upvoted
        setUpvotedMessages(prevUp => {
          const newUpSet = new Set(prevUp);
          newUpSet.delete(messageId);
          return newUpSet;
        });
      }
      return newSet;
    });
  };

  const handleMoreOptions = (messageId) => {
    // Toggle dropdown menu
    setOpenDropdown(openDropdown === messageId ? null : messageId);
  };

  const handleCopyFromDropdown = async (content, messageId) => {
    try {
      await navigator.clipboard.writeText(content);
      // Add message to copied set
      setCopiedMessages(prev => new Set([...prev, messageId]));
      
      // Remove from copied set after 2 seconds
      setTimeout(() => {
        setCopiedMessages(prev => {
          const newSet = new Set(prev);
          newSet.delete(messageId);
          return newSet;
        });
      }, 2000);
      
      // Close dropdown
      setOpenDropdown(null);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  if (!currentConversation || currentMessages.length === 0) {
    return (
      <div className="flex-1 flex flex-col bg-white">
        {/* Welcome Section */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center max-w-2xl">
            <div className="mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles h-16 w-16 mx-auto text-primary mb-4" aria-hidden="true">
                <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"></path>
                <path d="M20 2v4"></path>
                <path d="M22 4h-4"></path>
                <circle cx="4" cy="20" r="2"></circle>
              </svg>
              <h2 className="text-2xl font-semibold mb-2">Welcome to AI Chat</h2>
              <p className="text-muted-foreground">Start a conversation with our AI assistant. Ask questions, get help with tasks, or explore ideas together.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
              {suggestedPrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestedPrompt(prompt)}
                  className="inline-flex items-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background border border-border bg-background text-foreground shadow-sm hover:shadow-md hover:bg-accent hover:text-accent-foreground active:scale-[0.98] p-4 h-auto text-left justify-start"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-square h-4 w-4 mr-2 flex-shrink-0" aria-hidden="true">
                    <path d="M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z"></path>
                  </svg>
                  <span className="text-sm">{prompt}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Message Input */}
        <div className="border-t border-border bg-white/80 backdrop-blur-xl p-6 shadow-lg">
          <div className="max-w-4xl mx-auto">
            <div className="relative flex items-end gap-3">
              <div className="flex-1 relative">
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content w-full px-3 text-base outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm min-h-[52px] max-h-[200px] resize-none pr-12 py-4 bg-white border border-gray-200 rounded-2xl shadow-inner focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                  placeholder="Ask me anything..."
                  rows="1"
                />
                <div className="absolute bottom-3 right-3">
                  <button
                    onClick={handleSubmit}
                    disabled={!inputValue.trim() || (user?.credits <= 0)}
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all duration-200 disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background text-primary-foreground hover:shadow-lg hover:shadow-blue/20 hover:bg-primary/90 active:scale-[0.98] text-xs h-8 w-8 p-0 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-red-500" aria-hidden="true">
                        <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-send h-4 w-4" aria-hidden="true">
                        <path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"></path>
                        <path d="m21.854 2.147-10.94 10.939"></path>
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
              <span>Press Enter to send, Shift+Enter for new line</span>
              <span className="">{inputValue.length}/2000</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-4">
          {currentMessages.map((message, index) => (
            <div key={index} className={`group flex gap-4 py-6 px-6 transition-colors ${
              message.sender === 'user' 
                ? 'bg-transparent' 
                : 'bg-gradient-to-r from-blue-50/30 to-indigo-50/30'
            } fade-in`}>
              {message.sender === 'user' ? (
                // User Message
                <>
                  {/* User Avatar */}
                  <span className="relative flex size-10 shrink-0 overflow-hidden rounded-full h-8 w-8 shadow-sm">
                    <span className="flex size-full items-center justify-center rounded-full bg-gradient-to-br from-gray-100 to-gray-200 text-gray-600">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user h-4 w-4" aria-hidden="true">
                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                    </span>
                  </span>

                  {/* User Message Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="font-medium text-sm text-foreground">You</span>
                      <span className="text-xs text-muted-foreground">{formatTime(message.timestamp)}</span>
                    </div>
                    <div className="prose prose-sm max-w-none p-4 rounded-2xl bg-white border border-gray-100 shadow-sm ml-0">
                      <p className="whitespace-pre-wrap break-words m-0 text-foreground">{message.content}</p>
                    </div>
                  </div>
                </>
              ) : (
                // AI Message
                <>
                  {/* AI Avatar */}
                  <span className="relative flex size-10 shrink-0 overflow-hidden rounded-full h-8 w-8 shadow-sm">
                    <span className="flex size-full items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                      <svg className="lucide lucide-bot h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M12 8V4H8"></path>
                        <rect width="16" height="12" x="4" y="8" rx="2"></rect>
                        <path d="M2 14h2"></path>
                        <path d="M20 14h2"></path>
                        <path d="M15 13v2"></path>
                        <path d="M9 13v2"></path>
                      </svg>
                    </span>
                  </span>

                  {/* AI Message Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="font-medium text-sm text-foreground">AI Assistant</span>
                      <span className="text-xs text-muted-foreground">{formatTime(message.timestamp)}</span>
                    </div>
                    <div className="prose prose-sm max-w-none p-4 rounded-2xl bg-white border border-blue-100 shadow-sm mr-8">
                      <p className="whitespace-pre-wrap break-words m-0 text-foreground">{message.content}</p>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex items-center gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity relative dropdown-container">
                      {openDropdown !== (message._id || index) && (
                        <>
                          <button 
                            onClick={() => handleCopyMessage(message.content, message._id || index)}
                            className="inline-flex items-center justify-center w-6 h-6 p-0 rounded hover:bg-blue-50 transition-colors"
                            title={copiedMessages.has(message._id || index) ? "Copied!" : "Copy message"}
                          >
                            {copiedMessages.has(message._id || index) ? (
                              <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center">
                                <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                  <path d="M5 13l4 4L19 7"></path>
                                </svg>
                              </div>
                            ) : (
                              <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
                                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
                              </svg>
                            )}
                          </button>
                          <button 
                            onClick={() => handleThumbsUp(message._id || index)}
                            className="inline-flex items-center justify-center w-6 h-6 p-0 rounded hover:bg-blue-50 transition-colors"
                            title="Thumbs up"
                          >
                            <svg className={`w-4 h-4 ${upvotedMessages.has(message._id || index) ? 'text-green-500' : 'text-blue-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                              <path d="M7 10v12"></path>
                              <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z"></path>
                            </svg>
                          </button>
                          <button 
                            onClick={() => handleThumbsDown(message._id || index)}
                            className="inline-flex items-center justify-center w-6 h-6 p-0 rounded hover:bg-blue-50 transition-colors"
                            title="Thumbs down"
                          >
                            <svg className={`w-4 h-4 ${downvotedMessages.has(message._id || index) ? 'text-red-500' : 'text-blue-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                              <path d="M17 14V2"></path>
                              <path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z"></path>
                            </svg>
                          </button>
                        </>
                      )}
                      <button 
                        onClick={() => handleMoreOptions(message._id || index)}
                        className="inline-flex items-center justify-center w-6 h-6 p-0 rounded hover:bg-blue-50 transition-colors"
                        title="More options"
                      >
                        <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                          <circle cx="12" cy="12" r="1"></circle>
                          <circle cx="19" cy="12" r="1"></circle>
                          <circle cx="5" cy="12" r="1"></circle>
                        </svg>
                      </button>
                      
                      {/* Dropdown Menu */}
                      {openDropdown === (message._id || index) && (
                        <div className="absolute top-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[140px]">
                          <div 
                            role="menuitem" 
                            className="focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none hover:bg-gray-50 transition-colors"
                            onClick={() => handleCopyFromDropdown(message.content, message._id || index)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-copy h-3 w-3 mr-2 text-gray-600" aria-hidden="true">
                              <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
                              <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
                            </svg>
                            Copy message
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
          
          {/* Typing Indicator */}
          {isLoading && (
            <div className="group flex gap-4 py-6 px-6 transition-colors bg-gradient-to-r from-blue-50/30 to-indigo-50/30 fade-in">
              {/* AI Avatar */}
              <span className="relative flex size-10 shrink-0 overflow-hidden rounded-full h-8 w-8 shadow-sm">
                <span className="flex size-full items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                  <svg className="lucide lucide-bot h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M12 8V4H8"></path>
                    <rect width="16" height="12" x="4" y="8" rx="2"></rect>
                    <path d="M2 14h2"></path>
                    <path d="M20 14h2"></path>
                    <path d="M15 13v2"></path>
                    <path d="M9 13v2"></path>
                  </svg>
                </span>
              </span>

              {/* Typing Animation */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-3">
                  <span className="font-medium text-sm text-foreground">AI Assistant</span>
                  <span className="text-xs text-muted-foreground">typing...</span>
                </div>
                <div className="prose prose-sm max-w-none p-4 rounded-2xl bg-white border border-blue-100 shadow-sm mr-8">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full typing-dot"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full typing-dot"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full typing-dot"></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="border-t border-border bg-white/80 backdrop-blur-xl p-6 shadow-lg">
          <div className="max-w-4xl mx-auto">
            <div className="relative flex items-end gap-3">
              <div className="flex-1 relative">
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content w-full px-3 text-base outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm min-h-[52px] max-h-[200px] resize-none pr-12 py-4 bg-white border border-gray-200 rounded-2xl shadow-inner focus:border-blue-300 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                  placeholder="Ask me anything..."
                  rows="1"
                />
                <div className="absolute bottom-3 right-3">
                  <button
                    onClick={handleSubmit}
                    disabled={!inputValue.trim() || (user?.credits <= 0)}
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all duration-200 disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background text-primary-foreground hover:shadow-lg hover:shadow-blue/20 hover:bg-primary/90 active:scale-[0.98] text-xs h-8 w-8 p-0 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-red-500" aria-hidden="true">
                        <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-send h-4 w-4" aria-hidden="true">
                        <path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"></path>
                        <path d="m21.854 2.147-10.94 10.939"></path>
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
              <span>Press Enter to send, Shift+Enter for new line</span>
              <span className="">{inputValue.length}/2000</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatArea;

