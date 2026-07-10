const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    activity: { type: String, required: true },
    status: { type: String, required: true },
    time: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Log', logSchema);
