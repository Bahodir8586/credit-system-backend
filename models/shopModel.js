const mongoose = require('mongoose');

const shopSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide the name of shop'],
  },
  image: {
    type: String,
    required: true,
  },
  location: {
    type: {
      type: String,
      default: 'Point',
      enum: ['Point'],
    },
    coordinates: [Number],
    address: String,
    description: String,
  },
  employees: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
  ],
});

const Shop = mongoose.model('Shop', shopSchema);

module.exports = Shop;
