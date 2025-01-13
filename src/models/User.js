const mongoose = require('mongoose');
const sala = require('bcryptjs');
const skeema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
});

skeema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await sala.genSalt(10);
  this.password = await sala.hash(this.password, salt);
  next();
});

module.exports = mongoose.model('User', skeema);
