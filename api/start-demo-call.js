/**
 * Vercel Serverless Function: Start Demo Call
 * Creates a real outbound phone call via Retell AI + Twilio
 * 
 * POST /api/start-demo-call
 * Body: { phone: "+15551234567" }
 * Returns: { success: true, callId: "..." } or { success: false, error: "..." }
 */

export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ 
            success: false, 
            error: 'Method not allowed' 
        });
    }

    // Extract phone number from request body
    const { phone } = req.body;

    // Validate phone number is present
    if (!phone) {
        return res.status(400).json({ 
            success: false, 
            error: 'Phone number is required' 
        });
    }

    // Basic E.164 format validation
    // Must start with + followed by 1-15 digits (country code + national number)
    const e164Regex = /^\+[1-9]\d{1,14}$/;
    if (!e164Regex.test(phone)) {
        return res.status(400).json({ 
            success: false, 
            error: 'Invalid phone number format. Please use E.164 format (e.g., +15551234567)' 
        });
    }

    // Read environment variables
    const RETELL_API_KEY = process.env.RETELL_API_KEY;
    const RETELL_AGENT_ID = process.env.RETELL_AGENT_ID;
    const RETELL_FROM_NUMBER = process.env.RETELL_FROM_NUMBER;

    // Check that all required environment variables are set
    if (!RETELL_API_KEY || !RETELL_AGENT_ID || !RETELL_FROM_NUMBER) {
        console.error('Missing required environment variables for Retell AI');
        return res.status(500).json({ 
            success: false, 
            error: 'Server configuration error. Please try again later.' 
        });
    }

    try {
        // Call Retell AI create-phone-call endpoint
        const response = await fetch('https://api.retellai.com/v2/create-phone-call', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${RETELL_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from_number: RETELL_FROM_NUMBER,
                to_number: phone,
                override_agent_id: RETELL_AGENT_ID
            })
        });

        const data = await response.json();

        if (!response.ok) {
            // Log the actual error for debugging (server-side only)
            console.error('Retell API error:', data);
            // Return generic error to client (don't leak API details)
            return res.status(500).json({ 
                success: false, 
                error: 'Failed to initiate call. Please try again.' 
            });
        }

        // Success - return call info to frontend
        return res.status(200).json({ 
            success: true, 
            callId: data.call_id || data.id,
            message: 'Call initiated successfully'
        });

    } catch (error) {
        // Log the actual error for debugging (server-side only)
        console.error('Error creating phone call:', error);
        // Return generic error to client
        return res.status(500).json({ 
            success: false, 
            error: 'Something went wrong. Please try again.' 
        });
    }
}