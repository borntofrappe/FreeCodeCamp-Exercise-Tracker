// set up an express app
const port = 3000;

/* require the following packages:
- express
- body-parser
- dotenv to read .env variables locally
- mongoose to interact with the database
*/
const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const mongoose = require('mongoose');

// set up an express app
const app = express();

// mount the body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));

// render the stylesheet as found in the public folder
app.use(express.static(`${__dirname}/public`));

// connect the application to the database
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true });

// MONGOOSE
// define the schema
const { Schema } = mongoose;
const userSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  log: [{
    description: {
      type: String
    },
    duration: {
      type: Number
    },
    date: {
      type: Date
    }
  }]
});
// define the model, on which all documents will be based
const User = mongoose.model('User', userSchema);

// EXPRESS && ROUTING
// in the root path render the HTML file as found in the views folder
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

// in the path selected to register a user, retrieve the value of the username and register the user
// ! first look for an existing entry, in which case return a JSON object detailing the occurrence
app.post('/api/exercise/new-user', function (req, res) {
  const { username } = req.body;
  res.send(username);
});

// in the path selected to register an exercise, retrieve the values for the userId, description, duration and date
app.post('/api/exercise/add', function (req, res) {
  const { userId, description, duration, dateYear, dateMonth, dateDay } = req.body;
  res.send(req.body);
});

// in the path selected to log the excercises, return the data attached to the userId
// ! if existing, otherwise return a JSON object detailing the occurrence
// ! currently return a hard-coded message as to test the method
app.get('/api/exercise/log', function (req, res) {
  res.send(req.query);
});


// listen in the selected port and render the simple application
app.listen(port);
console.log(`listening on port ${port}`);