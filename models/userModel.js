const mongoose = require('mongoose');
const validator = require('validator');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
    mingLength: 2,
    validate: [validator.isAlpha, 'Please use only characters a-z and A-Z'],
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: [true, 'Please provide your email'],
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minLength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please provide a password confirmation'],
    validate: {
      validator: function (el) {
        return this.password === el;
      },
      message: 'Passwords are not the same',
    },
  },
  role: {
    type: String,
    enum: ['admin', 'manager', 'assistant', 'warehouse-manager', 'user'],
    default: 'user',
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
