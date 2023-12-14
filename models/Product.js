const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    name: String,
    price: Number,
    description: String,
    images: [
      {
        image: String,
        public_id: String,
      }
    ],
    category: String,
    color: String,
  });
  

module.exports = mongoose.model('Product', ProductSchema);