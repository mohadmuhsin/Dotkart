const bannerData = require('../models/bannerData')



const loadBanner = async (req, res) => {
    try {
        const bannerdata = await bannerData.find()
        res.render('banners', { banner: bannerdata })

    } catch (error) {
        console.log(error.message);
    }
}


const loadaddBanner = async (req, res) => {
    try {
        res.render('addBanner')
    } catch (error) {
        console.log(error.message);
    }
}
// else if (!req.files || !req.files.length) {
//     res.render('addbanner', { message: ' image feild can,t be empty' })


// }

const newBanner = async (req, res, next) => {

    try {
        if (req.body.Name.trim() == '' || req.body.Description.trim() == '') {
            res.render('addbanner', { message: 'feilds can,t be empty' })
        } else {



            let Banner = req.body.Name;
            let img = req.file.filename;
            let des = req.body.Description;



            const banner = new bannerData({ name: Banner, image: img, description: des });
            const insert = await banner.save();
            if (insert) {
                res.redirect('/admin/banners'); // Correct the spelling of "redirect"
            } else {
                res.render('addbanner'); // Capitalize "B" in "Banners"
            }
        }
    } catch (error) {
        next(error);
    }
}


const loadeditBanner = async (req, res, next) => {
    try {
        const id = req.params.id
        const bannerdata = await bannerData.findOne({ _id: id })
        res.render('editBanner', { banner: bannerdata })

    } catch (error) {
        next(error)
    }
}


const editBanner = async (req, res, next) => {
    try {
        const id = req.params.id


        const update = await bannerData.updateOne({ _id: id },
            {
                $set: {
                    name: req.body.Name,
                    image: req.file.filename,
                    description: req.body.Description
                }
            })
        const bannerdata = await bannerData.find({})

        res.render('banners', { banner: bannerdata })

    } catch (error) {
        console.log(error.message);
        next(error)
    }
}


const deleteBanner = async (req, res, next) => {
    try {
        const id = req.params.id
        const deleted = await bannerData.deleteOne({_id:id}) 
        res.redirect('/admin/banners')

    } catch (error) {
        next(error)
    }
}






module.exports = {
    loadBanner,
    newBanner,
    loadaddBanner,
    loadeditBanner,
    editBanner,
    deleteBanner
}