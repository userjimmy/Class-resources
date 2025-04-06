require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve frontend files
app.use(express.static('../client'));

// GitHub Proxy API
app.get('/api/content/:type/:folder?', async (req, res) => {
  try {
    const { type, folder } = req.params;
    const path = folder ? `${type}/${folder}/` : `${type}/`;
    
    const response = await fetch(
      `https://api.github.com/repos/userjimmy/My-resources/contents/${path}?ref=main`,
      {
        headers: {
          'Authorization': `token ${process.env.GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github+json'
        }
      }
    );

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'GitHub API error');

    res.json({
      success: true,
      data: data.filter(item => 
        item.type === 'dir' || 
        item.name.toLowerCase().endsWith('.pdf')
      ).map(item => ({
        name: item.name,
        type: item.type,
        url: item.download_url || null
      }))
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
app.listen(PORT, () => console.log(`
  Server running on port ${PORT}
  Frontend: http://localhost:${PORT}
  API: http://localhost:${PORT}/api/content/notes
`));
