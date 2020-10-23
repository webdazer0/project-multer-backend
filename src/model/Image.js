const { model, Schema } = require('mongoose');

const imageSchema = new Schema({
    imgUrl: String,
    public_id: String
});

module.exports = model('Image', imageSchema);