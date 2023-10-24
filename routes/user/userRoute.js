const express = require('express')
const userRoute = express()

//middleware
const auth = require('../../middleware/userauth')


//view engine
userRoute.set('view engine', 'ejs')
userRoute.set('views', 'views/user')


//controllers
const userController = require('../../controllers/user/userController')
const wishlistController = require('../../controllers/user/wishlistController')
const cartController = require('../../controllers/user/cartController')
const orderController = require('../../controllers/user/orderController')
const couponController = require('../../controllers/couponController')
const brandController = require('../../controllers/brandController')


//bodyParser
const bodyparser = require('body-parser')
const { isLogin } = require('../../middleware/auth')
userRoute.use(bodyparser.json());
userRoute.use(bodyparser.urlencoded({ extended: true }))


//normal get
userRoute.get('/', userController.loadhomepage)
userRoute.get('/login', auth.isLogout, userController.loadLogin)
userRoute.get('/signup', auth.isLogout, userController.loadSignup)
userRoute.get('/logout', auth.isLogin, userController.logout)
userRoute.get('/productDetails/:id', userController.productDetails)
userRoute.get('/allProducts', userController.allProducts)
userRoute.get('/category/:id', userController.category)
userRoute.get('/profile', auth.isLogin, userController.loadProfile)
userRoute.get('/viewAddress', auth.isLogin, userController.viewAddress)
userRoute.get('/addAddress', auth.isLogin, userController.loadaddAddress)






//wishlist get
userRoute.get('/wishlist', auth.isLogin, wishlistController.loadwishlist)


//cart get
userRoute.get('/cart', auth.isLogin, cartController.loadCart)

//normal post
userRoute.post('/login', auth.isLogout, userController.verifyLogin)
userRoute.post('/signup', userController.verifySignup)
userRoute.post('/verifyotp', userController.verifyOtp)
userRoute.post('/addAddress', auth.isLogin, userController.addAddress)
userRoute.post('/removeAddress', auth.isLogin, userController.removeAddress)
userRoute.post('/viewAddress/:id', auth.isLogin, userController.updateAddress)
userRoute.post('/editProfile/:id', auth.isLogin, userController.editProfile)
userRoute.post('/modaldAdAddress', auth.isLogin, userController.modaldAdAddress)


userRoute.get('/loadCheckout', auth.isLogin, orderController.loadCheckout)

userRoute.get('/vieworders', auth.isLogin, orderController.vieworders)
userRoute.get('/orderDetails/:id', auth.isLogin, orderController.orderDetails)

// check out



userRoute.post('/placeOreder', auth.isLogin, orderController.loadOrderSuccess)
userRoute.get('/ordersuccess', auth.isLogin, orderController.ordersuccess)
userRoute.post('/cancellOrder', auth.isLogin, orderController.cancellOrder)
userRoute.post('/returnOrder', auth.isLogin, orderController.returnOrder)

//payment verification  returnOrder
userRoute.post('/verifPpayment', auth.isLogin, orderController.verifPpayment)


//wishlist post
userRoute.post('/addToWishlist', auth.isLogin, wishlistController.addWishlist)
userRoute.post('/deleteWishlist', auth.isLogin, wishlistController.deleteWishlist)

//cart post
userRoute.post('/addTocart', auth.isLogin, wishlistController.addTocart)
userRoute.post('/adjustQuantity', auth.isLogin, cartController.adjustQuantity)
userRoute.post('/deleteCart', auth.isLogin, cartController.deleteCart)
userRoute.post('/applycoupon', auth.isLogin, couponController.applycoupon)
userRoute.post('/addAddress/:id', auth.isLogin, cartController.addAddress)

userRoute.get('/search', userController.allProducts)
userRoute.post('/search', userController.search)



//password get
userRoute.post('/changePassword', auth.isLogin, userController.changePassword)
userRoute.get('/forgetPassword', userController.forgetPassword)
userRoute.get('/password', userController.password)


//password post
userRoute.post('/forgetPassword', userController.verifyMobile)
userRoute.post('/verifyfgOTP', userController.verifyfgOTP)
userRoute.post('/verifypassword', userController.verifypassword)


// brand
userRoute.get('/brands/:id', userController.brands)
userRoute.get('/priceLow', userController.priceLow)
userRoute.get('/price', userController.price)

//404 page
userRoute.use((req, res, next) => {
    res.render('404')
})







module.exports = userRoute;
