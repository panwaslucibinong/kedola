const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const flash = require('express-flash');
const session = require('express-session');

const Home = require('./model/home');
const Users = require('./model/users');
const authenticateUser = require('./model/authMiddleware');

require('./utils/db');

const app = express();

// Middleware
app.use(expressLayouts);
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(methodOverride('_method'));
app.use(session({ secret: "secret key", resave: false, saveUninitialized: false }));
app.use(flash());

// Set EJS
app.set('view engine', 'ejs');

// Routes
app.get('/', async (req, res) => {
    try {
        const home_Data = await Home.findOne();
        res.render('home', {
            layout: 'layouts/main-layout',
            title: 'Home',
            home_Data,
            message: req.flash("message")
        });
    } catch (error) {
        console.error('Error retrieving home data:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/login', async (req, res) => {
    res.render('users/login', {
        layout: 'layouts/main-layout',
        title: 'Login',
        message: req.flash("message")
    });
});

app.post("/login", async (req, res) => {
    res.clearCookie('kode_login');
    const kodeAktivasi = req.body.kode_aktivasi;
    const user = await Users.findOne({ kode_login: kodeAktivasi });
    if (user) {
        const kamuAdalah = user.nama_pengawas
        res.cookie('kode_login', kodeAktivasi, { maxAge: 365 * 24 * 60 * 60 * 1000 });
        req.flash("message", ["success", kamuAdalah, "Login sukses"]);
        res.redirect("/");
    }
});

app.get('/logout', (req, res) => {
    res.clearCookie('kode_login');
    res.redirect('/login');
});


app.get('/laporan', authenticateUser, async (req, res) => {
    try {
        const home_Data = await Home.findOne();
        res.render('laporan/laporan', {
            layout: 'layouts/main-layout',
            title: 'Laporan',
            home_Data
        });
    } catch (error) {
        console.error('Error retrieving home data:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Handle halaman tidak ditemukan
app.use((req, res) => {
    res.status(404).render('error/404', {
        layout: 'layouts/main-layout',
        title: '404 - Not Found'
    });
});

// Start the application
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.clear();
    console.log(`Aplikasi Dijalankan di Port ${port}`);
});
