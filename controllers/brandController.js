const brandData = require('../models/brandData')
// const fs = require ('fs')
// const path = require ('path')


const loadBrand = async (req, res) => {
    try {
        const branddata = await brandData.find({})
        res.render('brand', { brand: branddata })
    } catch (error) {
        console.log(error.message);
    }
}

const loadAddBrand = async (req, res, next) => {
    try {
        res.render('addBrand')
    } catch (error) {
        console.log(error.message);
    }
}



const addBrand = async (req, res, next) => {
    try {

        const name = req.body.Brand.trim()
        const brand = name.toUpperCase()
        const branddata = await brandData.findOne({ brand: brand })
        if (req.body.Brand.trim() == '' || req.body.Description.trim() == '') {
            res.render('addBrand', { message: `fields can't be empty` });
        }
        else if (req.file?.filename == undefined) {
            res.render('addBrand', { message: `image is required` })

        }
        else if (branddata) {
            res.render('addBrand', { message: 'Brand allready exist' })
        } else {
            const image = []


            const insert = new brandData({
                brand: brand,
                image: req.file.filename,
                description: req.body.Description

            })
            const bannerdata = await insert.save()
            if (bannerdata) {
                res.redirect('/admin/brand')
            } else {
                res.render('brand')
            }
        }
    } catch (error) {
        console.log(error.message);
    }
}


const loadEditBrand = async (req, res, next) => {
    try {
        const id = req.params.id
        const branddata = await brandData.findOne({ _id: id })

        res.render('editBrand', { brand: branddata })
    } catch (error) {
        console.log(error.message);
        next(error)
    }
}

const editBrand = async (req, res, next) => {
    try {
        console.log(req.body);
        const id = req.params.id
       

        const update = await brandData.updateOne({ _id: id },
            {
                $set: {
                    brand:  req.body.Brand,
                    image: req.file.filename,
                    description: req.res.Description
                }
            })
        if (update) {
            res.redirect('/admin/loadBrand')
        }
    
    } catch (error) {
    console.log(error.message);
}
}


const listBrand = async (req, res, next) => {
    try {
        const id = req.params.id
        const branddata = await brandData.findOne({ _id: id })
        if (branddata.status) {
            await brandData.updateOne({ _id: id },
                { $set: { status: false } })
        } else {
            await brandData.updateOne({ _id: id },
                { $set: { status: true } })
        }
        res.redirect('/admin/brand')

    } catch (error) {
        console.log(error.message);
    }
}



module.exports = {
    loadBrand,
    loadAddBrand,
    addBrand,
    loadEditBrand,
    editBrand,
    listBrand
}