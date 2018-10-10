// set up an express app
const port = 3000;
const express = require('express');
const app = express();

// render the stylesheet as found in the public folder
app.use(express.static(`${__dirname}/public`));

// EXPRESS && ROUTING
// in the root path render the HTML file as found in the views folder
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// listen in the selected port and render the simple application
app.listen(port);
console.log(`listening on port ${port}`);