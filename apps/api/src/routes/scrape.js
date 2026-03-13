const express = require('express');
const router = express.Router();
const scrapeController = require('../controllers/scrapeController');

// POST /api/scrape/partial
router.post('/partial', scrapeController.runPartialScrape);

// POST /api/scrape/general
router.post('/general', scrapeController.runGeneralScrape);

module.exports = router;
