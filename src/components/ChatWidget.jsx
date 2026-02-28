import React, { useEffect, useState } from 'react';
import { chatAPI } from '../services/api';
import './ChatWidget.css';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [conversationId, setConversationId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Initialize conversation
    const convId = `customer-${Date.now()}`;
    setConversationId(convId);
  }, []);

  const handleSendMessage = async () => {
    // Validation
    if (!inputValue.trim()) {
      setError('Please enter a message');
      return;
    }

    if (!customerName.trim()) {
      setError('Please enter your name');
      return;
    }

    setLoading(true);
    setError('');

    const newMessage = {
      senderId: conversationId,
      senderName: customerName,
      message: inputValue,
      recipientId: 'admin',
      conversationId: conversationId,
      timestamp: new Date()
    };

    // Add message to UI immediately (optimistic update)
    setMessages([...messages, { ...newMessage, isOwn: true }]);
    setInputValue('');

    try {
      const response = await chatAPI.sendMessage(newMessage);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to send message');
      }

      // Message sent successfully
    } catch (error) {
      console.error('Error sending message:', error);
      setError(error.message || 'Failed to send message. Please try again.');
      
      // Remove the failed message from UI
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError('');
  };

  return (
    <>
      {/* Chat Widget Button */}
      <button
        className="chat-widget-btn"
        onClick={() => setIsOpen(!isOpen)}
        title="Chat with us"
      >
        💬
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="chat-widget-window">
          <div className="chat-header">
            <h3>GN SONS Support</h3>
            <button onClick={() => setIsOpen(false)}>✕</button>
          </div>

          <div className="chat-messages">
            <div className="welcome-message">
              <p>👋 Hello! How can we help you?</p>
              <p style={{ fontSize: '0.85rem', marginTop: '8px' }}>
                📞 0302-0060496 | 📧 fysal3377@gmail.com
              </p>
            </div>
            
            {messages.map((msg, idx) => (
              <div key={idx} className={`message ${msg.isOwn ? 'own' : 'admin'}`}>
                {!msg.isOwn && <span className="sender">Admin</span>}
                <p>{msg.message}</p>
              </div>
            ))}

            {/* Error Message Display */}
            {error && (
              <div className="error-message">
                <p>❌ {error}</p>
                <button className="error-close" onClick={clearError}>✕</button>
              </div>
            )}

            {/* Loading Indicator */}
            {loading && (
              <div className="loading-message">
                <p>⏳ Sending...</p>
              </div>
            )}
          </div>

          <div className="chat-input-section">
            {!customerName && (
              <input
                type="text"
                placeholder="Your name..."
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && customerName.trim()) {
                    e.preventDefault();
                  }
                }}
                disabled={loading}
              />
            )}
            <div className="input-group">
              <input
                type="text"
                placeholder="Type a message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !loading) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                disabled={loading}
              />
              <button 
                onClick={handleSendMessage}
                disabled={loading}
                className={loading ? 'loading' : ''}
              >
                {loading ? '⏳' : 'Send'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
