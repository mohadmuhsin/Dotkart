const userData = require('../../models/user/userData')
const productData = require('../../models/productData')
const categoryData = require('../../models/categoryData')
const { count } = require('../../models/user/userData')


const loadCart = async (req, res) => {
    try {

        const productdata = await productData.findOne({status:true}).populate('category')
        const categorydata = await categoryData.find({})

        const user = req.session.user
        const userdata = await userData.findOne({ _id: user._id }).populate('cart.product')

        res.render('cart', { user: userdata, product: productdata, category: categorydata })
    } catch (error) {
        console.log(error.message);
    }
}


const deleteCart = async (req, res) => {
    try {
        const user = req.session.user
        const proId = req.body.productId

        const data = await userData.updateOne({ _id: user._id }, { $pull: { cart: { product: proId } } })
        if (data) {


            // res.json({ success: true })

            const cart = await userData.findOne({ _id: user._id })
            let sum = 0
            for (let i = 0; i < cart.cart.length; i++) {
                sum = sum + cart.cart[i].productTotalPrice
            }
            await userData.updateOne({ _id: user._id }, { $set: { cartTotalPrice: sum } })
            res.json({ success: true })
        }
    } catch (error) {
        console.log(error.message);
    }
}


const adjustQuantity = async (req, res, next) => {
    try {


        const user = req.session.user
        const proId = req.body.productId
        const QuantityCount = req.body.QuantityCount
        const proPrice = req.body.proPrice
        console.log(proPrice);

        const productdata = await productData.findOne({ _id: proId,status:true })
        const stock = productdata.stock
        console.log(QuantityCount+"body qty");


        const adjustQuantity = await userData.updateOne({ _id: user._id, 'cart.product': proId }, { $inc: { "cart.$.quantity": QuantityCount } })
        const quantity=await userData.findOne({ _id: user._id, 'cart.product': proId }, { _id: 0, "cart.quantity.$": 1 })
        const qty = quantity.cart[0].quantity
        const prodSinglePrice = proPrice * qty
        console.log(qty);
        console.log(prodSinglePrice);


        await userData.updateOne({ _id: user._id, 'cart.product': proId }, { $set: { 'cart.$.productTotalPrice': prodSinglePrice } })
        const cart = await userData.findOne({ _id: user._id })

        let sum = 0
        for (let i = 0; i < cart.cart.length; i++) {
            sum = sum + cart.cart[i].productTotalPrice
        }
        const update = await userData.updateOne({ _id: user._id }, { $set: { cartTotalPrice: sum } })
        res.json({ success: true, prodSinglePrice, sum })




    } catch (error) {
        next(error)
    }
}



const addAddress = async (req,res)=>{
    try {
        if (req.body.Name.trim() == '' || req.body.Housename.trim() == '' || req.body.Street.trim() == '' || req.body.District.trim() == '' || req.body.State.trim() == '' || req.body.Pincode == '' || req.body.Country.trim() == '' || req.body.Phone == '') {
            const categorydata = await categoryData.find({})
            const user = req.session.user
            const userdata = await userData.findOne({_id:user._id})
            res.render('checkout',{message:"fields are empty",user:userdata,category:categorydata})
        }else {

            const user = req.session.user
            const id = req.params.id
            console.log(id);
            console.log(req.body);
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
            console.log(data);
          
            res.redirect('/loadCheckout')
        }
    } catch (error) {
        console.log(error.message);
    }
}


module.exports = {
    loadCart,
    deleteCart,
    addAddress,
    adjustQuantity
}