const mongoose = require('mongoose');

// Buat skema untuk Laporan Hasil Pengawasan
const lhpSchema = new mongoose.Schema({
    no_lhp: {
        type: String,
        required: true,
    },
    tahapan: {
        type: String,
        required: true,
    },
    pelaksana_tugas: {
        type: String,
        required: true,
    },
    jabatan: {
        type: String,
        required: true,
    },
    no_surat: {
        type: String,
        required: true,
    },
    alamat: {
        type: String,
        required: true,
    },
    bentuk_pengawasan: {
        type: String,
        required: true,
    },
    tujuan_pengawasan: {
        type: String,
        required: true,
    },
    sasaran_pengawasan: {
        type: String,
        required: true,
    },
    waktu_pengawasan: {
        type: String,
        required: true,
    },
    uraian_pengawasan: {
        type: String,
        required: true,
    },
    waktu_dibuat: {
        type: String,
        required: true,
    },
    dokumentasi_foto: {
        type: String,
        required: true,
    },
});

// Buat model dari skema di atas
const LaporanHasilPengawasan = mongoose.model('lhp', lhpSchema);

module.exports = LaporanHasilPengawasan;
