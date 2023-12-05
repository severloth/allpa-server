const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    name: String,
    price: Number,
    description: String,
    image: String,
    public_id: String,
    category: String
});

module.exports = mongoose.model('Product', ProductSchema);