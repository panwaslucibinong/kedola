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

const generatePhoneNumber = () => {
    const operators = [
        '0811', '0812', '0813', '0821', '0822', '0823', '0851', '0852', '0853',
        '0814', '0815', '0816', '0855', '0856', '0857', '0858',
        '0831', '0832', '0833', '0838',
        '0881', '0882', '0883', '0884', '0885', '0886', '0887', '0888', '0889'
    ];
    const prefix = operators[Math.floor(Math.random() * operators.length)];
    const phoneNumber = prefix + Math.floor(100000000000 + Math.random() * 900000000000).toString().substring(1);
    return phoneNumber;
};

app.get('/generate', (req, res) => {
    const generatedNumbers = [];
    for (let i = 0; i < 5; i++) {
        generatedNumbers.push(generatePhoneNumber());
    }
    res.json({ nomorHp: generatedNumbers });
});

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
    } else {
        req.flash("message", ["error", "Belum Terdaftar Di Sistem Kami !!!", "Login gagal"]);
        res.redirect("/login");
    }
});

app.get('/logout', (req, res) => {
    res.clearCookie('kode_login');
    res.redirect('/login');
});

app.get('/absen', authenticateUser, async (req, res) => {
    try {
        res.render('mt', {
            layout: 'layouts/main-layout',
            title: 'absen'
        });
    } catch (error) {
        console.error('Error retrieving home data:', error);
        res.status(500).send('Internal Server Error');
    }
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

app.get('/info', authenticateUser, async (req, res) => {
    try {
        res.render('mt', {
            layout: 'layouts/main-layout',
            title: 'info'
        });
    } catch (error) {
        console.error('Error retrieving home data:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/user', authenticateUser, async (req, res) => {
    try {
        res.render('mt', {
            layout: 'layouts/main-layout',
            title: 'user'
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
