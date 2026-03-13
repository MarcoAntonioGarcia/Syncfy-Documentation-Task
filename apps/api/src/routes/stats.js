const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');

router.get('/historical', statsController.getHistorical);
router.post('/sync-daily', statsController.syncDailyStats);

module.exports = router;
