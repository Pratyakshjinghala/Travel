// controller/userController.js
const getProfile = async (req, res) => {
  // The user object is available from the authMiddleware
  const user = req.user;
  res.json({
    message: `Welcome, ${user.fullName}! This is your protected profile.`,
    user,
  });
};

module.exports = { getProfile };