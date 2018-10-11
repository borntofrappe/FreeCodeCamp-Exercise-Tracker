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
app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/views/index.html`);
});

// in the path selected to register a user, retrieve the value of the username
// register the user if a user is not registered with the same name
app.post('/api/exercise/new-user', (req, res) => {
  const { username: reqUsername } = req.body;

  // search for a document matching the username
  User.findOne({
    username: reqUsername
  }, (errFound, userFound) => {
    if (errFound) {
      console.log('findOne() error');
    }
    // findOne() returns either **null** or a **document** matching the search
    if (userFound) {
      // if a document is found, return a message detailing how the name is not available
      res.send('username already taken');
    } else {
      // else create a document for the input username
      // detail log as an empty array
      const user = new User({
        username: reqUsername,
        log: []
      });
      // save the object in the database
      user.save((errSaved, userSaved) => {
        if (errSaved) {
          console.log('save() error');
        }
        // display a JSON object detailing the _id and the username
        const { _id, username } = userSaved;
        res.json({
          username,
          _id
        });
      });
    }
  });
});

// in the path selected to register an exercise, find and update the document matching the id
app.post('/api/exercise/add', (req, res) => {
  // retrieve the values from the form
  const {
    userId: _id, description, duration, dateYear, dateMonth, dateDay
  } = req.body;
  // create an instance of the date object, based on the year, month and day value
  const date = new Date(`${dateYear}-${dateMonth}-${dateDay}`);

  // create a log out of the description, duration and date fields
  const log = {
    description,
    duration,
    date
  };

  // look for a document with a matching _id value
  User.findOneAndUpdate({
    _id
  },
  {
    // push in the log array the new object detailing the exercise
    $push: {
      log
    }
  },
  {
    // in the options set new to be true, as to have the function return the updated document
    new: true
  }, (errFound, userFound) => {
    if (errFound) {
      console.log('findOne() error');
    }
    // findOneAndUpdate returns **null** or a matching **document** depending on whether a match is found
    if (userFound) {
      // if a match is found, return a json object detailing the username and latest exercise
      const { username } = userFound;
      res.json({
        _id,
        username,
        description,
        duration,
        date: date.toDateString()
      });
    } else {
      // findOne returns null, detail the occurrence
      res.send('unknown _id');
    }
  });
});

// in the path selected to log the excercises, return the data attached to the userId
// if existing, otherwise return a JSON object detailing the occurrence
// ! currently returning all exercises
// TODO: incorporate the **from** and **to** query strings to return only the selected exercises
app.get('/api/exercise/log', (req, res) => {
  const { userId: _id, from, to } = req.query;

  // look in the database for a document matching the userId
  User.findOne({
    _id
  }, (errFound, userFound) => {
    if (errFound) {
      console.log('findOne() error');
    }

    if (userFound) {
      // if a user is found, return a JSON object detailing the relevant data
      const { username, log } = userFound;
      const count = log.length;

      /* in the log array modify the date to show only:
      - description,
      - duration,
      - date
      */
      const responseLog = log.map((exercise) => {
        const { description, duration } = exercise;
        const date = exercise.date.toDateString();
        return {
          description,
          duration,
          date
        };
      });

      res.json({
        _id,
        username,
        count,
        log: responseLog
      });
    } else {
      // else return a JSON object detailing the error
      res.send('unknown userId');
    }
  });
});

// listen in the selected port and render the simple application
app.listen(port);
console.log(`listening on port ${port}`);
