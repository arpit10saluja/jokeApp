const express = require('express');
const axios = require('axios');
require("dotenv").config()
const cors=require("cors")

const app = express();
const port = 3000;
app.use(cors())

app.get('/joke', async (req, res) => {
  const { keyword } = req.query;

  if (!keyword) {
    return res.status(400).json({ error: 'Missing keyword parameter' });
  }

  try {
    const joke = await generateJoke(keyword);
    res.json({ joke });
  } catch (error) {
    console.error('Error generating joke:', error);
    res.status(500).json({ error: 'Failed to generate joke' });
  }
});

async function generateJoke(keyword) {
    try {
      const response = await axios.post('https://api.openai.com/v1/engines/davinci/completions', {
        prompt: `Tell me a joke about ${keyword}`,
        max_tokens: 50,
        temperature: 0.7,
        n: 1
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` // Replace with your OpenAI API key
        }
      });
  
      const [joke] = response.data.choices;
      return joke.text.trim();
    } catch (error) {
      console.error('Error generating joke:', error.response.data);
      throw error;
    }
  }
  
  
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
