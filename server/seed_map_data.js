const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Threat = require('./models/Threat');

dotenv.config();

const threats = [
    {
        type: 'SQL Injection',
        severity: 'high',
        source_ip: '192.168.1.55',
        lat: 34.0522,
        lon: -118.2437,
        country: 'USA (Los Angeles)',
        status: 'active'
    },
    {
        type: 'DDoS Attack',
        severity: 'high',
        source_ip: '45.33.2.14',
        lat: 51.5074,
        lon: -0.1278,
        country: 'UK (London)',
        status: 'active'
    },
    {
        type: 'Brute Force',
        severity: 'medium',
        source_ip: '103.22.4.5',
        lat: 28.6139,
        lon: 77.2090,
        country: 'India (New Delhi)',
        status: 'active'
    },
    {
        type: 'Malware Transmission',
        severity: 'low',
        source_ip: '31.13.72.36',
        lat: -33.8688,
        lon: 151.2093,
        country: 'Australia (Sydney)',
        status: 'active'
    },
    {
        type: 'Phishing Attempt',
        severity: 'medium',
        source_ip: '8.8.8.8',
        lat: 35.6895,
        lon: 139.6917,
        country: 'Japan (Tokyo)',
        status: 'active'
    },
    {
        type: 'Unauthorized Access',
        severity: 'high',
        source_ip: '172.217.16.14',
        lat: -23.5505,
        lon: -46.6333,
        country: 'Brazil (Sao Paulo)',
        status: 'active'
    },
    {
        type: 'Session Hijacking',
        severity: 'high',
        source_ip: '185.199.108.153',
        lat: 55.7558,
        lon: 37.6173,
        country: 'Russia (Moscow)',
        status: 'active'
    }
];

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for Seeding...');

        // Optional: clear existing threats if you want a clean state
        // await Threat.deleteMany({});
        // console.log('Existing threats cleared.');

        await Threat.insertMany(threats);
        console.log(`${threats.length} Map Data Threats inserted successfully!`);

        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

seedData();
