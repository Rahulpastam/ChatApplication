import React, { useEffect, useRef, useState } from 'react';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import { useNavigate } from 'react-router-dom';
import { useChatStore } from '../store';
import { useAuthStore } from '../store/auth';
import { Message, Room } from '../types';
import { Send, Plus, Search, LogOut, Settings, User } from 'lucide-react';

export function ChatRoom() {
  const [message, setMessage] = useState('');
  const [newRoomName, setNewRoomName] = useState('');
  const [showNewRoomModal, setShowNewRoomModal] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  const { user, rooms, currentRoom, addMessage, addRoom, setCurrentRoom } = useChatStore();
  const { logout } = useAuthStore();
  
  const currentRoomData = rooms.find((r) => r.id === currentRoom);
  
  const filteredRooms = rooms.filter(room => 
    room.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentRoomData?.messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && user && currentRoom) {
      const newMessage: Message = {
        id: crypto.randomUUID(),
        content: message.trim(),
        userId: user.id,
        username: user.username,
        roomId: currentRoom,
        timestamp: Date.now(),
      };
      addMessage(newMessage);
      setMessage('');
    }
  };

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (newRoomName.trim()) {
      const newRoom: Room = {
        id: crypto.randomUUID(),
        name: newRoomName.trim(),
        description: `Welcome to ${newRoomName}`,
        users: [],
        messages: [],
      };
      addRoom(newRoom);
      setNewRoomName('');
      setShowNewRoomModal(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  if (!user) return null;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* User Profile Section */}
        <div className="p-4 border-b border-gray-200 relative">
          <div 
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          >
            <img
              src={user.avatar}
              alt={user.username}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <h3 className="font-medium text-gray-900">{user.username}</h3>
              <p className="text-sm text-gray-500">Online</p>
            </div>
          </div>

          {/* Profile Menu Dropdown */}
          {showProfileMenu && (
            <div className="absolute left-0 right-0 mt-2 mx-4 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
              <button
                onClick={handleProfileClick}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2"
              >
                <Settings className="w-4 h-4" />
                <span>Profile Settings</span>
              </button>
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 text-red-600 flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
        
        {/* Search and Room Management */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <input
              type="text"
              placeholder="Search rooms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
          </div>
        </div>

        {/* Rooms List */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-700">Rooms</h2>
            <button
              onClick={() => setShowNewRoomModal(true)}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <Plus className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          
          <div className="space-y-2">
            {filteredRooms.map((room) => (
              <button
                key={room.id}
                onClick={() => setCurrentRoom(room.id)}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  currentRoom === room.id
                    ? 'bg-indigo-100 text-indigo-800'
                    : 'hover:bg-gray-100'
                }`}
              >
                <div className="font-medium">{room.name}</div>
                <div className="text-sm text-gray-500">
                  {room.users.length} online
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {currentRoomData ? (
          <>
            <div className="p-4 border-b border-gray-200 bg-white">
              <h2 className="text-xl font-semibold">{currentRoomData.name}</h2>
              <p className="text-sm text-gray-500">
                {currentRoomData.description}
              </p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {currentRoomData.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.userId === user.id ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      msg.userId === user.id
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white'
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium">{msg.username}</span>
                      <span className="text-xs opacity-75">
                        {format(msg.timestamp, 'HH:mm')}
                      </span>
                    </div>
                    <ReactMarkdown className="prose prose-sm max-w-none">
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <form
              onSubmit={handleSendMessage}
              className="p-4 border-t border-gray-200 bg-white"
            >
              <div className="flex space-x-4">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500">Select a room to start chatting</p>
          </div>
        )}
      </div>

      {/* New Room Modal */}
      {showNewRoomModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Create New Room</h3>
            <form onSubmit={handleCreateRoom}>
              <input
                type="text"
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
                placeholder="Room name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4"
                required
              />
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowNewRoomModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Create Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}