const express = require('express');
const mongoose = require('mongoose');
const ejs = require('ejs');

const app = express();
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

mongoose.connect('mongodb://localhost:27017/wikiDB', { useNewUrlParser: true, useUnifiedTopology: true });

const articleSchema = new mongoose.Schema({
  title: String,
  content: String,
});

const Article = mongoose.model('Article', articleSchema);

app.get('/', (req, res) => {

});

app.listen(3000, () => console.log('Listening on port 3000...'));
