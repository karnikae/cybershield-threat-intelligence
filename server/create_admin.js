const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');
dotenv.config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        
        // Remove existing admin if any
        await User.deleteOne({ email: 'admin@cybershield.com' });
        
        // Create fresh admin
        const admin = await User.create({
            email: 'admin@cybershield.com',
            password: 'Admin@1234',
            role: 'admin'
        });
        
        console.log('✅ Admin account created!');
        console.log('   Email:    admin@cybershield.com');
        console.log('   Password: Admin@1234');
        console.log('   Role:     admin');
        console.log('\n⚠️  Login with these credentials to access the full Admin dashboard.');
        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err.message);
        process.exit(1);
    }
};

createAdmin();
