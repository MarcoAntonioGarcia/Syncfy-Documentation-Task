const express = require('express');
const router = express.Router();
const debugController = require('../controllers/debugController');

// Debug route to dump the entire database state
router.get('/db', debugController.dumpDatabase);

module.exports = router;
