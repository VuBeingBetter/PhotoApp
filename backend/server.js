/**

 * To start the webserver run the command:
 *    nodemon server.js
 *
 * Note that anyone able to connect to localhost:portNo will be able to fetch
 * any file accessible to the current user in the current directory or any of
 * its children.
 *
 * This webServer exports the following URLs:
 * /            - Returns a text status message. Good for testing web server
 *                running.
 *
 * The following URLs need to be changed to fetch there reply values from the
 * database:
 * /user/list         - Returns an array containing all the User objects from
 *                      the database (JSON format).
 * /user/:id          - Returns the User object with the _id of id (JSON
 *                      format).
 * /photosOfUser/:id  - Returns an array with all the photos of the User (id).
 *                      Each photo should have all the Comments on the Photo
 *                      (JSON format).
 */

"use strict";

const express = require("express");
const app = express();
const session = require("express-session");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, '.env') });
const connectDB = require("./db");

// 1. Database connection
connectDB();

// 2. Middleware setup
app.use(bodyParser.json());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));

// 3. Static files and image serving
app.use("/images", express.static(__dirname + "/images"));
app.use(express.static(__dirname));

// 4. API Routes Mounting
const userRoutes = require("./routes/userRoutes");
const photoRoutes = require("./routes/photoRoutes");
app.use("/user", userRoutes);
app.use("/photo", photoRoutes);

// 5. Root endpoint
app.get("/", function (request, response) {
  response.send("PhotoShare API Server is running.");
});

// 6. Start the server
const server = app.listen(process.env.APP_PORT || 3000, function () {
  const port = server.address().port;
  console.log(
    "Listening at http://localhost:" + port
  );
});
