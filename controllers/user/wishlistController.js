const userData = require('../../models/user/userData')
const productData = require('../../models/productData')
const categoryData = require('../../models/categoryData')



//******************************** */
const loadwishlist = async (req, res) => {
    try {
        const productdata = await productData.findOne({status:true}).populate('category')
        const categorydata = await categoryData.find({})

        const user = req.session.user
        const userdata = await userData.findOne({ _id: user._id }).populate('wishlist.product')
        res.render('wishlist', { user: userdata, category: categorydata, product: productdata })

    } catch (error) {
        console.log(error.message);
    }
}

//******************************** */
const addWishlist = async (req, res) => {
    try {

        if (req.session.user) {

            const user = req.session.user
            const proId = req.body.productId
            const data = await userData.findOne({ _id: user._id, 'wishlist.product': proId })

            if (data) {
                res.json({ success: false })
            } else {
                const insert = await userData.updateOne({ _id: user._id }, { $push: { wishlist: { product: proId } } })
                if (insert) {
                    res.json({ success: true })
                }
            }
        } else {
            res.render('login', { message: 'please login to your account' })
        }
    } catch (error) {
        console.log(error.message);
        

    }
}







//******************************** */
const deleteWishlist = async (req, res) => {
    try {
        const user = req.session.user
        const proId = req.body.productId
        const data = await userData.updateOne({ _id: user._id }, { $pull: { wishlist: { product: proId } } })
        if (data) {
            res.json({ success: true })
        }
    } catch (error) {
        console.log(error.message);
    }
}



//******************************** */
const addTocart = async (req, res) => {

    try {
        const user = req.session.user
        const proId = req.body.productId
        const price = req.body.productPrice

        const data = await userData.findOne({ _id: user._id, 'cart.product': proId })
        if (data) {
            res.json({ success: false })
        } else {

            const insert = await userData.updateOne({ _id: user._id }, { $push: { cart: { product: proId, quantity: 1, productTotalPrice: price } } })
            if (insert) {
                const deleted = await userData.updateOne({ _id: user._id }, { $pull: { wishlist: { product: proId } } })
                if (deleted) {
                    res.json({ success: true })
                    const cart = await userData.findOne({ _id: user._id })
                    let sum = 0
                    for (let i = 0; i < cart.cart.length; i++) {
                        sum = sum + cart.cart[i].productTotalPrice
                    }
                    await userData.updateOne({ _id: user._id }, { $set: { cartTotalPrice: sum } })
                    res.json({ success: true, sum })


                }
            }
        }
    } catch (error) {
        console.log(error.message);
        res.render("errorPage", { errorMessage: "An error occurred." });
    }
}


module.exports = {
    loadwishlist,
    addWishlist,
    deleteWishlist,
    addTocart
}