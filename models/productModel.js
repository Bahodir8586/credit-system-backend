const mongoose = require('mongoose');
const validator = require('validator');

const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name can not be empty'],
  },
  mainImage: {
    type: String,
    required: [true, 'Please provide image of the product'],
  },
  images: [String],
  amount: {
    type: Number,
    min: [0, 'Amount of the product can not be negative'],
  },
  rating: {
    type: Number,
    default: 5,
    min: [1, 'Rating must be above 1.0'],
    max: [5, 'Rating must be below 5.0'],
    set: (val) => Math.round(val * 10) / 10,
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  description: {
    type: String,
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'Please provide price of the product'],
  },
  priceDiscount: {
    type: Number,
    validate: {
      validator: function (val) {
        return val < this.price;
      },
      message: 'Discount price ({VALUE}) should be below regular price',
    },
  },
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
