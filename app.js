const express = require('express');
const app = express();
const port = 8000;

// Imports files in routes folder
const routePosts = require('./routes/posts.js')
const routeComments = require('./routes/comments.js')

// Imports index.js files in schemas folder
const connect = require("./schemas");
// Connect to Mongoose defined in index.js
connect();

app.use(express.json())

app.use("/api", [routePosts, routeComments])

// Opens the express server
app.listen(port, () => {
    console.log(port, '포트로 서버가 열렸어요!');
  });