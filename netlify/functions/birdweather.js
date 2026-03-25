const BW_TOKEN = '3sTagPuEREQgtPWFs5xXb5NB';
const EBIRD_KEY = 'bjbg07vu9bnp';
const BW_BASE = `https://app.birdweather.com/api/v1/stations/${BW_TOKEN}`;
const EBIRD_REGION = 'US-WA-033';
const CONF_GENERAL = 0.70;
const CONF_RARE = 0.55;

exports.handler = async (event) => {
  const action = event.queryStringParameters?.action || 'birdweather';
  const path = event.queryStringParameters?.path || '/species?limit=100&period=all';

  try {
    if (action === 'ebird-frequency') {
      const recentUrl = `https://api.ebird.org/v2/data/obs/${EBIRD_REGION}/recent?maxResults=200&includeProvisional=true`;
      const res = await fetch(recentUrl, {
        headers: { 'X-eBirdApiToken': EBIRD_KEY }
      });
      const data = await res.json();
      const speciesCounts = {};
      const checklistIds = new Set();
      data.forEach(obs => {
        checklistIds.add(obs.subId);
        const name = obs.comName;
        if (!speciesCounts[name]) speciesCounts[name] = new Set();
        speciesCounts[name].add(obs.subId);
      });
      const totalChecklists = checklistIds.size || 1;
      const frequencies = {};
      Object.entries(speciesCounts).forEach(([name, lists]) => {
        frequencies[name] = Math.round((lists.size / totalChecklists) * 100);
      });
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'public, max-age=86400' },
        body: JSON.stringify({ frequencies, totalChecklists }),
      };
    }

    const response = await fetch(BW_BASE + path);
    const data = await response.json();
    if (data.detections) {
      data.detections = data.detections.filter(d => (d.confidence || 0) >= CONF_GENERAL);
    }
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'public, max-age=3600' },
      body: JSON.stringify(data),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
