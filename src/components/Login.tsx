import React, { useState } from 'react';
import { User } from '../types';
import { useChatStore } from '../store';
import { Users } from 'lucide-react';

export function Login() {
  const [username, setUsername] = useState('');
  const setUser = useChatStore((state) => state.setUser);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      const user: User = {
        id: crypto.randomUUID(),
        username: username.trim(),
        avatar: `https://source.unsplash.com/random/100x100?face&${Date.now()}`,
      };
      setUser(user);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
          <div className="bg-indigo-100 p-3 rounded-full">
            <Users className="w-8 h-8 text-indigo-600" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-8">
          Welcome to ChatSpace
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Choose your username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter username"
              required
              minLength={3}
              maxLength={15}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
          >
            Join Chat
          </button>
        </form>
      </div>
    </div>
  );
}