"use strict";

var path = require("path"),
  express = require("express"),
  http = require("http"),
  cors = require("cors"),
  port = process.env.PORT || 9000,
  bodyParser = require("body-parser");

module.exports = function() {
  var app = express();

  function ignoreFavicon(req, res, next) {
    if (req.originalUrl === "/favicon.ico") {
      res.status(204).json({ nope: true });
    } else {
      next();
    }
  }

  // Middlewares
  app.use(cors());
  app.use(express.static(path.join(__dirname, "../public")));

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(ignoreFavicon);

  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  var server = http.createServer(app).listen(port, function() {
    console.log(`Server started on port-->${port}`);
  });

  return app;
};
