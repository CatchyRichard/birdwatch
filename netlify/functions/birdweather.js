const TOKEN = '3sTagPuEREQgtPWFs5xXb5NB';
const BASE = `https://app.birdweather.com/api/v1/stations/${TOKEN}`;

exports.handler = async (event) => {
  const path = event.queryStringParameters?.path || '/species?limit=100&period=all';

  try {
    const response = await fetch(BASE + path);
    const data = await response.json();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=3600', // cache for 1 hour
      },
      body: JSON.stringify(data),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
