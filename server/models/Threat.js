const mongoose = require('mongoose');

const threatSchema = new mongoose.Schema({
    type: { type: String, required: true },
    severity: { type: String, enum: ['low', 'medium', 'high'], required: true },
    source_ip: { type: String, required: true },
    lat: { type: Number },
    lon: { type: Number },
    country: { type: String },
    status: { type: String, enum: ['active', 'resolved'], default: 'active' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Threat', threatSchema);
