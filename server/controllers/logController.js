const Log = require('../models/Log');

// @desc    Add a log
// @route   POST /api/addLog
exports.addLog = async (req, res) => {
    try {
        const { activity, status } = req.body;
        const newLog = new Log({ activity, status });
        await newLog.save();
        res.status(201).json({ message: 'Log stored successfully', data: newLog });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
