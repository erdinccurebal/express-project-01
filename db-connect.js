const mongoose = require("mongoose");

// Database connect
mongoose.connect(
  "mongodb+srv://sende-paylas:547547@ec007.sgzp8.gcp.mongodb.net/sende-paylas?retryWrites=true&w=majority",
  { useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false},
  (error) => {
    if (!error) {
      console.log("Connected to Mongoose Database.");
    } else console.log('Failed to connect !!!', 'Error: ' + error)
  }
);