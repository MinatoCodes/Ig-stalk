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

    // Build multipart/form-data payload
    const joinPayload = new FormData();
    joinPayload.append('profile', username);

    // Make POST request in your desired format
    const response = await axios.post(`${BASE_URL}/instagram/profile-info`, joinPayload, {
      headers: {
        ...joinPayload.getHeaders(),
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

    const data = response.data.data;

    // Parse required fields for your API response
    const result = {
      username: username,
      uid: data['fbid_v2'] || null,
      biography: data['biography'] || null,
      followers: data['follower_count'] || 0,
      following: data['following_count'] || 0,
      posts: data['media_count'] || 0,
      profilePicHD: data['hd_profile_pic_url_info']?.url || null
    };

    res.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error(error.response?.data || error.message);
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
        
