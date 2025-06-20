import React, { useState, useRef, useEffect } from 'react';
 import echo from '../utils/echo'; 

export default function SimpleChat() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [username, setUsername] = useState('');
  const [isUsernameSet, setIsUsernameSet] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll para a última mensagem
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Carregar mensagens existentes e configurar WebSocket
  useEffect(() => {
    if (isUsernameSet) {
      loadMessages();
      setupWebSocket(); 
    }
  }, [isUsernameSet]);

  const loadMessages = async () => {
    try {
      const response = await fetch('https://laravelchat.onrender.com/api/messages');
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error);
    }
  };

  
  const setupWebSocket = () => {
    echo.channel('chat')
      .listen('.message.sent', (e) => {
        setMessages(prev => [...prev, e.message]);
      });

    return () => {
      echo.leave('chat');
    };
  };


  const sendMessage = async () => {
    if (inputText.trim() && username.trim()) {
      setIsLoading(true);
      try {
        const response = await fetch('https://laravelchat.onrender.com/api/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: username,
            content: inputText
          })
        });
        
        if (response.ok) {
          setInputText('');
        } else {
          throw new Error('Erro na resposta do servidor');
        }
      } catch (error) {
        console.error('Erro ao enviar mensagem:', error);
        // Adicionar mensagem localmente se falhar (fallback)
        const newMessage = {
          id: Date.now(),
          username: username,
          content: inputText,
          created_at: new Date().toISOString()
        };
        setMessages(prev => [...prev, newMessage]);
        setInputText('');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      if (isUsernameSet) {
        sendMessage();
      } else {
        handleUsernameSubmit();
      }
    }
  };

  const handleUsernameSubmit = () => {
    if (username.trim()) {
      setIsUsernameSet(true);
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const renderMessage = (message, index) => {
    const isUser = message.username === username;
    
    return (
      <div 
        key={message.id || index} 
        className={`message-container ${isUser ? 'user-message' : ''}`}
      >
        <div className={`message-bubble ${isUser ? 'user-bubble' : 'other-bubble'}`}>
          {!isUser && (
            <div className="message-username">{message.username}</div>
          )}
          <div className="message-text">{message.content}</div>
          <div className="message-time">
            {formatTime(message.created_at || new Date())}
          </div>
        </div>
      </div>
    );
  };

  // Tela de entrada do username
  if (!isUsernameSet) {
    return (
      <div className="chat-container">
        <div className="username-setup">
          <div className="username-card">
            <h3>💬 Entrar no Chat</h3>
            <p>Digite seu nome para começar a conversar:</p>
            <div className="input-group input-group-lg">
              <input
                type="text"
                className="form-control username-input"
                placeholder="Seu nome..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={handleKeyPress}
                autoFocus
                maxLength={20}
              />
              <button 
                className="btn btn-primary btn-enter" 
                type="button"
                onClick={handleUsernameSubmit}
                disabled={!username.trim()}
              >
                Entrar
              </button>
            </div>
          </div>
        </div>

        <style>{`
          .chat-container {
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          }

          .username-setup {
            width: 100%;
            max-width: 400px;
            padding: 2rem;
          }

          .username-card {
            background: rgba(255, 255, 255, 0.95);
            padding: 2rem;
            border-radius: 20px;
            text-align: center;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            backdrop-filter: blur(10px);
          }

          .username-card h3 {
            color: #333;
            margin-bottom: 1rem;
          }

          .username-card p {
            color: #666;
            margin-bottom: 1.5rem;
          }

          .username-input {
            border: none;
            border-radius: 25px;
            padding: 0.8rem 1.2rem;
            font-size: 1rem;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          }

          .username-input:focus {
            box-shadow: 0 2px 15px rgba(0, 123, 255, 0.3);
            border-color: #007bff;
          }

          .btn-enter {
            border-radius: 25px;
            padding: 0.8rem 1.5rem;
            border: none;
            font-size: 1rem;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            transition: all 0.2s ease;
          }

          .btn-enter:hover:not(:disabled) {
            transform: translateY(-1px);
            box-shadow: 0 4px 15px rgba(0, 123, 255, 0.4);
          }

          .btn-enter:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="chat-container">
      {/* Header */}
      <div className="chat-header">
        <h4 className="mb-0">💬 Chat ao Vivo</h4>
        <small className="text-light">Conectado como: {username}</small>
      </div>
      
      {/* Messages Area */}
      <div className="messages-area">
        <div className="messages-content">
          {messages.length === 0 ? (
            <div className="no-messages">
              <p>Seja o primeiro a enviar uma mensagem! 👋</p>
            </div>
          ) : (
            messages.map(renderMessage)
          )}
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
            disabled={isLoading}
            autoFocus
          />
          <button 
            className="btn btn-primary btn-send" 
            type="button"
            onClick={sendMessage}
            disabled={!inputText.trim() || isLoading}
          >
            {isLoading ? '⏳' : '📤'}
          </button>
        </div>
      </div>

      <style>{`
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

        .no-messages {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          color: rgba(255, 255, 255, 0.7);
          text-align: center;
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

        .other-bubble {
          background: rgba(255, 255, 255, 0.95);
          color: #333;
          border-bottom-left-radius: 5px;
        }

        .message-username {
          font-size: 0.8rem;
          font-weight: bold;
          margin-bottom: 0.3rem;
          color: #007bff;
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

        .chat-input:disabled {
          opacity: 0.7;
          cursor: not-allowed;
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