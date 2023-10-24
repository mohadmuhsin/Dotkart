const { string } = require('joi')
const mongoose = require ('mongoose')
const brandData = mongoose.Schema({

    brand:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    status:{
        type:Boolean,
        default:true
    }

})

module.exports = mongoose.model('brand',brandData)