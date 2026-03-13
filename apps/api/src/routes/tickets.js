const express = require('express');
const router = express.Router();
const ticketsController = require('../controllers/ticketsController');

// Define routes
router.get('/', ticketsController.getTickets);
router.get('/filters', ticketsController.getFilters);
router.get('/:id', ticketsController.getTicketDetails);

module.exports = router;
