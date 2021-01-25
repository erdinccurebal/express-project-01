// Main modules
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Database connect
require('./db-connect');

// Server port
const port = process.env.PORT || 3000;

// Express application
const app = express();

// Express application import
app.use(bodyParser.json());
app.use(cors());

// Routes function
const routes = require('./routes/index');
routes(app);

// Default Page
app.use('', (req, res) => {
    res.status(200).send();
});

// Express listen
app.listen(port, (err) => {
    if (err) {
        console.log('Error: ' + err);
    } else
        console.log('Port: ' + port + ' Express server listening...');
});