const mongoose = require('mongoose');
const Threat = require('./models/Threat');
const dotenv = require('dotenv');

dotenv.config();

const addData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const newThreat = new Threat({
            type: "DDoS",
            severity: "high",
            source_ip: "192.168.1.1"
        });
        await newThreat.save();
        console.log('Threat added successfully!');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

addData();
