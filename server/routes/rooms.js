import express from 'express';
import Room from '../models/Room.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Create a new room
router.post('/', auth, async (req, res) => {
  try {
    const { name, description } = req.body;
    const room = new Room({
      name,
      description,
      createdBy: req.user.userId
    });
    await room.save();
    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all rooms
router.get('/', auth, async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    
    const rooms = await Room.find(query)
      .populate('createdBy', 'username')
      .sort({ createdAt: -1 });
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Join a room
router.post('/:id/join', auth, async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    
    // Add user to room members if not already a member
    if (!room.members.includes(req.user.userId)) {
      room.members.push(req.user.userId);
      await room.save();
    }
    
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Leave a room
router.post('/:id/leave', auth, async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    
    // Remove user from room members
    room.members = room.members.filter(
      memberId => memberId.toString() !== req.user.userId
    );
    await room.save();
    
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    
    if (room.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    await room.deleteOne();
    res.json({ message: 'Room deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;