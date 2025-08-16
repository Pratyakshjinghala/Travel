const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/search', async (req, res) => {
  const { origin, destination, departure_at, one_way } = req.query;
  const token = process.env.TRAVELPAYOUT_TOKEN;

  try {
    const response = await axios.get('https://api.travelpayouts.com/aviasales/v3/prices_for_dates', {
      params: {
        origin,
        destination,
        departure_at,         // YYYY-MM or YYYY-MM-DD
        one_way: one_way || true,
        direct: false,
        sorting: 'price',
        limit: 30,
        currency: 'usd',
        token
      }
    });

    console.log('API Response:', response.data);
    res.json(response.data);

  } catch (err) {
    console.error('API Error:', err.message);
    res.status(500).json({ message: 'Error fetching flights', error: err.message });
  }
});

module.exports = router;
