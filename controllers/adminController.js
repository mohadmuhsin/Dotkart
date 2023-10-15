const admin = require('../models/adminData')
const user = require('../models/user/userData')
const orderData = require('../models/user/orderData')
const userData = require('../models/user/userData')
const { date } = require('joi')
const categoryData = require('../models/categoryData')




//login page
const adminLogin = async (req, res) => {
    try {
        res.render('adminLogin')
    } catch (error) {
        console.log(error.message);

    }
}


// login verification
const verifyLogin = async (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password
        const adminData = await admin.findOne({ username: username })

        if (adminData) {
            if (password === adminData.password) {
                req.session.admin_id = adminData._id

                res.redirect('/admin/dashboard')
            } else {
                res.render('adminLogin', { message: "password is incorrect" })
            }
        } else if (username == " " && password == " ") {
            res.render('adminLogin', { message: "username and password is incorrect" })
        } else {
            res.render('adminLogin', { message: "enter a valid username" })
        }

    } catch (error) {
        console.log(error.message);

    }
}


//Dash board
const loadDashboard = async (req, res) => {
    try {
        const sales = await orderData.find({}).count()
        const customers = await userData.find({}).count()
        const online = await orderData.find({ paymentType: 'ONLINE' }).count()
        const cod = await orderData.find({ paymentType: 'COD' }).count()
        const wallet = await orderData.find({ paymentType: 'WALLET' }).count()

        const categorydata = await categoryData.find({})

        const ord = await orderData.find().populate({
            path: 'product.productId',
            populate: {
                path: 'category',
                model: categoryData
            }
        })
        const categoryCount = {};

        ord.forEach(order => {
            order.product.forEach(product => {
                const category = product.productId.category.category;
                if (category in categoryCount) {
                    categoryCount[category] += 1;
                } else {
                    categoryCount[category] = 1;
                }
            });
        });
        const sortedCategoryCount = Object.entries(categoryCount).sort((a, b) => b[1] - a[1]);

        const numbersOnly = sortedCategoryCount.map(innerArray => innerArray[1]);

        const categoryNames = sortedCategoryCount.map((categoryCount) => {
            return categoryCount[0];
        });





        console.log(numbersOnly);
        console.log(categoryNames);




        const revenueOfTheWeekly = await orderData.aggregate([
            {
                $match: {
                    date: {
                        $gte: new Date(new Date().setDate(new Date().getDate() - 7))
                    }, status: {
                        $eq: "Delivered"
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    Revenue: { $sum: "$total" }
                }
            }
        ])
        const weeklyRevenue = revenueOfTheWeekly.map((item) => {
            return item.Revenue;
        })




        const weeklySales = await orderData.aggregate([
            {
                $match: {
                    status: {
                        $eq: "Delivered",
                    }
                }
            },
            {
                $group: {
                    _id:
                        { $dateToString: { format: "%d-%m-%Y", date: "$date" } },
                    sales: { $sum: "$total" },
                }
            },
            {
                $sort: { _id: 1 }
            },
            {
                $limit: 7
            },
        ]);
        console.log(weeklySales);
        const date = weeklySales.map((item) => {
            return item._id;
        });
        const saless = weeklySales.map((item) => {
            return item.sales;
        });



        res.render('dashboard', {
            salesCount: sales,
            userCount: customers,
            revenueOfTheWeek: weeklyRevenue,
            upi: online, cash: cod, wallet: wallet,
            wsales: weeklySales,
            date: date,
            sales: saless,
            categoryName: categoryNames,
            catogorySaleCount: numbersOnly
        })




    } catch (error) {
        console.log(error.message);

    }
}



//user active checking
const userActive = async (req, res) => {
    try {
        const id = req.params.id

        const userstatus = await user.findOne({ _id: id })
        if (userstatus.status) {

            await user.updateOne({ _id: id }, { $set: { status: false } })
            req.session.user = null
        } else {
            await user.updateOne({ _id: id }, { $set: { status: true } })

        }
        res.redirect('/admin/users')

    } catch (error) {
        console.log(error.message);
    }
}




//load user
const loaduser = async (req, res) => {
    try {
        const userData = await user.find({})
        res.render('users', { userdata: userData })

    } catch (error) {
        console.log(error.message);

    }
}



//load sales
const Sales = async (req, res) => {
    try {
        res.render('sales')
    } catch (error) {
        console.log(error.message);
    }
}



// load sales report
const salesReport = async (req, res) => {
    try {

        const currentDate = new Date(req.body.to)
        const newDate = new Date(currentDate);
        newDate.setDate(currentDate.getDate() + 1)

        if (req.body.from.trim() == '' || req.body.to.trim() == '') {
            res.render('sales', { message: 'All feilds are required' })
        }
        else {
            const salesdata = await orderData.find({
                status: 'Delivered',
                date:
                    { $gte: new Date(req.body.from), $lte: new Date(newDate) }
            }).populate
                ('product.productId')

            console.log(salesdata);

            res.render('salesReport', { sales: salesdata })
        }

    } catch (error) {
        console.log(error.message);
    }
}






//logout
const adminlogout = async (req, res) => {
    try {
        req.session.admin_id = null
        res.redirect('/admin/')
    } catch (error) {
        console.log(error.message);

    }
}



module.exports = {
    adminLogin,
    verifyLogin,
    loadDashboard,
    adminlogout,
    loaduser,
    userActive,
    Sales,
    salesReport

}                    
