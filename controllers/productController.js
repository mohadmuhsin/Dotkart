const productData = require('../models/productData');
const CategoryData = require('../models/categoryData');
const brandData = require('../models/brandData');
const { updateOne } = require('../models/productData');
const mongoose = require('mongoose');
const fs = require('fs')
const path = require('path')



const loadProducts = async (req, res, next) => {
    try {
        const Data = await productData.find({})
        const Datas = await productData.find({}).populate('category').populate('brand')
        res.render('products', { Productdata: Data, datas: Datas })
    } catch (error) {
        next(error);
    }
}
//to view add product
const loadAddProduct = async (req, res) => {
    try {
        const branddata = await brandData.find({})
        const category = await CategoryData.find({})
        res.render('addProduct', { brand: branddata, CategoryData: category })
    } catch (error) {
        console.log(error.message);
    }
}


// to add product
const addProduct = async (req, res, next) => {
    const catdata = req.body.Category
    console.log(catdata);

    if (req.body.Product.trim() == '' || req.body.Description.trim() == '' || req.body.Stock == '' || req.body.Price == '') {
        const branddata = await brandData.find({})
        const Category = await CategoryData.find({})

        res.render('addProduct', { CategoryData: Category, brand: branddata, message: "All fields are needed" })
    } else if (!mongoose.Types.ObjectId.isValid(req.body.Category) || !mongoose.Types.ObjectId.isValid(req.body.Brand)) {
        const Category = await CategoryData.find({})
        const branddata = await brandData.find({})

        res.render('addProduct', { CategoryData: Category, brand: branddata, message: "select a category" })
    } else {
        if (!req.files || !req.files.length) {
            const branddata = await brandData.find({})
            const Category = await CategoryData.find({})

            res.render('addProduct', { CategoryData: Category, brand: branddata, message: "Image field is required" })
        } try {

            const ProImages = [];
            for (file of req.files) {
                ProImages.push(file.filename)
            }
            const product = new productData({
                name: req.body.Product,
                price: req.body.Price,
                description: req.body.Description,
                image: ProImages,
                category: req.body.Category,
                brand: req.body.Brand,
                stock: req.body.Stock

            })
            const productdata = await product.save()
            if (productdata) {
                res.redirect('/admin/products')
            } else {
                res.render('addProduct', { messge: "action Failed" })
            }
        } catch (error) {
            next(error);
        }

    }
}


//show edit products
const editProducts = async (req, res) => {
    try {
        const id = req.params.id
        const productdata = await productData.findOne({ _id: id })
            .populate('category').populate('brand')

        const branddata = await brandData.find({})
        const category = await CategoryData.find({})

        res.render('editProduct', { productData: productdata, brand: branddata, categorydata: category })
    } catch (error) {
        console.log(error.message);
        res.render("404", { errorMessage: "An error occurred." });
        
    }
}


//update product 
const updateProduct = async (req, res) => {
    if (req.body.Product.trim() == '' || req.body.Image == '' || req.body.Category == '' || req.body.Description.trim() == '' || req.body.Stock == '' || req.body.Price == '') {
        const id = req.params.id
        const productdata = await productData.findOne({ _id: id })
            .populate('category').populate('brand')

        const branddata = await brandData.find({})
        const category = await CategoryData.find({})
        console.log(category);
        res.render('editProduct', { productData: productdata, brand: branddata, categorydata: category, message: "All fields are required" })
    } else {

        try {
            const proImages = [];
            for (file of req.files) {
                proImages.push(file.filename)
            }
            if (!proImages) {
                const id = req.params.id
                await productData.updateOne({ _id: id }, {
                    $set: {
                        name: req.body.Product,
                        image: proImages,
                        category: req.body.Category,
                        brand: req.body.Brand,
                        stock: req.body.Stock,
                        price: req.body.Price,
                        description: req.body.Description
                    }
                })
                res.redirect('/admin/products')
            } else {
                const id = req.params.id
                await productData.updateOne({ _id: id }, {
                    $set: {
                        name: req.body.Product,
                        category: req.body.Category,
                        brand: req.body.Brand,
                        stock: req.body.Stock,
                        price: req.body.Price,
                        description: req.body.Description
                    }
                })
                res.redirect('/admin/products')
            }
        } catch (error) {
            console.log(error.message);
        }
    }

}


//update image
const updateimage = async (req, res) => {
    try {
        const id = req.params.id
        const productdata = await productData.findOne({ _id: id })
        const imgLength = productdata.image.length


        if (imgLength <= 3) {
            const proImages = [];
            for (file of req.files) {
                proImages.push(file.filename)

            }
            if (imgLength + proImages.length <= 3) {
                const update = await productData.updateOne({ _id: id }, { $addToSet: { image: { $each: proImages } } })
                res.redirect('/admin/products')

            } else {
                const productdata = await productData.findOne({ _id: id }).populate('category').populate('brand')
                const category = await CategoryData.find({})
                const branddata = await brandData.find({})
                console.log(category);
                res.render('editProduct', { productData: productdata, categorydata: category, brad: branddata, warning: 'Only 3 Images Are Allowed' })
            }
        } else {
            res.redirect('/admin/products/editProduct')
        }
    } catch (error) {
        console.log(error.message);
        res.render("404", { errorMessage: "An error occurred." });

    }
}

//delete image
const deleteImage = async (req, res) => {
    try {
        const imageId = req.params.imgId
        const ProId = req.params.ProId

        fs.unlink(path.join(__dirname, "/proImages/", imageId), () => { })
        const productImage = await productData.updateOne({ _id: ProId }, { $pull: { image: imageId } })
        res.redirect('/admin/products/editProduct' + ProId)
    } catch (error) {
        console.log(error.message);
        res.render("404", { errorMessage: "An error occurred." });

    }
}


//list and unlist 
const productList = async (req,res,next)=>{
    try {
        const id = req.params.id
        const product = await productData.findOne({_id:id})
        if(product.status){
            const productdata = await productData.updateOne({_id:id},{$set:{status:false}})
        }else{
            const productdata = await productData.updateOne({_id:id},{$set:{status:true}})
        }
        res.redirect('/admin/products')
    } catch (error) {
        next(error)
    }
}

//delete product
const deleteProduct = async (req, res) => {
    try {
        const id = req.params.id
        await productData.deleteOne({ _id: id })
        res.redirect('/admin/products')

    } catch (error) {
        console.log(error.message);
    }
}


const loadProdutdetail = async (req, res) => {
    try {

        const id = req.params.id
        const allProduct = await productData.findOne({ _id: id }).populate('category').populate('brand')
        const categorydata = await CategoryData.find({})
        const branddata = await brandData.find({})

        const user = req.session.user
        res.render('viewproduct', { product: allProduct, category: categorydata, brand: branddata })
    } catch (error) {
        console.log(error.message);
        res.render("404", { errorMessage: "An error occurred." });

    }
}

module.exports = {
    loadProducts,
    loadAddProduct,
    addProduct,
    deleteProduct,
    editProducts,
    updateProduct,
    updateimage,
    productList,
    loadProdutdetail,
    deleteImage
} 