const jwt = require('jsonwebtoken');

// Fake JWT Secret for demo
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-syncfy-key-123';

exports.login = (req, res) => {
    const { username, password } = req.body;

    // Requisito: Aceptar única y estrictamente test / test
    if (username === 'test' && password === 'test') {
        const token = jwt.sign({ username, role: 'support_l1' }, JWT_SECRET, { expiresIn: '8h' });

        return res.status(200).json({
            message: 'Login successful',
            token,
            user: { username, role: 'support_l1' }
        });
    }

    return res.status(401).json({ error: 'Invalid credentials' });
};
