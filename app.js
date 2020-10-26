const express = require('express');
const mongoose = require('mongoose');

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

app.route('/articles')
  .get((req, res) => {
    Article.find((err, foundArticles) => {
      if (!err) res.send(foundArticles);
      if (err) res.send(err);
    });
  })

  .post((req, res) => {
    const { title, content } = req.body;
    const newArticle = new Article({ title, content });
    newArticle.save((err) => {
      if (err) res.send(err);
      else res.send('Successfully added article to database');
    });
  })

  .delete((req, res) => {
    Article.deleteMany((err) => {
      if (err) res.send(err);
      else res.send('All articles successfully deleted from database');
    });
  });

app.route('/articles/:articleTitle')
  .get((req, res) => {
    Article.findOne({ title: req.params.articleTitle }, (err, article) => {
      if (err) res.send(err);
      else res.send(article);
    });
  })

  .put((req, res) => {
    const { title, content } = req.body;
    Article.update(
      { title: req.params.articleTitle }, // conditions
      { title, content }, // updates
      { overwrite: true },
      (err) => {
        if (err) res.send(err);
        else res.send('Article updated successfully!');
      },
    );
  })

  .patch((req, res) => {
    Article.update(
      { title: req.params.articleTitle },
      { $set: req.body },
      (err) => {
        if (err) res.send(err);
        else res.send('Successfully updated the article!');
      },
    );
  })

  .delete((req, res) => {
    Article.deleteOne({ title: req.params.articleTitle }, (err) => {
      if (err) res.send(err);
      else res.send('Article deleted successfully!');
    });
  });

app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));
