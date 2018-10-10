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
