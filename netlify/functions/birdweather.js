const BW_TOKEN = '3sTagPuEREQgtPWFs5xXb5NB';
const BW_BASE = `https://app.birdweather.com/api/v1/stations/${BW_TOKEN}`;
const CONF_GENERAL = 0.70;

const KING_COUNTY_FREQ = {
  'American Crow': 82, 'American Robin': 72, 'Black-capped Chickadee': 70,
  'Song Sparrow': 68, 'Dark-eyed Junco': 65, 'House Finch': 62,
  'European Starling': 60, 'House Sparrow': 58, "Steller's Jay": 55,
  'Spotted Towhee': 54, "Anna's Hummingbird": 52, "Bewick's Wren": 50,
  'Northern Flicker': 48, 'Glaucous-winged Gull': 46, 'Bushtit': 44,
  'Golden-crowned Sparrow': 42, 'Yellow-rumped Warbler': 40,
  'Chestnut-backed Chickadee': 38, 'Herring Gull': 36, 'Mallard': 45,
  'Canada Goose': 42, 'American Goldfinch': 35, 'Pine Siskin': 32,
  'Red-breasted Nuthatch': 30, 'Brown Creeper': 28,
  'Golden-crowned Kinglet': 27, 'Pacific Wren': 26, 'Pileated Woodpecker': 25,
  'Evening Grosbeak': 18, 'Cedar Waxwing': 22, 'Downy Woodpecker': 24,
  'White-crowned Sparrow': 20, 'Great Blue Heron': 22, 'Bald Eagle': 20,
  "Cooper's Hawk": 18, "Hutton's Vireo": 15, 'Red-tailed Hawk': 22,
  'American Kestrel': 12, 'Killdeer': 18, 'Ring-billed Gull': 20,
  'California Gull': 14, 'Great Horned Owl': 10, 'Northern Pygmy-Owl': 6,
  "Townsend's Solitaire": 8, 'Rufous Hummingbird': 9,
  'Orange-crowned Warbler': 8, 'Common Raven': 8,
  'Black-billed Magpie': 5, 'Tree Swallow': 9, 'American Pipit': 7,
  'Savannah Sparrow': 6, 'Marsh Wren': 8, 'Northern Harrier': 7,
  'Northern Saw-whet Owl': 8, 'Sandhill Crane': 4, 'Tundra Swan': 3,
  'Trumpeter Swan': 4, 'Greater White-fronted Goose': 3, 'Snow Goose': 2,
  'Harlequin Duck': 4, 'Common Goldeneye': 8, 'Ring-necked Duck': 9,
  'Eurasian Wigeon': 3, 'Gadwall': 9, 'Green-winged Teal': 9,
  'Northern Pintail': 7, 'American Wigeon': 9, 'Dunlin': 6,
  'Mountain Bluebird': 2, 'Hermit Thrush': 8, "Clark's Nutcracker": 2,
  'Bohemian Waxwing': 3, 'Common Redpoll': 2, 'Pine Grosbeak': 2,
  'Red Crossbill': 7, 'Lesser Goldfinch': 4, 'American Tree Sparrow': 5,
  'Common Loon': 8, 'Great Egret': 9, 'Eurasian Collared-Dove': 4,
  'Mourning Dove': 7, 'Ring-necked Pheasant': 4, 'California Quail': 3,
  'California Scrub-Jay': 3, 'Wood Duck': 4, 'Bufflehead': 8,
  'Merlin': 6, 'Peregrine Falcon': 4, 'Sharp-shinned Hawk': 8,
};

exports.handler = async (event) => {
  const action = event.queryStringParameters?.action || 'birdweather';
  const path = event.queryStringParameters?.path || '/species?limit=100&period=all';

  try {
    if (action === 'ebird-frequency') {
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, max-age=86400',
        },
        body: JSON.stringify({ frequencies: KING_COUNTY_FREQ }),
      };
    }

    const response = await fetch(BW_BASE + path);
    const data = await response.json();

    if (data.detections) {
      data.detections = data.detections.filter(d => (d.confidence || 0) >= CONF_GENERAL);
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=3600',
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
