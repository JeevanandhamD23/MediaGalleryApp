const mongoose = require('mongoose');

const binSchema = new mongoose.Schema({
    originalId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    originalCollection: {
        type: String,
        enum: ['images', 'videos'],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: String,
    url: {
        type: String,
        required: true
    },
    filename: {
        type: String,
        required: true
    },
    mimetype: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return v.startsWith('image/') || v.startsWith('video/');
            },
            message: props => `${props.value} is not a valid mimetype!`
        }
    },
    size: {
        type: Number,
        required: true
    },
    isStarred: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date,
        required: true
    }
}, { collection: 'bin' });

module.exports = mongoose.model('Bin', binSchema); 