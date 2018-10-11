# FreeCodeCamp Exercise Tracker

> Fourth of five projects required to earn the **API and Microservices** certification @freeCodeCamp.

<!-- Link to the working pen for the UI of the application [right here](). -->

<!-- Link to the working glitch for the actual, functioning application [right here](). -->

## Preface

With this project I am tasked to create a full-stack JavaScript application, similar to the one [referenced by @freecodecamp](https://fuschia-custard.glitch.me/).

It is a simple application, which allows any visitor to:

1. create a new user;

1. register an exercise for an existing user;

1. retrieve a list of exercises for an existing user.

This last feature may not be obvious from the UI of the homepage, but it is connected to the back-end profile of the project. As a matter of fact, all features are tightly coupled with `Node.js`, as the forms produce `POST` request themselves, while the last mentioned features is based on a `GET` request, pinging the application at a specific endpoint.

Looking briefly at the application, it does not seem to far off from the previous project, the [**URL Shortener Microservice**](https://various-umbrella.glitch.me/). It is necessary to work with **MongoDB** and specifically **Mongoose**, perhaps with addditional care and consideration in the structure of the schema, models and documents for the database entries.

## Front-End

The UI for the homepage of the application can be found in the **Front-End** folder, as well as [here on codepen](https://codepen.io/borntofrappe/full/dgvNLK). There's little to detail about the page, which simply showcases the two form elements one after the other. The only extravagant feature is an animated SVG asset included in the top left corner, but only for devices with a viewport larger than `1000px`.

## Back-End

Concerning back-end `Node.js` development, the application benefits from a few libraries, here to fully understand their influence and possibly provide a valuable resource in the future.

### Express

Express is used to render the application and handle basic routing.

First, the package allows to set up the application, as follows:

```JS
// set up an express app
const port = 3000;
const express = require('express');
const app = express();

// ...

// listen in the selected port and render the simple application
app.listen(port);
console.log(`listening on port ${port}`);
```

In between the mentioned lines of code, it allows to then render the HTML file, following a `GET` request in the specified endpoint.

```JS
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});
```

Such a structure is replicated for every path behind the application, using the `get()` method as well as the `post()` function, this time for `POST` requests.

Finally, the library allows to render the stylesheet, through the `express.statit()` middleware.

```JS
app.use(express.static(`${__dirname}/public`));
```

_A small note here_: both functions leverage the `__dirname` variable. This refers to a global variable referring to the path of the application, the path of the repository in which the JavaScript file is included.

## Form and Input Elements

To retrieve the actual data, `bodyParser` is used in conjunction to the values detailed through the `name` attribute of each input element.

First, it is necessary to update the HTML structure as to forward the application toward the desired paths:

```HTML
<form action="/api/exercise/new-user" method="post">
<!-- user form -->
</form>

<form action="/api/exercise/add" method="post">
<!-- exercise form -->
</form>
```

Both forms detail also a `post` value for the `method` attribute, and will be complemented by a `.post()` method set up on the express application.

The `form` elements are not the only HTML structure needing an update though. The `input` elements ought to include a `name` attribute, with a value which will then be used to retrieve the `value` of each separate element.

```HTML
<input required type="text" name="username" id="username" placeholder="Timothy">
```

With this structure, the body parser package allows to retrieve the values simply by referring to the `request.body` object.

For instance, and for the post request adding an excercise:

1. first require the body parser package, and mount it prior to actually using it:

   ```JS
   const bodyParser = require('body-parser');
   // mount the body parser middleware
   app.use(bodyParser.urlencoded({ extended: false }));
   ```

   The object passed in between parenthesis is suggested by the `body-parser` own documentation, to remove an archaic encoding structure.

1. in each post request, retrieve the data as needed. This is available in the `req.body` object:

   ```JS
   // use the value of the `action` attribute for the path of the post request
   app.post('/api/exercise/add', function (req, res) {
     // retrieve the values from `req.body`
     const { userId, description, duration, dateYear, dateMonth, dateDay } = req.body;
     // send the data as a whole to the page, to test out the correct use of the function
     res.send(req.body);
   });
   ```

   In this instance, the data is obtained by _destructuring_ the object itself. The input's `name`s are used for each value.

## Mongoose

Just like the [URL Shortener Microservice](https://various-umbrella.glitch.me/), this full-stack application relies heavily on **Mongoose**, a package which allows to interact with a database as to easily create, read and this time around also update the entries in the database. (the operations relate to the first three letters of the acronym describing database operations, CRUD. As of the time of writing, it does not seem that the application needs to delete documents).

Mongoose is fundamentally based on the definition of a **Schema**. This describes the fields and possible values of each entry.

By tinkering with the [application @freecodecamp](https://fuschia-custard.glitch.me/), each document is structured as follows.

```JSON
{
  _id,
  username,
  count,
  log: [
    {
      description,
      duration,
      date
    },
    {
      description,
      duration,
      date
    },
    {
      description,
      duration,
      date
    }
  ]
}
```

For each field, the following considerations apply:

- `_id`: a unique value used to identify each object. **mLab** generates this field on its own, but its value is rather longer than the one returned by the application. In light of this, it ought to be possible to use the a smaller section of the string (perhaps through `substring()`). Given the scale of the application, it ought not to cause any issues;

- `username`: a string, as described in the first form where the visitor can register a new user. The application doesn't seem to accept two usernames with the same values, so this value ought to be unique;

- `count`: an integer describing the number of exercises registered by the user. Perhaps the schema can avoid including such a field in the database, and simply use the `length` property of the array of exercises;

- `log`: an array of values describing the exercises registered through the second form. These values include:

  - a `description`, through a short string;

  - a `duration`, with an integer detailing the number of minutes;

  - `date`, with an instance of the date object. This date object is created with a (yyyy-mm-dd) format. The same object is detailed in the JSON object specifying the name of the day, of the month, number of the day and year, as in _Mon Oct 08 2018_.

Following the [Mongoose's own documentation](https://mongoosejs.com/docs/schematypes.html) and the mentioned considerations, the schema is built as follows:

```JS
const schema = new Schema({
  username: {
    type: String,
    required: true
  },
  log: [{
    description: {
      type: String,
      required: true
    },
    duration: {
      type: Number,
      required: true
    },
    date: {
      type: Date,
      required: true
    }
  }]
});
```

The values from the `form` elements need to be included in such a construct.

### MongoDB URI Code

Before the JavaScript file can benefit from the **mongoose** library, it is necessary to create a database and retrieve the **URI code**. This is a code which allows to _connect_ the application to the database itself.

- include a `.env` file in which to store the URI code;

  ```env
  MONGO_URI=mongodb://<dbuser>:<dbpassword>@ds052978.mlab.com:52978/<dbname>
  ```

- for local development, intall the `dotenv` package to read the variable(s) saved in the file.

  ```JS
  require('dotenv').config();
  ```

- connect the application through the `mongoose` package, once the dependency is required.

  ```JS
  const mongoose = require('mongoose');
  mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true });
  ```

### Schemas, models and documents

Before updating the routes set with the **express** package with **Mongoose**, it is necessary to include a couple of set-up instructions.

1. define the schema.

   ```JS
   const { Schema } = mongoose;
   const userSchema = new Schema({
     username: {
       type: String,
       required: true
     },
     log: [{
       description: {
         type: String,
         required: true
       },
       duration: {
         type: Number,
         required: true
       },
       date: {
         type: Date,
         required: true
       }
     }]
   });
   ```

1. define the model, on the basis of which all documents will be based.

   ```JS
   const User = mongoose.model('User', userSchema);
   ```

In the specific routes, and on the basis of the input values, the mongoose package can be then used to fulfill the application's purposes.

### Create & Read

In the **`/api/exercise/new-user`** path, the application needs to already create and save a document.

The document needs to be created **only if** an instance doesn't already exist with the same username.

A few considerations in this regard:

- `Model.findOne()` can be used to find an instance of the document in the database.

  It accepts as arguments an object, detailing the target's property value pairs, and a callback function, which is as the search is completed.

  ```JS
  User.findOne({
    username
  }, (err, data) => {
    // do something with the returned data
  });
  ```

  In the callback function, `data` manifests itself either as `null`, or an instance of the object matching the search.

- `document.save()` can be used to save a document in the database. It accepts as argument a callback function, which in the node convention allows to handle an error and then the return value. The return value in this instance is the saved document.

  ```JS
  user.save((err, data) => {
    // do something with the saved instance
  });
  ```

  Of course it is first necessary to create the instance, from the model itself.

  ```JS
  const user = new User({
    username,
    log: []
  });
  ```

In the **`/api/exercise/log`** path, the read operation is once more used to retrieve the user, according to the `userId`.

In the **`/api/exercise/add`** path, the application needs to instead leverage an updating function, to log the new exercise in the array of exercises. The `findOneAndUpdate()` function, or `findByIdAndUpdate()` can be used in this regard.

Given the novelty of the functions, here a few notes on its implementation:

- `findOneAndUpdate()` accepts several arguments, among which:

  1. the property-value pairs of the target object.

  1. an object detailing the properties to be updated. Specifically for the project, it is here necessary to **append** a value to a specific field. The simple construct detailing a property value pair:

  ```JS
  {
    log: newLog
  }
  ```

  would simply overwrite the existing value. To fix such an issue, it is possible to use the mongo `$push` command. This one allows to detail a value which will be **pushed**, appended to the specified property.

  For the project and path at hand, it materializes as follows:

  ```JS
  {
    $push: {
      log: newLog
    }
  }
  ```

  1. an object detailing additional options. In the instance of the project, such an object is used to let the function return the _updated_ object, and not the _found_ object, which is the default option.

  ```JS
  {
    new: true
  }
  ```

  1. a callback function, following the node convention and allowing to handle any error and the return value. This is where the particular project returns a response based on the updated value.

<!-- TODO: handle the query string in its entirety, including the optional values for **from** and **to** -->
