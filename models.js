const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
});

const reportSchema = new mongoose.Schema({
  atmLocation: { type: String, required: true },
  problem: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);
const Report = mongoose.model('Report', reportSchema);

module.exports = { User, Report };
