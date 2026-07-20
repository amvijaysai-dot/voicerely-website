const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
// Serve static website
app.use(express.static(__dirname));

// Homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const RETELL_API_URL = 'https://api.retellai.com/v2/create-phone-call';
const RETELL_API_KEY = process.env.RETELL_API_KEY || 'YOUR_RETELL_API_KEY';
const TWILIO_NUMBER = process.env.TWILIO_NUMBER || 'YOUR_TWILIO_NUMBER';
const RETELL_AGENT_ID = process.env.RETELL_AGENT_ID || 'YOUR_RETELL_AGENT_ID';

if (!RETELL_API_KEY || !TWILIO_NUMBER || !RETELL_AGENT_ID) {
    console.warn('[WARNING] Missing environment variables: RETELL_API_KEY, TWILIO_NUMBER, or RETELL_AGENT_ID');
}

app.post('/api/make-call', async (req, res) => {
    try {
        const { phoneNumber } = req.body;

        if (!phoneNumber || typeof phoneNumber !== 'string') {
            return res.status(400).json({ error: 'Phone number is required' });
        }

        const cleanPhone = phoneNumber.replace(/\D/g, '');

        const requestBody = {
            from_number: TWILIO_NUMBER,
            to_number: cleanPhone,
            override_agent_id: RETELL_AGENT_ID
        };

        const response = await fetch(RETELL_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${RETELL_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error('[ERROR] Retell API error:', response.status, errorData);
            return res.status(response.status).json({ 
                error: 'Failed to create call',
                details: errorData
            });
        }

        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        console.error('[ERROR] Server error:', error.message);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});