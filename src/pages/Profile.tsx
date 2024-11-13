import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import { User, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';

export function Profile() {
  const { user, updateProfile, logout } = useAuthStore();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    username: user.username,
    bio: user.bio || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile(formData);
      toast.success('Profile updated successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Update failed');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-xl">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Profile Settings</h2>
            <button
              onClick={handleLogout}
              className="flex items-center text-red-600 hover:text-red-700"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Logout
            </button>
          </div>
          
          <div className="mb-6 flex items-center">
            <img
              src={user.avatar}
              alt={user.username}
              className="w-20 h-20 rounded-full mr-4"
            />
            <div>
              <h3 className="text-lg font-medium text-gray-900">{user.username}</h3>
              <p className="text-gray-500">{user.email}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
                minLength={3}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bio
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                rows={4}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
            >
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}