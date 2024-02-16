const mongoose = require('mongoose');

const homeSchema = new mongoose.Schema({
    banner: [{
        banner_Title: String,
        banner_Link: String
    }],
    card: [{
        card_Title: String,
        card_Icon: String,
        card_Link: String
    }],
    video: [{
        link: String,
        title: String,
        deskripsi: String
    }],
    card2: [{
        card_Title: String,
        card_Icon: String,
        card_Link: String
    }],
});

const Home = mongoose.model('Home', homeSchema);
module.exports = Home;