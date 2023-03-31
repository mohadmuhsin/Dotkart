const categoryData = require('../models/categoryData');
const CategoryData = require('../models/categoryData')

// Category controller
const Category = async (req, res) => {
    try {
        const category_Data = await CategoryData.find({})
        res.render('category', { categoryDatas: category_Data })
    } catch (error) {
        console.log(error.message);

    }
}


//view add Category
const AddCategory = async (req, res) => {
    try {
        res.render('addCategory')
    } catch (error) {
        console.log(error.message);

    }
}

//add category
const newCategory = async (req, res) => {
    try {
        console.log(req.body);
        let bodyData = req.body.Category
        bodyData = bodyData.trim()
        let capData = bodyData.toUpperCase()

        let des = req.body.Description
        const allData = await CategoryData.findOne({ category: capData })
        if (allData) {
            res.render('addCategory', { message: "this category is already exist" })
        }
        else if (bodyData == "" || des == "") {

            res.render('addCategory', { message: "we can't add blank data" })
        } else {
            const Data = CategoryData({
                category: capData,
                description: des
            })
            const result = await Data.save()
            if (result) {
                console.log("category saved successfully");
                res.redirect('/admin/category')
            }
        }

    } catch (error) {
        console.log(error.message);
    }
}

//load editCategory
const editCategory = async (req, res) => {
    try {
        const id = req.params.id
        const categorydata = await CategoryData.findOne({ _id: id })
        res.render('editCategory', { categoryData: categorydata })
    } catch (error) {
        console.log(error.message);

    }
}

const updateCategory = async (req, res) => {
    try {
        // console.log(req.params.id);
        let bodyData = req.body.Category
        bodyData = bodyData.trim()
        let capData = bodyData.toUpperCase()
        let description = req.body.Description
        let id = req.params.id



        const collectedData = await CategoryData.findById({ _id: id })
        console.log(id);
        const allCategory = await CategoryData.findOne({ category: capData })

        if (!bodyData || bodyData.length === 0 || !description || description.length === 0) {
            res.render('editCategory', { message: "All Fields Are Required", categoryData: collectedData });

        } else if (collectedData.category == capData) {
            if (collectedData.description == description) {
                res.render('editCategory', { message: "No chages made", categoryData: collectedData })
            } else {
                await CategoryData.updateOne({ _id: id }, { $set: { category: capData, description: description } })
                res.redirect('/admin/category')
            }
        }
        else if (allCategory) {
            res.render('editCategory', { message: "Category is allready exist", categoryData: collectedData })
        }
        else {
            await CategoryData.updateOne({ _id: id }, { $set: { category: capData, description: description } })
        }
        res.redirect('/admin/category')
    } catch (error) {
        console.log(error.message);
    }
}

const catogoryList = async (req, res, next) => {
    try {
        const id = req.params.id
        const category = await CategoryData.findOne({ _id: id })
        if (category.status) {
            await categoryData.updateOne({ _id: id }, { $set: { status: false } })
        } else {
            await categoryData.updateOne({ _id: id }, { $set: { status: true } })
        }
        res.redirect('/admin/category')
    } catch (error) {
        next(error)
    }
}



const deleteCategory = async (req, res) => {
    try {

        let id = req.params.id
        await CategoryData.deleteOne({ _id: id })
        res.redirect('/admin/category')
    } catch (error) {
        console.log(error.message);

    }
}
module.exports = {
    Category,
    AddCategory,
    newCategory,
    editCategory,
    updateCategory,
    catogoryList,
    deleteCategory

}
