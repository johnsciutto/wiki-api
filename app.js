const express = require('express');
const mongoose = require('mongoose');
const ejs = require('ejs');

const DB_ADDRESS = 'mongodb://localhost:27017/wikiDB';
const PORT = process.env.PORT || 3000;

// Express Configuration =======================================================

const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('view engine', 'ejs');

// Mongoose Configuration ======================================================

mongoose.connect(DB_ADDRESS, { useNewUrlParser: true, useUnifiedTopology: true });

const articleSchema = new mongoose.Schema({
  title: String,
  content: String,
});

const Article = mongoose.model('Article', articleSchema);

// Routes ======================================================================

app.get('/articles', (req, res) => {
  Article.find((err, foundArticles) => {
    if (!err) res.send(foundArticles);
    if (err) res.send(err);
  });
});

app.post('/articles', (req, res) => {
  const { title, content } = req.body;
  const newArticle = new Article({ title, content });
  newArticle.save((err) => {
    if (err) res.send(err);
    else res.send('Successfully added article to database');
  });
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));
