const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const Register = require('./models/Register');

const app = express();

// Connect to the MongoDB database named 'signup'
mongoose.connect('mongodb://localhost:27017/signup', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Route to fetch data from the 'register' collection and display it in JSON
app.get('/fetch-registers', async (req, res) => {
  try {
    const registers = await Register.find(); // Fetch all documents from the 'register' collection
    res.json(registers); // Return the fetched data as JSON
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching register data');
  }
});

// Serve the main HTML page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html')); // Serve the 'index.html' file
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
