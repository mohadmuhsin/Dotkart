const mongoose = require('mongoose');
const multer = require('multer')
// data base connection
require('dotenv').config();
mongoose.connect(process.env.MONGO);
const express = require("express")
const app = express()



const logger= require('morgan')
app.use(logger('dev'))

const nocach = require("nocache");
const $ = require('jquery');


//razorpay
const Razorpay = require('razorpay');

var instance = new Razorpay({
  key_id: 'YOUR_KEY_ID',
  key_secret: 'YOUR_KEY_SECRET',
});

// for session management
const session = require('express-session')
app.use(session({
    secret: "there is no  secret",
    saveUninitialized: true,
    cookie: { maxAge: 50000000000 },
    resave: false
}));
app.use(nocach());
app.use(express.json());

//path
const path=require('path')
app.use(express.static(path.join(__dirname,'public')))





// for admin routes
const adminRoute = require('./routes/adminRoute')
app.use('/admin',adminRoute)


//for user Routes
const userRoute = require('./routes/user/userRoute')
app.use('/',userRoute)




app.listen(3000,()=>{
    console.log("server is running");
})