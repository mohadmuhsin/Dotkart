const couponData = require('../models/couponData')
const loadCoupon = async (req, res) => {
    try {
        const coupondata = await couponData.find({})
        res.render('coupons', { coupon: coupondata })

    } catch (error) {
        console.log(error.message);
    }
}


const addCoupon = async (req, res) => {
    try {
        res.render('addCoupon')
    } catch (error) {
        console.log(error.message);
    }
}


const newCoupon = async (req, res) => {
    try {
        let code = req.body.code
        code = code.trim()
        couponCode = code.toUpperCase()
        const discount = req.body.maxDiscount
        const expiry = new Date(req.body.expiryDate);
        const minAmount = req.body.minAmount
        const percentage = req.body.percentage

        const data = await couponData.findOne({ code: couponCode })
        if (data) {
            res.render('addCoupon', { message: "coupon is already exist!!" })
        } else if (couponCode == '' || percentage.trim() == '') {
            res.render('addCoupon', { message: 'fields are empty!!' })
        } else if (percentage > 100 || percentage < 0) {
            res.render('addCoupon', { message: 'percentage should be between 0 to 10!!!' })

        } else if (expiry.getTime() <= Date.now()) {
            res.render('addCoupon', { message: 'Date should be valid' })
        }
        else {
            const copdata = new couponData({
                code: couponCode,
                maxDiscount: discount,
                expirydate: expiry,
                minPurchaseAmount: minAmount,
                percentage: percentage

            })
            const data = await copdata.save()
            if (data) {
                res.redirect('/admin/loadCoupon')
            }
        }
    } catch (error) {
        console.log(error.message);
    }
}




const applycoupon = async (req, res) => {
    try {

        const { total, code } = req.body
        console.log(total, code);
        const Code = code.toUpperCase()
        let user = req.session.user._id
        const data = await couponData.findOne({ code: Code })
        const Codee = data.code
        if (data) {
            console.log("check1");
            const used = await couponData.findOne({ code: Code, userUsed: { $in: [user] } })
            console.log(used);
            if (used) {
                console.log("check2");
                res.json({ used: true })
            } else {
                console.log("check3");
                const today = Date.now()
                if (today <= data.expirydate) {
                    console.log("check4");
                    if (data.minPurchaseAmount <= total) {
                        console.log("check5");
                        let discountValue = total * data.percentage / 100
                        if (discountValue <= data.maxDiscount) {
                            console.log("check6");
                            let discount = discountValue
                            let cost = total - discount
                            res.json({ available: true, discount, cost, Codee })
                        } else {
                            console.log("check7");
                            let discount = data.maxDiscount
                            let cost = (total - data.maxDiscount)
                            res.json({ available: true, discount, cost, Codee })
                        }
                    } else {
                        console.log("check8");
                        res.json({ notAvailable: true })
                    }
                } else {
                    console.log("check9");
                    res.json({ expired: true })
                }
            }
        } else {
            console.log("check10");
            res.json({ invalid: true })
        }
    } catch (error) {
        console.log(error.message);
    }
}


const loadEditCoupon = async (req, res, next) => {
    try {
        const id = req.params.id

        const coupondata = await couponData.findOne({ _id: id })
        res.render('editCoupon', { coupon: coupondata })
    } catch (error) {
        next(error)
    }
}


const editCoupon = async (req, res) => {
    try {

        let code = req.body.code
        code = code.trim()
        couponCode = code.toUpperCase()
        const discount = req.body.maxDiscount
        const expiry = new Date(req.body.expiryDate);
        const minAmount = req.body.minAmount
        const percentage = req.body.percentage

        const id = req.params.id

        const coupondata = await couponData.findOne({ _id: id })
        if (coupondata) {
            if (couponCode == '' || percentage.trim() == '') {
                res.render('editCoupon', { coupon: coupondata, message: 'fields are empty!!' })
            } else if (percentage > 10 || percentage < 0) {
                res.render('editCoupon', { coupon: coupondata, message: 'percentage should be between 0 to 10!!!' })

            } else if (expiry.getTime() <= Date.now()) {
                res.render('editCoupon', { coupon: coupondata, message: 'Date should be valid' })
            }
            else {
                const update = await couponData.updateOne({ _id: id },
                    {
                        $set:
                        {
                            code: couponCode,
                            maxDiscount: discount,
                            expirydate: expiry,
                            minPurchaseAmount: minAmount,
                            percentage: percentage
                        }
                    })
                res.redirect('/admin/loadCoupon')

            }
        }
    } catch (error) {
        console.log(error.message);
    }
}

const deleteCoupon = async (req, res) => {
    try {
        const id = req.params.id
        await couponData.deleteOne({ _id: id })

        res.redirect('/admin/loadCoupon')
    } catch (error) {
        console.log(error.message);
    }
}


module.exports = {
    loadCoupon,
    addCoupon,
    newCoupon,
    applycoupon,
    deleteCoupon,
    editCoupon,
    loadEditCoupon
}