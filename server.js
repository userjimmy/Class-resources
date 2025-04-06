
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();

// Middleware
app.use(cors());
app.use(express.static('public'));

// GitHub Proxy Endpoint
app.get('/api/content/:tab/:folder?', async (req, res) => {
  try {
    const { tab, folder } = req.params;
    const path = folder ? `${tab}/${folder}/` : `${tab}/`;
    
    const response = await fetch(
      `https://api.github.com/repos/userjimmy/My-resources/contents/${path}?ref=main`,
      {
        headers: {
          'Authorization': `token ${process.env.GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github+json'
        }
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'GitHub API error');
    }

    const data = await response.json();
    res.json({
      success: true,
      data: data.filter(item => item.type === 'dir' || item.name.endsWith('.pdf'))
    });

  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
