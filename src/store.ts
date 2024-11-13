/* eslint-disable @typescript-eslint/no-unused-vars */
import { create } from 'zustand';
import type { ChatState, Message, Room, User } from './types';

export const useChatStore = create<ChatState>((set) => ({
  user: null,
  rooms: [
    {
      id: 'general',
      name: 'General',
      description: 'General discussion for everyone',
      users: [],
      messages: [],
    },
    {
      id: 'tech',
      name: 'Technology',
      description: 'Tech discussions and news',
      users: [],
      messages: [],
    },
  ],
  currentRoom: null,
  
  setUser: (user) => set({ user }),
  
  addRoom: (room) => set((state) => ({
    rooms: [...state.rooms, room],
  })),
  
  setCurrentRoom: (roomId) => set({ currentRoom: roomId }),
  
  addMessage: (message) => set((state) => ({
    rooms: state.rooms.map((room) =>
      room.id === message.roomId
        ? { ...room, messages: [...room.messages, message] }
        : room
    ),
  })),
  
  addUserToRoom: (roomId, user) => set((state) => ({
    rooms: state.rooms.map((room) =>
      room.id === roomId
        ? { ...room, users: [...room.users, user] }
        : room
    ),
  })),
  
  removeUserFromRoom: (roomId, userId) => set((state) => ({
    rooms: state.rooms.map((room) =>
      room.id === roomId
        ? { ...room, users: room.users.filter((u) => u.id !== userId) }
        : room
    ),
  })),
}));