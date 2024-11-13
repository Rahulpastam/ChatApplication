/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import { auth } from '../api';
import { useChatStore } from '../store';

interface AuthState {
  user: any;
  isAuthenticated: boolean;
  login: (credentials: any) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  updateProfile: (data: any) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  login: async (credentials) => {
    const { data } = await auth.login(credentials);
    localStorage.setItem('token', data.token);

    // Set the user and authentication status in the auth store
    set({ user: data.user, isAuthenticated: true });

    // Set the user and current room in the chat store
    useChatStore.getState().setUser(data.user);
    useChatStore.getState().setCurrentRoom('general'); // Set default room after login
  },

  register: async (userData) => {
    const { data } = await auth.register(userData);
    localStorage.setItem('token', data.token);
    set({ user: data.user, isAuthenticated: true });

    // Also set the user in the chat store
    useChatStore.getState().setUser(data.user);
    useChatStore.getState().setCurrentRoom('general'); // Set default room after registration
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, isAuthenticated: false });
    
    // Clear user in the chat store on logout
    useChatStore.getState().setUser(null);
    useChatStore.getState().setCurrentRoom(null); // Optionally clear the room
  },

  updateProfile: async (data) => {
    const response = await auth.updateProfile(data);
    set({ user: response.data.user });
    
    // Update user in chat store
    useChatStore.getState().setUser(response.data.user);
  },
}));
