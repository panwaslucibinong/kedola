const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override')
const fs = require('fs');
const path = require('path');

require('./utils/db')
const Home = require('./model/home')

const app = express();
app.use(methodOverride('_method'))

//set EJS
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.use(express.static('public'))
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());


app.get('/', async (req, res) => {
    const home_Data = await Home.findOne()
    res.render('home', {
        layout: 'layouts/main-layout',
        title: 'Home',
        home_Data
    });
});

app.get('/laporan', async (req, res) => {
    const home_Data = await Home.findOne()
    res.render('laporan/laporan', {
        layout: 'layouts/main-layout',
        title: 'Laporan',
        home_Data
    });
});

app.listen(process.env.PORT || 3000, () => {
    console.clear();
    console.log("Aplikasi Dijalankan");
});