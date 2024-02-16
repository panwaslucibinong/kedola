const mongoose = require('mongoose');

const lhpSchema = new mongoose.Schema({
    tahapan: [{
        pengawasan: String
    }],
    bentuk: [{
        pengawasan: String,
    }],
    sasaran: [{
        pengawasan: String,
    }]
});

const LhpConfig = mongoose.model('LhpConfig', lhpSchema);
module.exports = LhpConfig;