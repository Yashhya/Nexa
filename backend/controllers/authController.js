const User = require('../models/User');
const { generateToken } = require('../middleware/authMiddleware');

// @route POST /api/auth/register
const register = async (req, res) => {
  const { name, email, password, phone } = req.body;
  if (!name || !email || !password) return res.status(400).json({ success: false, message: 'Please fill all required fields' });
  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ success: false, message: 'Email already registered' });
  const user = await User.create({ name, email, password, phone });
  const token = generateToken(user._id);
  res.cookie('nexaToken', token, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000, sameSite: 'lax' });
  res.status(201).json({
    success: true,
    token,
    user: { _id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar }
  });
};

// @route POST /api/auth/login
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ success: false, message: 'Email and password required' });
  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  }
  if (!user.isActive) return res.status(403).json({ success: false, message: 'Account suspended' });
  user.lastLogin = new Date();
  await user.save();
  const token = generateToken(user._id);
  res.cookie('nexaToken', token, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000, sameSite: 'lax' });
  res.json({
    success: true,
    token,
    user: { _id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, phone: user.phone }
  });
};

// @route POST /api/auth/logout
const logout = async (req, res) => {
  res.clearCookie('nexaToken');
  res.json({ success: true, message: 'Logged out successfully' });
};

// @route GET /api/auth/me
const getMe = async (req, res) => {
  const user = await User.findById(req.user._id).select('-password').populate('wishlist', 'name price thumbnail');
  res.json({ success: true, user });
};

// @route PUT /api/auth/profile
const updateProfile = async (req, res) => {
  const { name, phone, avatar } = req.body;
  const user = await User.findById(req.user._id);
  if (name) user.name = name;
  if (phone) user.phone = phone;
  if (avatar) user.avatar = avatar;
  await user.save();
  res.json({ success: true, user: { _id: user._id, name: user.name, email: user.email, phone: user.phone, avatar: user.avatar, role: user.role } });
};

// @route PUT /api/auth/password
const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id);
  if (!(await user.matchPassword(currentPassword))) {
    return res.status(400).json({ success: false, message: 'Current password incorrect' });
  }
  user.password = newPassword;
  await user.save();
  res.json({ success: true, message: 'Password updated' });
};

// @route POST /api/auth/address
const addAddress = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (req.body.isDefault) user.addresses.forEach(a => a.isDefault = false);
  user.addresses.push(req.body);
  await user.save();
  res.json({ success: true, addresses: user.addresses });
};

// @route DELETE /api/auth/address/:id
const deleteAddress = async (req, res) => {
  const user = await User.findById(req.user._id);
  user.addresses = user.addresses.filter(a => a._id.toString() !== req.params.id);
  await user.save();
  res.json({ success: true, addresses: user.addresses });
};

module.exports = { register, login, logout, getMe, updateProfile, changePassword, addAddress, deleteAddress };
