const mongoose = require('mongoose')

const bannerSchema = new mongoose.Schema({
    image:
    {
        type: String,
        required: true
    },
    bannername: {
        type: String,
        required: true
    },
    path:{
        type: String,
        required: true
    },
    showBanner: {
        type: Boolean,
        required: true
    }
})
module.exports = mongoose.model('Banners', bannerSchema)