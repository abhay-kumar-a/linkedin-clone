import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { chatAPI } from '../services/api';
import Navbar from '../components/Navbar';
import Loading from '../components/Loading';
import { FiSend, FiSearch, FiPlus, FiMessageSquare } from 'react-icons/fi';
import { toast } from 'react-toastify';
import './Chat.css';

export default function Chat() {
  const { user } = useAuth();
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [showNewChat, setShowNewChat] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    if (selectedChat) {
      fetchMessages(selectedChat.id);
    }
  }, [selectedChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchChats = async () => {
    try {
      const response = await chatAPI.getAllChats();
      setChats(response.data);
    } catch (error) {
      console.error('Error fetching chats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (chatId) => {
    try {
      const response = await chatAPI.getChatById(chatId);
      setMessages(response.data.messages || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat) return;

    try {
      const response = await chatAPI.sendMessage({
        chatId: selectedChat.id,
        content: newMessage
      });
      setMessages([...messages, response.data]);
      setNewMessage('');
    } catch (error) {
      toast.error('Error sending message');
    }
  };

  const handleCreateChat = async (e) => {
    e.preventDefault();
    try {
      const response = await chatAPI.createChat({
        participantId: searchQuery
      });
      setChats([...chats, response.data]);
      setShowNewChat(false);
      setSearchQuery('');
    } catch (error) {
      toast.error('Error creating chat');
    }
  };

  if (loading) return <Loading />;

  return (
    <>
      <Navbar />
      <div className="container chat-page">
        <div className="chat-sidebar">
          <div className="chat-sidebar-header">
            <h2>Messaging</h2>
            <button className="btn btn-outline" onClick={() => setShowNewChat(true)}>
              <FiPlus />
            </button>
          </div>
          <div className="chat-search">
            <FiSearch />
            <input type="text" placeholder="Search messages" />
          </div>
          <div className="chat-list">
            {chats.map((chat) => (
              <div
                key={chat.id}
                className={`chat-item ${selectedChat?.id === chat.id ? 'active' : ''}`}
                onClick={() => setSelectedChat(chat)}
              >
                <div className="chat-avatar">
                  {chat.participant?.firstName?.charAt(0) || 'U'}
                </div>
                <div className="chat-preview">
                  <h4>{chat.participant?.firstName} {chat.participant?.lastName}</h4>
                  <p>{chat.lastMessage?.content || 'No messages yet'}</p>
                </div>
              </div>
            ))}
            {chats.length === 0 && (
              <div className="empty-state">
                <p>No conversations yet</p>
              </div>
            )}
          </div>
        </div>

        <div className="chat-main">
          {selectedChat ? (
            <>
              <div className="chat-header">
                <div className="chat-avatar">
                  {selectedChat.participant?.firstName?.charAt(0)}
                </div>
                <h3>{selectedChat.participant?.firstName} {selectedChat.participant?.lastName}</h3>
              </div>
              <div className="chat-messages">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`message ${msg.senderId === user?.id ? 'sent' : 'received'}`}
                  >
                    <div className="message-content">
                      <p>{msg.content}</p>
                      <span className="message-time">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              <form className="chat-input" onSubmit={handleSendMessage}>
                <input
                  type="text"
                  placeholder="Write a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <button type="submit" className="btn btn-primary" disabled={!newMessage.trim()}>
                  <FiSend />
                </button>
              </form>
            </>
          ) : (
            <div className="chat-empty">
              <FiMessageSquare />
              <h3>Select a conversation</h3>
              <p>Choose a conversation from the sidebar to start messaging</p>
            </div>
          )}
        </div>
      </div>

      {showNewChat && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>New Message</h2>
              <button onClick={() => setShowNewChat(false)}>×</button>
            </div>
            <form onSubmit={handleCreateChat}>
              <div className="modal-body">
                <div className="input-group">
                  <label>Search User</label>
                  <input
                    type="text"
                    placeholder="Enter user ID or search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowNewChat(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">Start Chat</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
