require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const rout = require('./routes/user');
const app = express();
const P = 1234;
app.use(express.json());
mongoose.connect('mongodb://localhost:27017/testdb')
  .then(() => {
    console.log('Connected to MongoDB!!');
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
  });
app.use('/api/user', rout);
app.listen(P, () => console.log(`Server pelaa on http://localhost:${P}`));
