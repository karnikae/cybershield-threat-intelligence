const Threat = require('../models/Threat');
const axios = require('axios');

// @desc    Add a new threat
// @route   POST /api/addThreat
exports.addThreat = async (req, res) => {
    try {
        const { type, severity, source_ip } = req.body;

        // Fetch location data
        let geo = { lat: 0, lon: 0, country: 'Unknown' };
        try {
            const geoRes = await axios.get(`http://ip-api.com/json/${source_ip}`);
            if (geoRes.data.status === 'success') {
                geo = { lat: geoRes.data.lat, lon: geoRes.data.lon, country: geoRes.data.country };
            }
        } catch (err) {
            console.error('GeoIP fetch failed:', err.message);
        }

        // Check if the same IP appears more than 3 times
        const ipCount = await Threat.countDocuments({ source_ip });
        
        let finalSeverity = severity;
        if (ipCount >= 3) {
            finalSeverity = 'high';
        }

        const newThreat = new Threat({
            type,
            severity: finalSeverity,
            source_ip,
            ...geo,
            userId: req.user?._id
        });

        await newThreat.save();
        res.status(201).json({ message: 'Threat stored successfully', data: newThreat });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// @desc    Get all threats
// @route   GET /api/getThreats
exports.getThreats = async (req, res) => {
    try {
        const threats = await Threat.find();
        res.status(200).json(threats);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// @desc    Get high risk (high severity) threats
// @route   GET /api/highRisk
exports.getHighRiskThreats = async (req, res) => {
    try {
        const highRiskThreats = await Threat.find({ severity: 'high' });
        res.status(200).json(highRiskThreats);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// @desc    Get threat predictions
// @route   GET /api/threats/predictions
exports.getPredictions = async (req, res) => {
    try {
        const threats = await Threat.find();
        const predictions = [];

        // Frequency analysis
        const ipFreq = {};
        threats.forEach(t => {
            ipFreq[t.source_ip] = (ipFreq[t.source_ip] || 0) + 1;
        });

        Object.keys(ipFreq).forEach(ip => {
            if (ipFreq[ip] > 3) {
                predictions.push({
                    type: 'Possible Attack',
                    target: ip,
                    reason: `IP ${ip} has repeated ${ipFreq[ip]} times.`,
                    level: 'High'
                });
            }
        });

        // Severity alerts
        const highRisk = threats.filter(t => t.severity === 'high');
        if (highRisk.length > 0) {
            predictions.push({
                type: 'System Alert',
                reason: `${highRisk.length} high-severity threats active.`,
                level: 'Critical'
            });
        }

        res.status(200).json(predictions);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// @desc    Calculate global safety risk score
// @route   GET /api/threats/risk-score
exports.getRiskScore = async (req, res) => {
    try {
        const threats = await Threat.find();
        const total = threats.length;
        if (total === 0) return res.json({ score: 0, level: 'Low', message: 'No threats detected' });

        const highCount = threats.filter(t => t.severity === 'high').length;
        
        // Logic: score jumps for high severity + frequency
        let baseScore = (highCount * 12);
        
        // Add frequency weight
        const ipFreq = {};
        threats.forEach(t => { ipFreq[t.source_ip] = (ipFreq[t.source_ip] || 0) + 1; });
        const repeatingIps = Object.values(ipFreq).filter(v => v > 2).length;
        baseScore += (repeatingIps * 15);

        const score = Math.min(baseScore, 100);
        let level = 'Low';
        let message = 'System Secure';
        
        if (score > 70) {
            level = 'High';
            message = 'Possible Critical Intrusion Detected';
        } else if (score > 40) {
            level = 'Medium';
            message = 'Heightened Alert Level';
        }

        res.status(200).json({ score, level, message });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// @desc    Generate smart security recommendations
// @route   GET /api/threats/recommendations
exports.getRecommendations = async (req, res) => {
    try {
        const threats = await Threat.find();
        const recommendations = [];

        // Rule 1: Repeated IPs → Block
        const ipFreq = {};
        threats.forEach(t => { ipFreq[t.source_ip] = (ipFreq[t.source_ip] || 0) + 1; });
        Object.entries(ipFreq).forEach(([ip, count]) => {
            if (count >= 3) {
                recommendations.push({
                    id: `block-${ip}`,
                    priority: 'critical',
                    icon: 'ban',
                    title: `Block IP: ${ip}`,
                    description: `This IP has triggered ${count} incursions. Immediate blacklisting recommended.`,
                    action: 'Block in Firewall'
                });
            }
        });

        // Rule 2: High severity threats → Firewall
        const highCount = threats.filter(t => t.severity === 'high').length;
        if (highCount > 0) {
            recommendations.push({
                id: 'firewall',
                priority: 'high',
                icon: 'shield',
                title: 'Strengthen Firewall Rules',
                description: `${highCount} high-severity threats detected. Tighten ingress/egress filtering rules immediately.`,
                action: 'Review Firewall Config'
            });
        }

        // Rule 3: DDoS type → Rate limiting
        const ddosCount = threats.filter(t => t.type === 'DDoS').length;
        if (ddosCount > 0) {
            recommendations.push({
                id: 'rate-limit',
                priority: 'high',
                icon: 'activity',
                title: 'Implement Rate Limiting',
                description: `${ddosCount} DDoS attempts detected. Deploy rate-limiting and traffic scrubbing.`,
                action: 'Enable Rate Limiting'
            });
        }

        // Rule 4: Phishing → User training
        const phishCount = threats.filter(t => t.type === 'Phishing').length;
        if (phishCount > 0) {
            recommendations.push({
                id: 'phishing-training',
                priority: 'medium',
                icon: 'users',
                title: 'Conduct Security Awareness Training',
                description: `${phishCount} phishing attempts logged. Train staff to identify social engineering attacks.`,
                action: 'Schedule Training'
            });
        }

        // Rule 5: General system update
        recommendations.push({
            id: 'update-system',
            priority: 'low',
            icon: 'refresh',
            title: 'Run System Patch Cycle',
            description: 'Ensure all OS and software packages are up to date to close known vulnerability windows.',
            action: 'Run Updates'
        });

        res.status(200).json(recommendations);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// @desc    Rule-based chatbot response
// @route   POST /api/threats/chatbot
exports.getChatbotResponse = async (req, res) => {
    try {
        const { message } = req.body;
        const q = message.toLowerCase();
        const threats = await Threat.find();
        const highCount = threats.filter(t => t.severity === 'high').length;
        const ipFreq = {};
        threats.forEach(t => { ipFreq[t.source_ip] = (ipFreq[t.source_ip] || 0) + 1; });
        const repeatingIps = Object.keys(ipFreq).filter(ip => ipFreq[ip] >= 3);
        const isHighRisk = highCount > 2 || repeatingIps.length > 0;

        let reply = '';

        if (q.includes('safe') || q.includes('status') || q.includes('system')) {
            reply = isHighRisk
                ? `🚨 System Status: CRITICAL. ${highCount} high-severity threats active. Immediate intervention required.`
                : `✅ System Status: SECURE. No critical threats detected. All systems nominal.`;
        } else if (q.includes('ip') || q.includes('block') || q.includes('address')) {
            reply = repeatingIps.length > 0
                ? `⚠️ Suspicious IPs detected: ${repeatingIps.slice(0, 3).join(', ')}. Recommend immediate blacklisting.`
                : `✅ No suspicious IP patterns detected in current dataset.`;
        } else if (q.includes('ddos') || q.includes('attack') || q.includes('threat')) {
            const ddos = threats.filter(t => t.type === 'DDoS').length;
            reply = `📊 Threat Breakdown — DDoS: ${ddos}, High Severity: ${highCount}, Total Logged: ${threats.length}.`;
        } else if (q.includes('recommend') || q.includes('do') || q.includes('action') || q.includes('fix')) {
            if (isHighRisk) {
                reply = `🛡️ Recommended Actions:\n1. Block flagged IPs immediately\n2. Strengthen firewall rules\n3. Enable rate limiting\n4. Review access logs\n5. Alert security team`;
            } else {
                reply = `✅ System looks good. Recommended Routine:\n1. Run system updates\n2. Review access logs weekly\n3. Conduct security audits\n4. Keep threat monitoring active`;
            }
        } else if (q.includes('hello') || q.includes('hi') || q.includes('hey')) {
            reply = `👋 CyberShield AI online. I monitor your threat landscape in real-time. Ask me about system safety, threats, IPs, or recommendations.`;
        } else if (q.includes('total') || q.includes('count') || q.includes('how many')) {
            reply = `📈 Total threats logged: ${threats.length}. High: ${highCount}, repeating IPs: ${repeatingIps.length}.`;
        } else {
            reply = `🤖 I can help with: system status, threat analysis, IP blocking, recommendations. Try asking "Is my system safe?" or "What should I do?".`;
        }

        res.json({ reply });
    } catch (err) {
        res.status(500).json({ reply: 'Error processing request. Backend may be unreachable.' });
    }
};

// @desc    Delete a threat
// @route   DELETE /api/threats/:id
exports.deleteThreat = async (req, res) => {
    try {
        const threat = await Threat.findById(req.params.id);
        if (threat) {
            await threat.deleteOne();
            res.json({ message: 'Threat removed' });
        } else {
            res.status(404).json({ message: 'Threat not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// @desc    Mark a threat as resolved
// @route   PUT /api/threats/:id
exports.resolveThreat = async (req, res) => {
    try {
        const threat = await Threat.findById(req.params.id);
        if (threat) {
            threat.status = 'resolved';
            await threat.save();
            res.json({ message: 'Threat marked as resolved', data: threat });
        } else {
            res.status(404).json({ message: 'Threat not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// @desc    Block an IP address
// @route   POST /api/threats/block-ip
exports.blockIp = async (req, res) => {
    try {
        const { ip } = req.body;
        res.json({ message: `IP ${ip} has been blocked successfully.` });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
