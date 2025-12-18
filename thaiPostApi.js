require('dotenv').config();
const axios = require('axios');

let cachedToken = null;
let tokenExpire = 0;

async function getToken() {
  if (cachedToken && Date.now() < tokenExpire) return cachedToken;

  if (!process.env.THAIPOST_API_KEY) {
    throw new Error('THAIPOST_API_KEY is missing');
  }

  const res = await axios.post(
    'https://trackapi.thailandpost.co.th/post/api/v1/authenticate/token',
    {},
    {
      headers: {
        'Content-Type': 'application/json',
        'Api-Key': process.env.THAIPOST_API_KEY
      }
    }
  );

  cachedToken = res.data.token;
  tokenExpire = Date.now() + 25 * 60 * 1000;

  return cachedToken;
}

async function trackItems(barcodes = []) {
  const token = await getToken();

  const res = await axios.post(
    'https://trackapi.thailandpost.co.th/post/api/v1/track',
    {
      status: 'all',
      language: 'TH',
      barcode: barcodes
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`
      }
    }
  );

  return res.data.items || {};
}

module.exports = { trackItems };
