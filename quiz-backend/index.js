const express = require('express');
const axios = require('axios');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

let highScores = [];

app.get('/high-scores', (req, res) => {
    res.json(highScores);
  });

app.post('/saveHighScore', (req, res) => {
    const { name, score } = req.body;
    const date = new Date().toISOString();
    
    highScores.push({ name, score, date });
    
    // Sort and keep top 20 scores
    highScores = highScores.sort((a, b) => b.score - a.score).slice(0, 20);
    
    res.status(200).send({ message: 'High score saved!' });
  });

const generateQuestions = (countries) => {
  const questions = [];
  for (let i = 0; i < 10; i++) {
    const randomIndex = Math.floor(Math.random() * countries.length);
    const country = countries[randomIndex];
    const questionType = Math.random() > 0.5 ? 'capital' : 'flag';
    const options = [country];
    while (options.length < 4) {
      const optionCountry = countries[Math.floor(Math.random() * countries.length)];
      if (!options.includes(optionCountry)) {
        options.push(optionCountry);
      }
    }
    questions.push({
      type: questionType,
      country,
      options: options.sort(() => Math.random() - 0.5),
    });
  }
  return questions;
};

// Inside your existing '/questions' route
app.get('/questions', async (req, res) => {try {
  const response = await axios.get('https://restcountries.com/v3.1/all');
  const countries = response.data;
  const questions = generateQuestions(countries);
  res.json(questions);
} catch (error) {
  res.status(500).json({ message: 'Error fetching data' });
}})

app.listen(3001, () => {
  console.log('Server running on http://localhost:3001');
});
