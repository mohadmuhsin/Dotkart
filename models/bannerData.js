const mongoose = require('mongoose');
const bannerData = mongoose.Schema({

   name:{
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
module.exports = mongoose.model('banner',bannerData)