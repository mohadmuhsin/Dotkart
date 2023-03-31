
const mongoose = require('mongoose')
const userData = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },

    mobileNumber: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true

    },
    password: {
        type: String,
        required: true
    },

    address: [{
        name: {
            type: String,
            required: true
        },
        housename: {
            type: String,
            required: true
        },
        street: {
            type: String,
            required: true
        },
        district: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        pincode: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true
        },
        phone: {
            type: Number,
            required: true
        },
    }],
    status: {
        type: Boolean,
        default: true
    },
    wishlist: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "products",
            required: true
        }
    }],
    cart: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "products",
            required: true
        },
        quantity: {
            type: Number,
            default: 1
        },
        productTotalPrice: {
            type: Number

        }
    }],
    cartTotalPrice: {
        type: Number,
        default: 0

    },
    wallet:{
        type:Number,
        default:0
    }


})

module.exports = mongoose.model('users', userData) 