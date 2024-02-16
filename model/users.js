const mongoose = require('mongoose');
const Users = mongoose.model('Users', {
    nama_pengawas: {
        type: String,
        required: true
    },
    jabatan: {
        type: String,
        required: true
    },
    no_tps: {
        type: String,
        required: true
    },
    desa: {
        type: String,
        required: true
    },
    kecamatan: {
        type: String,
        required: true
    },
    nomor_hp: {
        type: String,
        required: true
    },
    kode_login: {
        type: String,
        required: true
    }
});

module.exports = Users;