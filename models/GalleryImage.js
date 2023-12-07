const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GalleryImageSchema = new Schema({
    image: String,
    description: String,
    public_id: String,
});

module.exports = mongoose.model('GalleryImage', GalleryImageSchema);