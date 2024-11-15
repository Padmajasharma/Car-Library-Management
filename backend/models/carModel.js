const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    tags: {
        car_type: { 
            type: String, 
            required: true 
        },
        company: { 
            type: String, 
            required: true 
        },
        dealer: { 
            type: String, 
            required: true 
        }
    },
    images: {
        type: [{
            url: {
                type: String,
                required: true,
                trim: true
            },
            public_id:{
                type: String,
                trim: true
            }
        }],
        validate: [arrayLimit, '{PATH} exceeds the limit of 10']
    }
}, {
    timestamps: true
});

function arrayLimit(val) {
    return val.length <= 10;
}

module.exports = mongoose.model('Car', carSchema);
