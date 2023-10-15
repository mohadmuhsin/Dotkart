const userData = require('../../models/user/userData')
const express = require('express')
const bcrypt = require('bcrypt')
let session = require('session')
const { all, response } = require('../../routes/adminRoute')
const productData = require('../../models/productData')
const categoryData = require('../../models/categoryData')
const { AddCategory } = require('../categoryController')
const bannerData = require('../../models/bannerData')
const brandData = require('../../models/brandData')
const couponData = require('../../models/couponData')




require('dotenv').config();
const accountSid = process.env.TWILIO_ACCOUNT_SID; // Your Account SID from www.twilio.com/console
const authToken = process.env.TWILIO_AUTH_TOKEN;   // Your Auth Token from www.twilio.com/console
const client = require('twilio')(accountSid, authToken);



const loadhomepage = async (req, res) => {
    try {
        const productdata = await productData.find({ status: true }).populate('category')
        const categorydata = await categoryData.find({ status: true })
        const bannerdata = await bannerData.find({})
        const branddata = await brandData.find({})
        const id = req.params.id

        if (productdata) {

            if (req.session.user) {
                const session_id = req.session.user._id
                const userdata = await userData.findOne({ _id: session_id })
                // console.log(userdata);
                res.render('home', {
                    product: productdata,
                    user: userdata,
                    category: categorydata,
                    banner: bannerdata,
                    brand: branddata
                })
            } else {
                res.render('home', {
                    product: productdata,
                    category: categorydata,
                    banner: bannerdata,
                    brand: branddata
                })
            }
        }
    } catch (error) {
        console.log(error.message);
    }
}


//load login page
const loadLogin = async (req, res) => {
    try {
        res.render('login')
    } catch (error) {
        console.log(error.message);
    }
}


//load singup page
const loadSignup = async (req, res) => {
    try {
        res.render('signup')
    } catch (error) {
        console.log(error.message);
    }
}


const verifySignup = async (req, res, next) => {

    req.session.users = req.body
    const found = await userData.findOne({ userName: req.body.UserName })
    if (req.body.Name.trim() == '' || req.body.MobileNumber == '' || req.body.Email == '' || req.body.Password.trim() == '') {
        res.render('signup', { message: "All fields are required" });
    } else if (found) {
        res.render('signup', { message: "This username already exists, please try another." })
    }
    else {
        mobileNo = req.body.MobileNumber
        try {
            const otpResponse = await client.verify.v2
                .services('VAf6a17393a6187b6baeaeadc038a9b04c')
                .verifications.create({
                    to: `+91${mobileNo}`,
                    channel: 'sms',
                });
            const categorydata = await categoryData.find({ status: true })
            res.render('otpPage', { category: categorydata })

        } catch (error) {
            next(error)
        }
    }
}


//verifying otp
const verifyOtp = async (req, res, next) => {
    const otp = req.body.otp;
    try {
        const details = req.session.users;
        const verifiedResponse = await client.verify.v2
            .services('VAf6a17393a6187b6baeaeadc038a9b04c')
            .verificationChecks.create({
                to: `+91${details.MobileNumber}`,
                code: otp,
            })
        if (verifiedResponse.status === 'approved') {

            const hashedPassword = await bcrypt.hash(details.Password, 10)
            const Datas = new userData({
                name: details.Name,
                userName: details.UserName,
                mobileNumber: details.MobileNumber,
                email: details.Email,
                password: hashedPassword
            })
            const datas = await Datas.save();
            const user = await userData.findOne({ name: details.Name })
            if (datas) {
                req.session.user = user
                res.redirect('/')
            } else {

                res.render('otpPage', { message: "wrong otp" })
            }
        }
        else {
            res.render('otpPage', { message: "wrong otp" })
        }
    } catch (error) {
        next(error);
    }
}


//verifying login
const verifyLogin = async (req, res) => {
    try {
        const username = req.body.username
        const password = req.body.password

        const userdata = await userData.findOne({ userName: username })
        if (userdata) {
            if (userdata.status) {
                const compare = await bcrypt.compare(password, userdata.password)
                if (compare) {
                    session = req.session
                    session.user = userdata
                    res.redirect('/')
                }
                else {
                    res.render('login', { message: "Password is wrong" })
                }
            }
            else {
                res.render('login', { message: " You are blocked" })
            }
        }
        else if (password.trim() == '' && username.trim() == '') {
            res.render('login', { message: "fields can't be empty" })
        }
        else {
            res.render('login', { message: "enter a valid username and password" })
        }

    } catch (error) {
        console.log(error.message);
    }
}


//view products
const productDetails = async (req, res) => {
    try {

        const id = req.params.id
        const allProduct = await productData.findOne({ _id: id, status: true }).populate('category')
        const categorydata = await categoryData.find({ status: true })
        const branddata = await brandData.find({})

        if (req.session.user) {

            const user = req.session.user
            const userdata = await userData.findOne({ _id: user._id })

            res.render('viewProduct', {
                product: allProduct,
                user: userdata,
                category: categorydata,
                brand: branddata
            })
        }
        else {
            res.render('viewProduct', {
                product: allProduct,
                category: categorydata,
                brand: branddata
            })
        }

    } catch (error) {
        console.log(error.message);
        res.render("404", { errorMessage: "An error occurred." });
    }
}



//To show all products 
const allProducts = async (req, res) => {

    try {
        let page = 1;
        if (req.query.page) {
            page = req.query.page
        }
        const limit = 12

        const productdata = await productData.find({ status: true }).populate('category')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec()
        const productcount = await productData.find({}).countDocuments()

        let procount = Math.ceil(productcount / limit)
        const categorydata = await categoryData.find({ status: true })
        const branddata = await brandData.find({})


        if (req.session.user) {
            const user = req.session.user
            const userdata = await userData.findOne({ _id: user._id })
            res.render('allProducts', {
                Product: productdata,
                user: userdata,
                productCount: procount,
                category: categorydata,
                brand: branddata
            })
        }
        else {
            res.render('allProducts', {
                Product: productdata,
                productCount: procount,
                category: categorydata,
                brand: branddata
            })
        }

    } catch (error) {
        console.log(error.message);
    }
}

// category wise filtering//////////////////////////////////////////////////////////
const category = async (req, res) => {
    try {
        const id = req.params.id
        let page = 1;
        if (req.query.page) {
            page = req.query.page
        }
        const limit = 12
        const productdata = await productData.find({ category: id, status: true }).populate('category')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec()
        const productcount = await productData.find({}).countDocuments()

        let procount = Math.ceil(productcount / limit)
        const categorydata = await categoryData.find({ status: true })
        const branddata = await brandData.find({})
        // const productdata = await productData.find({ category: id, status: true })
        console.log(productdata);
        if (req.session.user) {
            const user = req.session.user
            const userdata = await userData.findOne({ _id: user._id })
            res.render('categories', {
                Product: productdata,
                user: userdata,
                productCount: procount,
                category: categorydata,
                brand: branddata
            })
        } else {
            res.render('categories', {
                Product: productdata,
                category: categorydata,
                productCount: procount,
                brand: branddata
            })

        }
    } catch (error) {
        console.log(error.message);
        res.render("404", { errorMessage: "An error occurred." });

    }
}


const loadProfile = async (req, res) => {
    try {

        const user = req.session.user
        const userdata = await userData.findOne({ _id: user._id })
        const productdata = await productData.find({ status: true }).populate('category')
        const categorydata = await categoryData.find({ status: true })
        res.render('profile', {
            user: userdata,
            category: categorydata,
            product: productdata
        })

    } catch (error) {
        console.log(error.message);
    }
}

const viewAddress = async (req, res) => {
    try {

        const user = req.session.user
        const categorydata = await categoryData.find({ status: true })
        const userdata = await userData.findOne({ _id: user._id })
        res.render('viewAddress', {
            user: userdata,
            category: categorydata
        })

    } catch (error) {
        console.log(error.message);
    }
}


const loadaddAddress = async (req, res) => {
    try {
        const user = req.session.user
        const categorydata = await categoryData.find({ status: true })
        const userdata = await userData.findOne({ _id: user._id })

        res.render('addAddress', {
            user: userdata,
            category: categorydata
        })

    } catch (error) {
        console.log(error.message);
    }
}

const addAddress = async (req, res, next) => {
    try {

        if (req.session.user) {
            const user = req.session.user
            if (req.body.Name.trim() == '' || req.body.Housename.trim() == '' || req.body.Street.trim() == '' || req.body.District.trim() == '' || req.body.State.trim() == '' || req.body.Pincode.trim() == '' || req.body.Country.trim() == '' || req.body.Phone.trim() == '') {
                const categorydata = await categoryData.find({ status: true })
                const userdata = await userData.findOne({ _id: user._id })

                res.render('addAddress', { category: categorydata, user: userdata, message: "All fields are required" });
            } else {
                const data = await userData.updateOne({ _id: user._id }, {
                    $push: {
                        address: {
                            name: req.body.Name,
                            housename: req.body.Housename,
                            street: req.body.Street,
                            district: req.body.District,
                            state: req.body.State,
                            pincode: req.body.Pincode,
                            country: req.body.Country,
                            phone: req.body.Phone

                        }
                    }
                })


                res.redirect('/viewAddress')
            }

        } else {
            res.redirect("/login")
        }
    } catch (error) {
        next(error)
    }
}






const updateAddress = async (req, res, next) => {
    try {
        if (req.body.Name.trim() == '' || req.body.Housename.trim() == '' || req.body.Street.trim() == '' || req.body.District.trim() == '' || req.body.State.trim() == '' || req.body.Pincode == '' || req.body.Country.trim() == '' || req.body.Phone == '') {
            const categorydata = await categoryData.find({ status: true })
            const user = req.session.user
            const userdata = await userData.findOne({ _id: user._id })
            res.render('viewAddress', { message: "fields are empty", user: userdata, category: categorydata })
        } else {

            const user = req.session.user
            const id = req.params.id
            const data = await userData.updateOne({ _id: user._id, "address._id": id }, {
                $set: {
                    'address.$': {
                        name: req.body.Name,
                        housename: req.body.Housename,
                        street: req.body.Street,
                        district: req.body.District,
                        state: req.body.State,
                        pincode: req.body.Pincode,
                        country: req.body.Country,
                        phone: req.body.Phone

                    }
                }
            })
            console.log(data);

            res.redirect('/viewAddress')
        }
    } catch (error) {
        next(error)
    }
}



const editProfile = async (req, res, next) => {
    try {
        if (req.body.Name.trim() == '' || req.body.email.trim() == '') {
            const categorydata = await categoryData.find({ status: true })
            const user = req.session.user
            const userdata = await userData.findOne({ _id: user._id })
            res.render('profile', {
                message: "fields are empty",
                user: userdata,
                category: categorydata
            })
        } else {
            if (req.session.user) {

                const user = req.session.user
                const data = await userData.updateOne({ _id: user._id }, {
                    $set: {
                        name: req.body.Name,
                        email: req.body.email
                    }
                })
                res.redirect('/profile')

            } else {
                res.redirect('/login')
            }
        }
    } catch (error) {
        res.render('404')
    }
}




//remove address
const removeAddress = async (req, res, next) => {
    try {
        const addId = req.body.addressId
        console.log(addId);
        const user = req.session.user
        console.log(user._id);
        const data = await userData.updateOne({ _id: user._id },
            { $pull: { address: { _id: addId } } })
        if (data) {
            res.json({ success: true })
        }
    } catch (error) {
        next(error)
    }
}



//modal add address in checkout
const modaldAdAddress = async (req, res, next) => {
    try {
        const data = req.body
        const oldPass = data.oldPassword
        const userdata = await userData.findOne({ _id: data.userId })
        console.log(req.body);

        console.log("vannnnnnnnnnnnnu");

        if (req.session.user) {
            console.log("check 2");
            const user = req.session.user
            const update = await userData.updateOne({ _id: user._id }, {
                $push: {
                    address:
                    {
                        name: req.body.Name,
                        housename: req.body.Housename,
                        street: req.body.Street,
                        district: req.body.District,
                        state: req.body.State,
                        pincode: req.body.Pincode,
                        country: req.body.Country,
                        phone: req.body.Phone
                    }

                }
            });
            console.log(update);

            res.json({ success: true })
        }

    } catch (error) {
        next(error)

    }
}


const search = async (req, res) => {
    try {
        const user = req.session.user
        const input = req.body.search
        const result = new RegExp(input, 'i')
        const categorydata = await categoryData.find({ status: true })
        const bannerdata = await bannerData.find({})
        const branddata = await brandData.find({})


        let page = 1;
        if (req.query.page) {
            page = req.query.page
        }
        const limit = 12
        const productdata = await productData.find({ name: result, status: true }).populate('category')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec()
        const productcount = await productData.find({}).countDocuments()
        let procount = Math.ceil(productcount / limit)



        if (req.session.user) {
            const userdata = await userData.findOne({ _id: user._id })
            res.render('allProducts', {
                user: userdata,
                Product: productdata,
                productCount: procount,
                category: categorydata,
                banner: bannerdata,
                brand: branddata
            })
        } else {
            res.render('allProducts', {
                Product: productdata,
                category: categorydata,
                productCount: procount,
                banner: bannerdata,
                brand: branddata
            })
        }
    } catch (error) {
        console.log(error.message);
    }
}


const changePassword = async (req, res) => {
    try {
        const data = req.body
        const oldPass = data.oldPassword
        const userdata = await userData.findOne({ _id: data.userId })

        if (userdata) {
            const compare = await bcrypt.compare(oldPass, userdata.password)
            if (compare) {
                if (data.newPassword === data.confirmPassword) {
                    const hash = await bcrypt.hash(data.newPassword, 10)
                    const update = await userData.updateOne({ _id: data.userId }, { $set: { password: hash } })
                    res.json({ success: true })
                } else {
                    res.json({ different: true });
                }
            } else {
                res.json({ notmatch: true })
            }
        }


    } catch (error) {
        console.log(error.message);
    }
}

//forget password
const forgetPassword = async (req, res, next) => {
    try {
        res.render('mobileno')

    } catch (error) {
        next(error)
    }
}

//verify mobile data
const verifyMobile = async (req, res, next) => {
    try {
        console.log("vannnnnuuu");

        req.session.users = req.body
        console.log(req.session.users);

        const body = req.body
        const mobileNo = req.body.mobile
        if (req.body.mobile.trim() == '') {
            res.render('mobileno', { message: 'field cant be empty' })
        } else {
            const data = await userData.findOne({ userName: req.body.Username })
            console.log(data);
            console.log('mobile : ', data.mobileNumber);

            console.log("usernamsr: ", data.userName);
            if (req.body.mobile == data.mobileNumber && req.body.Username == data.userName) {

                const otpResponse = await client.verify.v2
                    .services('VAf6a17393a6187b6baeaeadc038a9b04c')
                    .verifications.create({
                        to: `+91${mobileNo}`,
                        channel: 'sms',
                    });
                res.render('otpfgconfirm')
            } else {
                res.render('mobileno', { message: 'Username and mobile number are not correct' })
            }
        }

    } catch (error) {

    }
}

const verifyfgOTP = async (req, res, next) => {
    try {
        const otp = req.body.otp
        const data = req.session.users
        const mobileNo = req.body.mobile

        const verifiedResponse = await client.verify.v2
            .services('VAf6a17393a6187b6baeaeadc038a9b04c')
            .verificationChecks.create({
                to: `+91${data.mobile}`,
                code: otp,
            })
        if (verifiedResponse.status === 'approved') {
            res.render('password')
        }
        else {
            res.render('otpfgconfirm', { message: 'wrong otp' })
        }
    } catch (error) {
        next(error)
    }
}


const password = async (req, res, next) => {
    try {
        res.render("password")
    } catch (error) {
        next(error)
    }
}

const verifypassword = async (req, res, next) => {
    try {
        const data = req.session.users
        console.log("session data", data);
        const password = req.body.Password
        const confirm = req.body.confirm
        if (req.body.Password.trim() == '' || req.body.confirm.trim() == '') {
            res.render('password', { message: 'fields can not be empty' })
        } else if (password === confirm) {
            const hash = await bcrypt.hash(password, 10)
            const update = await userData.updateOne({ userName: data.Username }, { $set: { password: hash } })
            res.redirect('/')
        } else {
            res.render('password', { message: 'password mismatch' })
        }
    } catch (error) {
        next(error)
    }
}






const brands = async (req, res, next) => {
    try {
        let page = 1;
        if (req.query.page) {
            page = req.query.page
        }
        const limit = 12
        const id = req.params.id
        const productdata = await productData.find({ brand: id, status: true }).populate('category')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec()
        const productcount = await productData.find({}).countDocuments()

        let procount = Math.ceil(productcount / limit)
        const branddata = await brandData.find({})
        const categorydata = await categoryData.find({ status: true })
        // const productdata = await productData.find({ brand: id, status: true })

        if (req.session.user) {
            const user = req.session.user
            const userdata = await userData.findOne({ _id: user._id })
            res.render('brand', {
                user: userdata,
                brand: branddata,
                productCount: procount,
                category: categorydata,
                product: productdata
            })
        } else {
            res.render('brand', {
                brand: branddata,
                productCount: procount,
                category: categorydata,
                product: productdata
            })

        }

        console.log(productdata);
    } catch (error) {
        console.log(error.message);
        res.render("404", { errorMessage: "An error occurred." });

    }
}

const priceLow = async (req, res, next) => {
    try {
        const num = parseInt(req.query.value)

        const branddata = await brandData.find({})
        const productdata = await productData.find({ status: true }).sort({ price: num })
        const categorydata = await categoryData.find({ status: true })

        if (req.session.user) {
            const user = req.session.user
            const userdata = await userData.findOne({ _id: user._id })
            res.render('allProducts', {
                Product: productdata,
                user: userdata,
                category: categorydata,
                brand: branddata
            })
        } else {
            res.render('allProducts', {
                Product: productdata,
                category: categorydata,
                brand: branddata
            })
        }

    } catch (error) {
        next(error)
        res.render("404", { errorMessage: "An error occurred." });

    }
}




const price = async (req, res, next) => {
    try {
        const low = parseInt(req.query.low)
        const high = parseInt(req.query.high)
        const categorydata = await categoryData.find({ status: true })
        const branddata = await brandData.find({})

        if (req.session.user) {
            const user = req.session.user
            const userdata = await userData.findOne({ _id: user._id })
            if (typeof req.query.high === 'undefined') {
                const productdata = await productData.find({ $and: [{ price: { $gte: low } }], status: true })
                res.render('allProducts', {
                    Product: productdata,
                    user: userdata,
                    category: categorydata,
                    brand: branddata
                })

            }
            else {
                const productdata = await productData.find({ $and: [{ price: { $gte: low } }, { price: { $lt: high } }], status: true })
                res.render('allProducts', {
                    Product: productdata,
                    user: userdata,
                    category: categorydata,
                    brand: branddata
                })
            }
        }
        else {
            if (typeof req.query.high === null) {
                const productdata = await productData.find({ $and: [{ price: { $gte: low } }], status: true })
                res.render('allProducts', {
                    Product: productdata,
                    category: categorydata,
                    brand: branddata
                })

            }
            else {
                const productdata = await productData.find({ $and: [{ price: { $gte: low } }, { price: { $lt: high } }], status: true })
                res.render('allProducts', {
                    Product: productdata,
                    category: categorydata,
                    brand: branddata
                })

            }
        }

    } catch (error) {
        next(error)
        res.render("404", { errorMessage: "An error occurred." });

    }
}




const logout = async (req, res) => {
    try {
        req.session.user = null
        res.redirect('/')
    } catch (error) {
        console.log(error.message);
    }
}




module.exports = {
    loadhomepage,
    loadLogin,
    loadSignup,
    verifySignup,
    verifyOtp,
    verifyLogin,
    productDetails,
    allProducts,
    category,
    loadProfile,
    viewAddress,
    loadaddAddress,
    addAddress,
    removeAddress,
    updateAddress,
    editProfile,
    modaldAdAddress,
    search,
    changePassword,
    forgetPassword,
    verifyMobile,
    verifyfgOTP,
    password,
    verifypassword,
    brands,
    priceLow,
    price,
    logout
}