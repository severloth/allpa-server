const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    productId: Number,
    name: String,
    price: Number,
    description: String,
    images: [
      {
        image: String,
        public_id: String,
        path: String
      }
    ],
    category: String,
    color: String,
    nameEnglish: String,
    descriptionEnglish: String,
    categoryEnglish: String,
    colorEnglish: String,
  });
  

module.exports = mongoose.model('Product', ProductSchema);