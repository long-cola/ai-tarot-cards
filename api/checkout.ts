import axios from 'axios';
import { getUserFromRequest } from '../services/jwt.js';

export default async function handler(req: any, res: any) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get user from JWT token - require authentication
  const user = getUserFromRequest(req);

  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  console.log('[/api/checkout] User requesting checkout:', {
    id: user.id,
    email: user.email,
  });

  try {
    // Get environment variables
    const creemApiKey = process.env.CREEM_API_KEY;
    const creemProductId = process.env.CREEM_PRODUCT_ID;

    if (!creemApiKey || !creemProductId) {
      console.error('[/api/checkout] Missing Creem credentials in environment');
      return res.status(500).json({ error: 'Payment system not configured' });
    }

    // Determine API endpoint based on API key type
    // Test keys start with 'ck_test_' or 'creem_test_'
    // Live keys start with 'ck_live_' or 'creem_live_'
    const isTestMode = creemApiKey.includes('test');
    const apiBaseUrl = isTestMode
      ? 'https://test-api.creem.io'
      : 'https://api.creem.io';

    console.log('[/api/checkout] Using API endpoint:', apiBaseUrl);
    console.log('[/api/checkout] Test mode:', isTestMode);

    // Get the client origin from the request
    const origin = req.headers.origin || req.headers.referer?.replace(/\/$/, '') || 'https://ai-tarotcard.com';
    const successUrl = `${origin}/?payment=success`;

    console.log('[/api/checkout] Success URL:', successUrl);

    // Call Creem API to create checkout session
    console.log('[/api/checkout] Creating Creem checkout session...');
    const response = await axios.post(
      `${apiBaseUrl}/v1/checkouts`,
      {
        product_id: creemProductId,
        // Optional: Pass customer info to pre-fill checkout form
        customer: {
          email: user.email,
        },
        // Success URL - where to redirect after payment
        success_url: successUrl,
        // Optional: Pass metadata to track the user
        metadata: {
          user_id: user.id,
          user_email: user.email,
        }
      },
      {
        headers: {
          'x-api-key': creemApiKey,
          'Content-Type': 'application/json',
        }
      }
    );

    console.log('[/api/checkout] Creem response:', {
      status: response.status,
      checkout_url: response.data.checkout_url,
    });

    // Return the checkout URL to the frontend
    return res.status(200).json({
      ok: true,
      checkout_url: response.data.checkout_url,
    });

  } catch (error: any) {
    console.error('[/api/checkout] Error creating checkout:', error);

    // Handle Creem API errors
    if (error.response) {
      console.error('[/api/checkout] Creem API error:', {
        status: error.response.status,
        data: error.response.data,
      });
      return res.status(error.response.status).json({
        error: 'Payment system error',
        message: error.response.data?.message || 'Failed to create checkout session',
      });
    }

    // Handle network errors
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to connect to payment system',
    });
  }
}

export const config = {
  maxDuration: 10,
};
