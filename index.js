const axios = require('axios');
const FormData = require('form-data');

async function scrapeInstagramProfile(username) {
  try {
    const BASE_URL = 'https://tools.xrespond.com/api';

    // Build payload
    const form = new FormData();
    form.append('profile', username);

    // Make POST request
    const res = await axios.post(`${BASE_URL}/instagram/profile-info`, form, {
      headers: {
        ...form.getHeaders(),
        'authority': 'tools.xrespond.com',
        'method': 'POST',
        'path': '/api/instagram/profile-info',
        'scheme': 'https',
        'Accept': '*/*',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'en-US,en;q=0.9,en-GB;q=0.8',
        'Origin': 'https://instaprofileviewer.com',
        'Referer': 'https://instaprofileviewer.com/',
        'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36',
        'Sec-Ch-Ua': '"Chromium";v="137", "Not/A)Brand";v="24"',
        'Sec-Ch-Ua-Mobile': '?1',
        'Sec-Ch-Ua-Platform': '"Android"',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'cross-site'
      }
    });

    // Define matching variable with full response data
    const matching = res.data;

    console.log('🔎 Full API response:', JSON.stringify(matching, null, 2));

    // Robustly find data keys without direct .data access
    let result = {
      username: username,
      uid: null,
      biography: null,
      followers: 0,
      following: 0,
      posts: 0,
      profilePicHD: null
    };

    // Search entire matching object recursively
    function findKey(obj, key) {
      if (typeof obj !== 'object' || obj === null) return undefined;
      if (obj.hasOwnProperty(key)) return obj[key];
      for (let k in obj) {
        const found = findKey(obj[k], key);
        if (found !== undefined) return found;
      }
      return undefined;
    }

    // Populate result using findKey function
    result.uid = findKey(matching, 'fbid_v2') || null;
    result.biography = findKey(matching, 'biography') || null;
    result.followers = findKey(matching, 'follower_count') || 0;
    result.following = findKey(matching, 'following_count') || 0;
    result.posts = findKey(matching, 'media_count') || 0;
    result.profilePicHD = findKey(matching, 'hd_profile_pic_url_info')?.url || null;

    console.log('✅ Final Scraped Result:');
    console.log(result);

  } catch (error) {
    console.error('❌ Error scraping profile:', error.response?.data || error.message);
  }
}

// Example test username
scrapeInstagramProfile('hey___minato');
          
