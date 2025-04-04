import { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, X, Bell } from 'lucide-react';
import { io } from 'socket.io-client';
import { toast } from 'react-hot-toast';

const ChatSystem = ({ userId, userName, userRole = 'user', autoShow = false }) => {
  const [showChat, setShowChat] = useState(autoShow);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState({});
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [onlineAdmins, setOnlineAdmins] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [unreadMessages, setUnreadMessages] = useState({});
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  const SOCKET_SERVER_URL = import.meta.env.PROD
  ? 'https://ordering-system-production.up.railway.app/'
  : 'http://localhost:5000';

  useEffect(() => {
    if (!userId || !userName) {
      console.warn('Missing required props for chat system');
      return;
    }

    // Initialize socket connection
    socketRef.current = io(SOCKET_SERVER_URL, {
      withCredentials: true,
      query: {
        userId,
        userName,
        userRole
      }
    });

    // Handle connection
    socketRef.current.on('connect', () => {
      console.log('Connected to chat server');
      
      // Register user after connection
      socketRef.current.emit('register', {
        userId,
        userName,
        userRole
      });
    });

    // Handle online status updates
    socketRef.current.on('online_status', ({ users, admins }) => {
      console.log('Online status update:', { users, admins });
      setOnlineUsers(users);
      setOnlineAdmins(admins);
    });

    // Handle incoming messages
    socketRef.current.on('receive_message', (data) => {
      console.log('Received message:', data);
      
      // Add message to the conversation
      setMessages(prev => ({
        ...prev,
        [data.from]: [...(prev[data.from] || []), data]
      }));

      // If chat is not visible or different chat is selected, increment unread counter
      if (!showChat || selectedChat?.id !== data.from) {
        setUnreadMessages(prev => ({
          ...prev,
          [data.from]: (prev[data.from] || 0) + 1
        }));
        // Show notification
        toast.custom((t) => (
          <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg`}>
            <p className="font-medium">{data.fromName}</p>
            <p className="text-sm">{data.message}</p>
          </div>
        ));
      }

      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    });

    // Handle connection errors
    socketRef.current.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      toast.error('Chat connection failed');
    });

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [userId, userName, userRole, showChat, selectedChat]);

  const handleSendMessage = () => {
    if (!message.trim() || !selectedChat) return;

    const messageData = {
      to: selectedChat.id,
      message: message.trim(),
      from: userId,
      fromName: userName,
      timestamp: new Date().toISOString()
    };

    console.log('Sending message:', messageData);
    socketRef.current.emit('private_message', messageData);
    
    // Add message to the conversation
    setMessages(prev => ({
      ...prev,
      [selectedChat.id]: [...(prev[selectedChat.id] || []), messageData]
    }));

    setMessage('');
  };

  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
    // Clear unread messages for this chat
    setUnreadMessages(prev => ({
      ...prev,
      [chat.id]: 0
    }));
  };

  if (!userId || !userName) return null;

  const availableChats = userRole === 'user' ? onlineAdmins : onlineUsers;
  const currentMessages = selectedChat ? (messages[selectedChat.id] || []) : [];

  return (
    <div className="fixed bottom-4 right-4 flex flex-col items-end space-y-2 z-50">
      <button
        onClick={() => setShowChat(!showChat)}
        className="relative bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
      >
        {showChat ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        {!showChat && Object.values(unreadMessages).some(count => count > 0) && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
            {Object.values(unreadMessages).reduce((a, b) => a + b, 0)}
          </span>
        )}
      </button>

      {showChat && (
        <div className="w-80 bg-white rounded-lg shadow-xl">
          <div className="border-b p-4">
            <h3 className="font-medium">
              {userRole === 'user' ? 'Chat with Admin' : 'Chat System'}
            </h3>
          </div>

          <div className="p-4">
            <div className="space-y-2">
              {availableChats.length > 0 ? (
                availableChats.map(chat => (
                  <button
                    key={chat.id}
                    onClick={() => handleSelectChat(chat)}
                    className={`w-full text-left p-2 hover:bg-gray-100 rounded flex items-center justify-between ${
                      selectedChat?.id === chat.id ? 'bg-blue-50' : ''
                    }`}
                  >
                    <span>{chat.name}</span>
                    {unreadMessages[chat.id] > 0 && (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        {unreadMessages[chat.id]}
                      </span>
                    )}
                  </button>
                ))
              ) : (
                <p className="text-center text-gray-500">
                  No {userRole === 'user' ? 'admins' : 'users'} online
                </p>
              )}
            </div>

            {selectedChat && (
              <>
                <div className="h-60 overflow-y-auto mt-4 space-y-2 border rounded p-2">
                  {currentMessages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex ${msg.from === userId ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-2 ${
                          msg.from === userId
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <p className="text-xs opacity-75">{msg.fromName}</p>
                        <p>{msg.message}</p>
                        <p className="text-xs mt-1 opacity-75">
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                <div className="mt-4 flex space-x-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatSystem;