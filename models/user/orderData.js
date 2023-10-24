const mongoose = require('mongoose')

const orderData = mongoose.Schema({


    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    orderId: {
        type: String,
        unique: true,
        required: true,
      
    },
    deliveryAddress: {
        type: String,
        required: true
    },
    date: {
        type: Date
        
    },
    product:[{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "products",
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        singleTotal: {
            type: Number,
            requiered: true
        },
        singlePrice:{
            type: Number,
            requiered: true
        }
    }],
    total:{
        type:Number,
    },
    discount:{
        type:Number,
    },
    paymentType:{
        type:String,
        requiered:true
    },
    coupon:{
        type:String
    },
    status:{
        type:String,
        default:'pending'
    }

})

module.exports= mongoose.model('order',orderData)