const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('@syncfy/config');

const authRoutes = require('./src/routes/auth');
const ticketRoutes = require('./src/routes/tickets');
const statsRoutes = require('./src/routes/stats');
const scrapeRoutes = require('./src/routes/scrape');

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/scrape', scrapeRoutes);

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

app.listen(PORT, () => {
    console.log(`[API] Server running on port ${PORT}`);
});
