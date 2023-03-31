const mongoose = require ('mongoose')
const Category=  mongoose.Schema({


    category:{
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

module.exports = mongoose.model('category',Category)
