const express = require('express');
const app = express();
const port = 8000;

const cookieParser = require('cookie-parser');

// Imports files in routes folder
const routePosts = require('./routes/posts.js')
const routeComments = require('./routes/comments.js')
const routeSignup = require('./routes/users.js')

const router = require('./routes/posts.js');


// Body parser middleware
app.use(express.json())

// Cookie parser
app.use(cookieParser())

app.use("/api", express.urlencoded({extended: false}), [routePosts, routeComments, routeSignup])

app.use(express.static("assets"));

// Opens the express server
app.listen(port, () => {
    console.log(port, '포트로 서버가 열렸어요!');
  });