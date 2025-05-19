import { response } from 'express';
import { updateUserService } from '../services/user.service.js';

export const updateUser = async (req, res) => {
  try {
    const {userId,role } = req;
    const updateData = req.body;

    const updatedUser = await updateUserService(userId, updateData);

    if(role !== "user")
        return res.status(403).json({message : "Invaild User Token"});

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({message: "Updated Successfully"});
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(400).json({ message: 'Server error', error: error.message });
  }
};
