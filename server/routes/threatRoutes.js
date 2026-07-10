const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const { 
    addThreat, 
    getThreats, 
    getHighRiskThreats, 
    getPredictions, 
    getRiskScore, 
    getRecommendations, 
    getChatbotResponse,
    deleteThreat,
    resolveThreat,
    blockIp
} = require('../controllers/threatController');

router.post('/addThreat', protect, addThreat);
router.get('/getThreats', protect, getThreats);
router.delete('/:id', protect, admin, deleteThreat);
router.put('/:id/resolve', protect, admin, resolveThreat);
router.post('/block-ip', protect, admin, blockIp);

router.get('/highRisk', protect, getHighRiskThreats);
router.get('/predictions', protect, getPredictions);
router.get('/risk-score', protect, getRiskScore);
router.get('/recommendations', protect, admin, getRecommendations);
router.post('/chatbot', protect, getChatbotResponse);

module.exports = router;
