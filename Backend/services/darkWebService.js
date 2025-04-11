const axios = require('axios');
require('dotenv').config(); // Load environment variables

async function checkEmailForBreaches(email) {
  try {
    const HIBP_API_KEY = process.env.HIBP_API_KEY;
    if (!HIBP_API_KEY) {
      throw new Error('HIBP_API_KEY is missing from environment variables');
    }

    console.log('Making request to HIBP API for email:', email);
    const response = await axios.get(
      `https://haveibeenpwned.com/api/v3/breachedaccount/${encodeURIComponent(email)}`, 
      {
        headers: {
          'hibp-api-key': HIBP_API_KEY,
          'user-agent': 'SecureKeyManagement/1.0',
          'accept': 'application/vnd.haveibeenpwned.v3+json'
        },
        params: { truncateResponse: false },
        timeout: 15000
      }
    );

    console.log('Full API response:', JSON.stringify(response.data, null, 2));
    const processedBreaches = response.data.map(breach => ({
        Name: breach.Name,
        Title: breach.Title,
        Domain: breach.Domain,
        BreachDate: breach.BreachDate,
        Description: breach.Description,
        DataClasses: breach.DataClasses,
        IsVerified: breach.IsVerified,
        IsFabricated: breach.IsFabricated,
        IsSensitive: breach.IsSensitive,
        PwnCount: breach.PwnCount || 'Unknown'
    }));
    console.log('Processed breaches:', processedBreaches);
    return {
      success: true,
      found: response.data.length > 0,
      breaches: processedBreaches
    };

  } catch (error) {
    console.error('API Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });

    if (error.response?.status === 404) {
      return { success: true, found: false, breaches: [] };
    }
    return {
      success: false,
      error: 'Failed to check breaches',
      details: error.message
    };
  }
}

module.exports = {
  checkEmailForBreaches
};