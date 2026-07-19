/**
 * Vercel Serverless Function: Start Demo Call
 * Creates a real outbound phone call via Retell AI + Twilio
 * 
 * POST /api/start-demo-call
 * Body: { phone: "+15551234567" }
 * Returns: { success: true, callId: "..." } or { success: false, error: "..." }
 */

// In-memory rate limiting (resets on cold start, doesn't share across instances)
// CAVEAT: This is a stopgap solution. For production with abuse concerns,
// upgrade to Vercel KV or Upstash Redis for persistent, cross-instance rate limiting.
const phoneCallLimits = new Map(); // phone -> last call timestamp
const ipRequestLimits = new Map(); // IP -> request count in current hour

// Rate limit: 1 call per phone number per hour
const PHONE_COOLDOWN_MS = 60 * 60 * 1000;
// Rate limit: 5 requests per IP per hour
const IP_MAX_REQUESTS = 5;
const IP_WINDOW_MS = 60 * 60 * 1000;

function getRateLimitKey(phone) {
    return phone.replace(/\D/g, ''); // Strip non-digits for consistent key
}

function checkPhoneRateLimit(phone) {
    const key = getRateLimitKey(phone);
    const now = Date.now();
    const lastCall = phoneCallLimits.get(key);
    
    if (lastCall && (now - lastCall) < PHONE_COOLDOWN_MS) {
        return false;
    }
    return true;
}

function checkIpRateLimit(ip) {
    const now = Date.now();
    const record = ipRequestLimits.get(ip);
    
    if (!record) {
        ipRequestLimits.set(ip, { count: 1, resetTime: now + IP_WINDOW_MS });
        return true;
    }
    
    // Reset count if window has passed
    if (now > record.resetTime) {
        ipRequestLimits.set(ip, { count: 1, resetTime: now + IP_WINDOW_MS });
        return true;
    }
    
    // Check if under limit
    if (record.count >= IP_MAX_REQUESTS) {
        return false;
    }
    
    record.count++;
    return true;
}

function recordPhoneCall(phone) {
    const key = getRateLimitKey(phone);
    phoneCallLimits.set(key, Date.now());
}

function getClientIp(req) {
    return req.headers['x-forwarded-for']?.split(',')[0]?.trim() || 
           req.headers['x-real-ip'] || 
           req.socket?.remoteAddress || 
           'unknown';
}

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

    // Rate limiting checks
    const clientIp = getClientIp(req);
    
    if (!checkPhoneRateLimit(phone)) {
        return res.status(429).json({ 
            success: false, 
            error: 'Please wait before requesting another demo call' 
        });
    }
    
    if (!checkIpRateLimit(clientIp)) {
        return res.status(429).json({ 
            success: false, 
            error: 'Please wait before requesting another demo call' 
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

        // Record successful call for rate limiting
        recordPhoneCall(phone);

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