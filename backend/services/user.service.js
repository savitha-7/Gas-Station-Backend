import User from '../models/User.js'


export async function updateUserService(userId, updateData) {
  const allowedFields = ['name', 'email', 'phone'];
  const filteredData = {};
  allowedFields.forEach(field => {
    if (updateData[field] !== undefined) {
      filteredData[field] = updateData[field];
    }
  });

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: filteredData },
    { new: true, runValidators: true }
  );

  return updatedUser;
}
