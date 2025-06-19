import React, { useState, useRef, useEffect } from 'react';

export default function SimpleChat() {
  const [messages, setMessages] = useState([
    { id: 1, text: 'Bem-vindo ao chat!', sender: 'system', time: '10:00' }
  ]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  // Auto-scroll para a última mensagem
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = () => {
    if (inputText.trim()) {
      const newMessage = {
        id: messages.length + 1,
        text: inputText,
        sender: 'user',
        time: new Date().toLocaleTimeString('pt-BR', { 
          hour: '2-digit', 
          minute: '2-digit' 
        })
      };
      setMessages(prev => [...prev, newMessage]);
      setInputText('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  const renderMessage = (message) => {
    const isUser = message.sender === 'user';
    const isSystem = message.sender === 'system';
    
    return (
      <div 
        key={message.id} 
        className={`message-container ${isUser ? 'user-message' : ''}`}
      >
        <div className={`message-bubble ${
          isUser ? 'user-bubble' : 
          isSystem ? 'system-bubble' : 'other-bubble'
        }`}>
          <div className="message-text">{message.text}</div>
          <div className="message-time">{message.time}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="chat-container">
      {/* Header */}
      <div className="chat-header">
        <h4 className="mb-0">💬 Chat ao Vivo</h4>
        <small className="text-light">Online agora</small>
      </div>
      
      {/* Messages Area */}
      <div className="messages-area">
        <div className="messages-content">
          {messages.map(renderMessage)}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* Input Area */}
      <div className="input-area">
        <div className="input-group input-group-lg">
          <input
            type="text"
            className="form-control chat-input"
            placeholder="Digite sua mensagem..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            autoFocus
          />
          <button 
            className="btn btn-primary btn-send" 
            type="button"
            onClick={sendMessage}
            disabled={!inputText.trim()}
          >
            📤
          </button>
        </div>
      </div>

      <style jsx>{`
        .chat-container {
          height: 100vh;
          display: flex;
          flex-direction: column;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .chat-header {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          color: white;
          padding: 1rem 1.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          text-align: center;
        }

        .messages-area {
          flex: 1;
          overflow: hidden;
          padding: 1rem;
        }

        .messages-content {
          height: 100%;
          overflow-y: auto;
          scroll-behavior: smooth;
        }

        .messages-content::-webkit-scrollbar {
          width: 6px;
        }

        .messages-content::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }

        .messages-content::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 3px;
        }

        .message-container {
          margin-bottom: 1rem;
          display: flex;
        }

        .user-message {
          justify-content: flex-end;
        }

        .message-bubble {
          max-width: 70%;
          padding: 0.8rem 1rem;
          border-radius: 18px;
          position: relative;
          word-wrap: break-word;
        }

        .user-bubble {
          background: #007bff;
          color: white;
          border-bottom-right-radius: 5px;
        }

        .system-bubble {
          background: rgba(255, 255, 255, 0.9);
          color: #6c757d;
          font-style: italic;
          margin: 0 auto;
          text-align: center;
        }

        .other-bubble {
          background: rgba(255, 255, 255, 0.95);
          color: #333;
          border-bottom-left-radius: 5px;
        }

        .message-text {
          font-size: 0.95rem;
          line-height: 1.4;
        }

        .message-time {
          font-size: 0.7rem;
          opacity: 0.7;
          margin-top: 0.3rem;
          text-align: right;
        }

        .system-bubble .message-time {
          text-align: center;
        }

        .input-area {
          padding: 1rem 1.5rem;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-top: 1px solid rgba(255, 255, 255, 0.2);
        }

        .chat-input {
          border: none;
          border-radius: 25px;
          padding: 0.8rem 1.2rem;
          font-size: 1rem;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .chat-input:focus {
          box-shadow: 0 2px 15px rgba(0, 123, 255, 0.3);
          border-color: #007bff;
        }

        .btn-send {
          border-radius: 25px;
          padding: 0.8rem 1.2rem;
          border: none;
          font-size: 1.1rem;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          transition: all 0.2s ease;
        }

        .btn-send:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 15px rgba(0, 123, 255, 0.4);
        }

        .btn-send:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .chat-header {
            padding: 0.8rem 1rem;
          }
          
          .messages-area {
            padding: 0.5rem;
          }
          
          .input-area {
            padding: 0.8rem 1rem;
          }
          
          .message-bubble {
            max-width: 85%;
          }
        }
      `}</style>
    </div>
  );
}