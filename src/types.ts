export interface User {
  id: string;
  username: string;
  avatar: string;
}

export interface Message {
  id: string;
  content: string;
  userId: string;
  username: string;
  roomId: string;
  timestamp: number;
}

export interface Room {
  id: string;
  name: string;
  description: string;
  users: User[];
  messages: Message[];
}

export interface ChatState {
  user: User | null;
  rooms: Room[];
  currentRoom: string | null;
  setUser: (user: User) => void;
  addRoom: (room: Room) => void;
  setCurrentRoom: (roomId: string) => void;
  addMessage: (message: Message) => void;
  addUserToRoom: (roomId: string, user: User) => void;
  removeUserFromRoom: (roomId: string, userId: string) => void;
}