const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register user
// @route   POST /api/auth/register
exports.registerUser = async (req, res) => {
    const { email, password, role } = req.body;
    console.log(`[AUTH] Registering: ${email} as ${role || 'user'}`);
    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const user = await User.create({ email, password, role: role || 'user' });
        if (user) {
            console.log(`[AUTH] Success: ${email} created`);
            res.status(201).json({
                _id: user.id,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            });
        }
    } catch (err) {
        console.error(`[AUTH ERROR] Registration: ${err.message}`);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    console.log(`[AUTH] Login attempt: ${email}`);
    try {
        const user = await User.findOne({ email });
        if (user && (await user.matchPassword(password))) {
            console.log(`[AUTH] Success: ${email} logged in`);
            res.json({
                _id: user._id,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            });
        } else {
            console.log(`[AUTH] Failed: Invalid credentials for ${email}`);
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (err) {
        console.error(`[AUTH ERROR] Login: ${err.message}`);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
