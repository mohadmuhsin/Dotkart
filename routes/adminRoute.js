const express = require('express')
const adminRoute = express()


//for session
const auth = require('../middleware/auth')

//set up the view engines
adminRoute.set('view engine', 'ejs')
adminRoute.set('views', 'views/admin')

// body-parser 
const bodyparser = require('body-parser')
adminRoute.use(bodyparser.json());
adminRoute.use(bodyparser.urlencoded({ extended: true }))




// connecting admin controller
const adminController = require('../controllers/adminController')
const categoryController = require('../controllers/categoryController')
const productController = require('../controllers/productController')
const bannerController = require('../controllers/bannerController')
const orderAdController = require ('../controllers/orderAdController')
const couponController = require ('../controllers/couponController')
const brandController = require('../controllers/brandController')

//multer
const upload = require('../middleware/multer')


const nocache = require('nocache');




//admin routes  GET
adminRoute.get('/', auth.isLogout, adminController.adminLogin)
adminRoute.get("/dashboard", auth.isLogin, adminController.loadDashboard)
adminRoute.get('/users', auth.isLogin, adminController.loaduser)
adminRoute.get('/logout', auth.isLogin, adminController.adminlogout)

//admin routes  POST
adminRoute.post('/',auth.isLogout, adminController.verifyLogin)

//order 
adminRoute.get('/orders',auth.isLogin,orderAdController.loadorders)
adminRoute.get('/orderDetails/:id/:name',auth.isLogin,orderAdController.orderDetails)
adminRoute.post('/updateStatus',auth.isLogin,orderAdController.updateStatus)//status change



//category routes GET
adminRoute.get('/category', auth.isLogin, categoryController.Category)
adminRoute.get('/addCategory', auth.isLogin, categoryController.AddCategory)
adminRoute.get('/category/editCategory/:id', auth.isLogin, categoryController.editCategory)
adminRoute.get('/category/:id', auth.isLogin, categoryController.deleteCategory)
adminRoute.get('/catogoryList/:id',auth.isLogin,categoryController.catogoryList)



//category routes POST
adminRoute.post('/addCategory', auth.isLogin,categoryController.newCategory)
adminRoute.post('/category/editCategory/:id',auth.isLogin, categoryController.updateCategory)




//Products routes GET
adminRoute.get('/products', auth.isLogin, productController.loadProducts)
adminRoute.get('/addProduct', auth.isLogin, productController.loadAddProduct)
adminRoute.get('/products/:id', auth.isLogin, productController.deleteProduct)
adminRoute.get('/products/editProduct/:id', auth.isLogin, productController.editProducts)
adminRoute.get('/useractive/:id', auth.isLogin,adminController.userActive)
adminRoute.get('/viewProdutdetail:id',auth.isLogin, productController.loadProdutdetail)
adminRoute.get('/deleteimg/:imgId/:ProId',auth.isLogin,productController.deleteImage)
adminRoute.get('/productList/:id',auth.isLogin,productController.productList)

//Products routes POST
adminRoute.post('/products/editProduct/:id',auth.isLogin, upload.array('Image'), productController.updateProduct)
adminRoute.post('/products', auth.isLogin, productController.loadProducts)
adminRoute.post('/addProduct', auth.isLogin,upload.array('Image'), auth.isLogin, productController.addProduct)
adminRoute.post('/updateimage/:id',auth.isLogin,upload.array('Image'),productController.updateimage)



//sales
adminRoute.get('/sales',auth.isLogin, adminController.Sales)
adminRoute.post('/sales',auth.isLogin,adminController.salesReport )


//banner get
adminRoute.get('/banners', auth.isLogin, bannerController.loadBanner)
adminRoute.get('/addbanner',auth.isLogin,bannerController.loadaddBanner)
adminRoute.get('/editBanner/:id',auth.isLogin,bannerController.loadeditBanner)
adminRoute.get('/deleteBanner/:id',auth.isLogin,bannerController.deleteBanner)
//banner post 
adminRoute.post('/addbanner',auth.isLogin,upload.single('image'),bannerController.newBanner)
adminRoute.post('/editBanner/:id',auth.isLogin,bannerController.editBanner)



//coupon get
adminRoute.get('/loadCoupon',auth.isLogin,couponController.loadCoupon)
adminRoute.get('/addCoupon',auth.isLogin,couponController.addCoupon)
adminRoute.get('/products/editCoupon/:id',auth.isLogin,couponController.loadEditCoupon)
adminRoute.get('/deleteCoupon/:id',auth.isLogin,couponController.deleteCoupon)


adminRoute.post('/products/editCoupon/:id',auth.isLogin,couponController.editCoupon)
adminRoute.post('/addCoupon',auth.isLogin,couponController.newCoupon)

//brand get
adminRoute.get('/brand',auth.isLogin,brandController.loadBrand)
adminRoute.get('/addBrand',auth.isLogin,brandController.loadAddBrand)
adminRoute.get('/editBrand/:id',auth.isLogin,brandController.loadEditBrand)
adminRoute.get('/list/:id',auth.isLogin,brandController.listBrand)
//brand Post
adminRoute.post('/addBrand',upload.single('Image'),auth.isLogin,brandController.addBrand)
adminRoute.post('/editBrand/:id',upload.single('Image'),auth.isLogin,brandController.editBrand)


//404 page
adminRoute.use((req, res, next) => {
    res.render('404')
})




module.exports = adminRoute;