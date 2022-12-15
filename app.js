const express = require('express');
const app = express();
const port = 8000;

// Imports routes folder
// const routeIndex = require('./routes/index.js')
const routePosts = require('./routes/posts.js')
const routeComments = require('./routes/comments.js')

// Imports all files in schemas folder
const connect = require("./schemas");
// Execute all files in schemas folder
connect();

app.use(express.json())

app.use("/api", [routePosts, routeComments])

// Opens the express server
app.listen(port, () => {
    console.log(port, '포트로 서버가 열렸어요!');
  });