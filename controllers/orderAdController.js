const orderData = require('../models/user/orderData')


const loadorders = async (req, res) => {
    try {
        const orderdata = await orderData.find({}).sort({date:-1}).populate('product.productId').populate('userId')
        res.render('orders', { order: orderdata })
    } catch (error) {
        console.log(error.message);
    }
}


const orderDetails = async (req, res) => {
    try {
        const id = req.params.id
     
        const orderdata = await orderData.findOne({ _id:id }).populate('product.productId').populate('userId')
        res.render('orderDetails',{order:orderdata})
    } catch (error) {
        console.log(error.message);
        res.render("404", { errorMessage: "An error occurred." });

    }
}

const updateStatus = async (req,res)=>{
    try {
        const ordId = req.body.orderId
        const status = req.body.newStatus

        console.log(ordId,status);
     
        const update = await orderData.updateOne({_id:ordId},{$set:{status:status}})
        console.log(update);
        res.json({success:true})
    } catch (error) {
        console.log(error.message);
    }
}


module.exports = {
    loadorders,
    orderDetails,
    updateStatus
    
}