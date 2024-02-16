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
const LaporanHasilPengawasan = require('./model/laporan_hasil_pengawasan')

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
    } else {
        req.flash("message", ["error", "Belum Terdaftar Di Sistem Kami !!!", "Login gagal"]);
        res.redirect("/login");
    }
});

app.get('/lhp/add', authenticateUser, async (req, res) => {
    const kodeAktivasi = req.cookies.kode_login;
    const dataUser = await Users.findOne({ kode_login: kodeAktivasi })
    res.render('laporan/buat', {
        layout: 'layouts/main-layout',
        title: 'user',
        dataUser

    });
});

app.post('/lhp', authenticateUser, async (req, res) => {
    try {
        const kodeAktivasi = req.cookies.kode_login;
        const dataUser = await Users.findOne({ kode_login: kodeAktivasi })
        const jabatanUser = `${dataUser.jabatan} ${dataUser.no_tps} ${dataUser.desa}`
        const existingLhp = await LaporanHasilPengawasan.findOne({ pelaksana_tugas: dataUser.nama_pengawas, jabatan: jabatanUser});
        if (existingLhp) {
            // Jika laporan sudah ada, update dengan data baru
            existingLhp.field1 = req.body.field1; // Ganti field1 dengan nama field yang sesuai
            existingLhp.field2 = req.body.field2; // Ganti field2 dengan nama field yang sesuai
            // Lanjutkan dengan semua field yang perlu diupdate

            await existingLhp.save();
            req.flash("message", ["success", "Laporan", "Berhasil Diperbarui"]);
        } else {
            // Jika laporan belum ada, buat laporan baru
            const newLhp = new LaporanHasilPengawasan(req.body);
            newLhp.kode_login = kodeAktivasi; // Pastikan untuk menambahkan kode_login ke laporan baru
            await newLhp.save();
            req.flash("message", ["success", "Laporan", "Berhasil Terkirim"]);
        }

        res.redirect('/notif'); // Ubah /notif dengan URL yang sesuai
    } catch (error) {
        console.log("gagal", error);
        req.flash("message", ["error", "Laporan", "Gagal Terkirim"]);
        res.redirect('/notif'); // Ubah /notif dengan URL yang sesuai
    }
});

app.get('/notif', authenticateUser, async (req, res) => {
    try {
        res.render('notif', {
            layout: 'layouts/main-layout',
            title: 'Notif',
            message: req.flash("message")
        });
    } catch (error) {
        console.error('Error retrieving home data:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/logout', (req, res) => {
    res.clearCookie('kode_login');
    res.redirect('/login');
});

app.get('/user', authenticateUser, async (req, res) => {
    const kodeAktivasi = req.cookies.kode_login;
    const dataUser = await Users.findOne({ kode_login: kodeAktivasi });
    try {
        res.render('users/profil', {
            layout: 'layouts/main-layout',
            title: 'user',
            dataUser

        });
    } catch (error) {
        console.error('Error retrieving home data:', error);
        res.status(500).send('Internal Server Error');
    }
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
app.get('/info/:desa', authenticateUser, async (req, res) => {
    try {
        const desaku = req.params.desa.toUpperCase();
        const response = await fetch(`https://s.aawasra-bawaslu.my.id/vote/progress/CIBINONG/${desaku}`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        
        const data = await response.json();

        res.render('info', {
            layout: 'layouts/main-layout',
            title: 'info',
            data: data,
            desa: desaku
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
