const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'பெயர் தேவை'], // Name is required
      trim: true,
      maxlength: [100, 'பெயர் 100 எழுத்துகளுக்கு மேல் இருக்கக்கூடாது'],
    },
    phone: {
      type: String,
      unique: true,
      sparse: true,
      match: [/^[6-9]\d{9}$/, 'சரியான தொலைபேசி எண் கொடுக்கவும்'],
    },
    email: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'சரியான மின்னஞ்சல் கொடுக்கவும்'],
    },
    password: {
      type: String,
      required: [true, 'கடவுச்சொல் தேவை'],
      minlength: [6, 'கடவுச்சொல் குறைந்தது 6 எழுத்துகள் இருக்க வேண்டும்'],
      select: false,
    },
    preferredLanguage: {
      type: String,
      default: 'ta', // Tamil default
    },
    age: {
      type: Number,
      min: 1,
      max: 120,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
    },
    address: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare entered password with stored hash
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Validate that either phone or email is present
userSchema.pre('validate', function (next) {
  if (!this.phone && !this.email) {
    this.invalidate('phone', 'தொலைபேசி அல்லது மின்னஞ்சல் கொடுக்கவும்');
  }
  next();
});

module.exports = mongoose.model('User', userSchema);
