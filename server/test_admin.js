const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');
dotenv.config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        
        // Remove existing if any
        await User.deleteOne({ email: 'admin@gmail.com' });
        
        // Create fresh admin
        const admin = await User.create({
            email: 'admin@gmail.com',
            password: '123456',
            role: 'admin'
        });
        
        console.log('✅ Admin user for testing created!');
        console.log('   Email:    admin@gmail.com');
        console.log('   Password: 123456');
        console.log('   Role:     admin');
        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err.message);
        process.exit(1);
    }
};

createAdmin();
