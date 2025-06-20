import React, { useState, useRef, useEffect } from 'react';
import echo from '../utils/echo'; 


export default function SimpleChat() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [username, setUsername] = useState('');
  const [isUsernameSet, setIsUsernameSet] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isUsernameSet) {
      loadMessages();
      setupWebSocket();
    }
  }, [isUsernameSet]);

  const loadMessages = async () => {
    try {
      const response = await fetch('https://laravelchat.onrender.com/messages');
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
        const response = await fetch('https://laravelchat.onrender.com/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: username,
            content: inputText
          })
        });

        if (response.ok) setInputText('');
        else throw new Error('Erro na resposta do servidor');
      } catch (error) {
        console.error('Erro ao enviar mensagem:', error);
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
      if (isUsernameSet) sendMessage();
      else handleUsernameSubmit();
    }
  };

  const handleUsernameSubmit = () => {
    if (username.trim()) setIsUsernameSet(true);
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const renderMessage = (message, index) => {
    const isUser = message.username === username;
    return (
      <div key={message.id || index} className={`d-flex mb-2 ${isUser ? 'justify-content-end' : 'justify-content-start'}`}>
        <div className={`p-2 rounded ${isUser ? 'bg-primary text-white' : 'bg-light text-dark'}`} style={{ maxWidth: '75%' }}>
          {!isUser && <div className="fw-bold">{message.username}</div>}
          <div>{message.content}</div>
          <div className="text-end small text-muted">{formatTime(message.created_at || new Date())}</div>
        </div>
      </div>
    );
  };

  if (!isUsernameSet) {
    return (
      <div className="container d-flex vh-100 justify-content-center align-items-center bg-gradient" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <div className="card shadow p-4 w-100" style={{ maxWidth: '400px' }}>
          <h3 className="text-center mb-3">💬 Entrar no Chat</h3>
          <p className="text-center">Digite seu nome para começar:</p>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Seu nome..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={handleKeyPress}
              autoFocus
              maxLength={20}
            />
            <button
              className="btn btn-primary"
              type="button"
              onClick={handleUsernameSubmit}
              disabled={!username.trim()}
            >
              Entrar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column vh-100 bg-light">
      <div className="bg-primary text-white text-center p-3">
        <h5 className="mb-0">💬 Chat ao Vivo</h5>
        <small>Conectado como: {username}</small>
      </div>

      <div className="flex-grow-1 overflow-auto p-3">
        {messages.length === 0 ? (
          <div className="text-center text-muted mt-5">Seja o primeiro a enviar uma mensagem! 👋</div>
        ) : (
          messages.map(renderMessage)
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 border-top bg-white">
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Digite sua mensagem..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
          />
          <button
            className="btn btn-primary"
            type="button"
            onClick={sendMessage}
            disabled={!inputText.trim() || isLoading}
          >
            {isLoading ? '⏳' : '📤'}
          </button>
        </div>
      </div>
    </div>
  );
}
