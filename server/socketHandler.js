export const socketHandler = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join_room', (roomId) => {
      socket.join(roomId);
      console.log(`User ${socket.id} joined room ${roomId}`);
    });

    socket.on('leave_room', (roomId) => {
      socket.leave(roomId);
      console.log(`User ${socket.id} left room ${roomId}`);
    });

    socket.on('send_message', (message) => {
      io.to(message.roomId).emit('receive_message', message);
    });

    socket.on('edit_message', (message) => {
      io.to(message.roomId).emit('message_edited', message);
    });

    socket.on('delete_message', (data) => {
      io.to(data.roomId).emit('message_deleted', data.messageId);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};