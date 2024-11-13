import express from 'express';
import Message from '../models/Message.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.post('/', auth, async (req, res) => {
  try {
    const { content, roomId } = req.body;
    const message = new Message({
      content,
      roomId,
      userId: req.user.userId
    });
    await message.save();
    const populatedMessage = await message.populate('userId', 'username avatar');
    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    
    if (message.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    message.content = req.body.content;
    message.edited = true;
    await message.save();
    
    const populatedMessage = await message.populate('userId', 'username avatar');
    res.json(populatedMessage);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    
    if (message.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    await message.deleteOne();
    res.json({ message: 'Message deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;