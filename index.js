const express = require('express');
const axios = require('axios');
const FormData = require('form-data');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/api/igstalk', async (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({
      success: false,
      message: "Username is required"
    });
  }

  try {
    const BASE_URL = 'https://tools.xrespond.com/api';

    // Build payload
    const form = new FormData();
    form.append('profile', username);

    // Make POST request
    const apiRes = await axios.post(`${BASE_URL}/instagram/profile-info`, form, {
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

    // Full API response stored in matching variable
    const matching = apiRes.data;

    // Robust findKey function
    function findKey(obj, key) {
      if (typeof obj !== 'object' || obj === null) return undefined;
      if (obj.hasOwnProperty(key)) return obj[key];
      for (let k in obj) {
        const found = findKey(obj[k], key);
        if (found !== undefined) return found;
      }
      return undefined;
    }

    // Prepare final result
    const result = {
      username: username,
      uid: findKey(matching, 'fbid_v2') || null,
      biography: findKey(matching, 'biography') || null,
      followers: findKey(matching, 'follower_count') || 0,
      following: findKey(matching, 'following_count') || 0,
      posts: findKey(matching, 'media_count') || 0,
      profilePicHD: findKey(matching, 'hd_profile_pic_url_info')?.url || null
    };

    res.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('❌ API error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch Instagram profile info",
      error: error.response?.data || error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
        
