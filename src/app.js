const express = require("express");
const app = express();

const flips= require('./data/flips-data');//reads, executes, and returns the data from the flips-data.js file
const counts= require('./data/counts-data');//reads, executes, and returns the data from the counts-data.js file
// TODO: Follow instructions in the checkpoint to implement ths API.
//api endpoint for new records. 
app.use(express.json());//allows to parse request body as json. 

app.use('/counts/:countId', (req, res, next) => {
  const {countId} = req.params;
  const foundCount = counts[countId];
  if (foundCount === undefined) {//counts may be 0, a falsy value, you must check if the value is undefined
    next(`Count id not found: ${countId}`);
  } else {
    res.json({ data: foundCount });//return the count as json
  }
});

app.use('/counts', (req, res) => {
  res.json({ data: counts });
});




app.use('/flips/:flipId', (req, res, next) => {//defines a handler for the /flips/:flipId path.
  const { flipId } = req.params;//defines flipId by destructuring the req.params object.
  const foundFlip = flips.find((flip) => flip.id === Number(flipId));
  if(foundFlip) {
    res.json({ data: foundFlip });
  } else {
    next(`Flip id not found: ${flipId}`);
  }
});
//changing to app.get allows to get the data from the flips-data.js file. Handler will only be called if a get request
app.get('/flips', (req, res) => {//defines a handler for the /flips path.
  res.json({ data: flips });
});
//handler for post requests to /flips comes after the .get
// Variable to hold the next ID
// Because some IDs may already be used, find the largest assigned ID
let lastFlipId = flips.reduce((maxId, flip) => Math.max(maxId, flip.id), 0);

app.post("/flips", (req, res, next) => {
  const { data: { result } = {} } = req.body;//standard destructuring syntax. 
  const newFlip = {
    id: ++lastFlipId, // Increment last ID, then assign as the current ID
    result,
  };
  flips.push(newFlip);
  counts[result] = counts[result] + 1; // Increment the counts (heads, tails or edge)
  res.json({ data: newFlip }); //sends the new response to the client
});

// Not found handler
app.use((request, response, next) => {
  next(`Not found: ${request.originalUrl}`);
});

// Error handler
app.use((error, request, response, next) => {
  console.error(error);
  response.send(error);
});

module.exports = app;
