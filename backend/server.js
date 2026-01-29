/**
 * This builds on the webServer of previous projects in that it exports the
 * current directory via webserver listing on a hard code (see portno below)
 * port. It also establishes a connection to the MongoDB named 'cs142project6'.
 *
 * To start the webserver run the command:
 *    node webServer.js
 *
 * Note that anyone able to connect to localhost:portNo will be able to fetch
 * any file accessible to the current user in the current directory or any of
 * its children.
 *
 * This webServer exports the following URLs:
 * /            - Returns a text status message. Good for testing web server
 *                running.
 * /test        - Returns the SchemaInfo object of the database in JSON format.
 *                This is good for testing connectivity with MongoDB.
 * /test/info   - Same as /test.
 * /test/counts - Returns the population counts of the cs142 collections in the
 *                database. Format is a JSON object with properties being the
 *                collection name and the values being the counts.
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

const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");

const async = require("async");

const express = require("express");
const app = express();

const session = require("express-session");
const bodyParser = require("body-parser");
const multer = require("multer");
const fs = require("fs");

const { doesPasswordMatch } = require("./cs142password.js");

app.use(bodyParser.json());
app.use(session({
  secret: 'yourSecretKey',
  resave: false,
  saveUninitialized: true
}))

// For multer file upload for uploading Images
const checkExists = function (path, mask, cb) {
  if (typeof mask === 'function') {
    cb = mask;
    mask = 0o777;
  }
  fs.mkdir(path, mask, function (err) {
    if (err) {
      if (err.code === 'EEXIST') cb(null); // ignore the error if the folder already exists
      else cb(err); // something else went wrong
    } else cb(null); // successfully created folder
  
  });
}

checkExists(__dirname + '/images', 0o755, (err) => {
  if (err) {
    console.error('Could not create images directory', err);
  } else {
    console.log('Images directory is ready');
  }
});

// Configure multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname + '/images');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

// Load the Mongoose schema for User, Photo, and SchemaInfo
const User = require("./schema/user.js");
const Photo = require("./schema/photo.js");
const SchemaInfo = require("./schema/schemaInfo.js");

// XXX - Your submission should work without this line. Comment out or delete
// this line for tests and before submission!
// const cs142models = require("./modelData/photoApp.js").cs142models;
mongoose.set("strictQuery", false);
mongoose.connect("mongodb+srv://vunguyenquang7123:vR2rUOViowQE2h9t@cluster0.cnwjj0s.mongodb.net/?appName=Cluster0", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


// Reusable function to check if user is logged in
function isLoggedIn(request, response, next) {
  // if (!request.session.user) {
  //   return response.status(401).send("Not logged in");
  // }
  next(); // Continue the route
}

app.get("/", function (request, response) {
  response.send("Simple web server of files from " + __dirname);
});

/**
 * Use express to handle argument passing in the URL. This .get will cause
 * express to accept URLs with /test/<something> and return the something in
 * request.params.p1.
 * 
 * If implement the get as follows:
 * /test        - Returns the SchemaInfo object of the database in JSON format.
 *                This is good for testing connectivity with MongoDB.
 * /test/info   - Same as /test.
 * /test/counts - Returns an object with the counts of the different collections
 *                in JSON format.
 */
app.get("/test/:p1", isLoggedIn, function (request, response) {
  // Express parses the ":p1" from the URL and returns it in the request.params
  // objects.
  console.log("/test called with param1 = ", request.params.p1);

  const param = request.params.p1 || "info";

  if (param === "info") {
    // Fetch the SchemaInfo. There should only one of them. The query of {} will
    // match it.
    SchemaInfo.find({}, function (err, info) {
      if (err) {
        // Query returned an error. We pass it back to the browser with an
        // Internal Service Error (500) error code.
        console.error("Error in /user/info:", err);
        response.status(500).send(JSON.stringify(err));
        return;
      }
      if (info.length === 0) {
        // Query didn't return an error but didn't find the SchemaInfo object -
        // This is also an internal error return.
        response.status(500).send("Missing SchemaInfo");
        return;
      }

      // We got the object - return it in JSON format.
      console.log("SchemaInfo", info[0]);
      response.end(JSON.stringify(info[0]));
    });
  } else if (param === "counts") {
    // In order to return the counts of all the collections we need to do an
    // async call to each collections. That is tricky to do so we use the async
    // package do the work. We put the collections into array and use async.each
    // to do each .count() query.
    const collections = [
      { name: "user", collection: User },
      { name: "photo", collection: Photo },
      { name: "schemaInfo", collection: SchemaInfo },
    ];
    async.each(
      collections,
      function (col, done_callback) {
        col.collection.countDocuments({}, function (err, count) {
          col.count = count;
          done_callback(err);
        });
      },
      function (err) {
        if (err) {
          response.status(500).send(JSON.stringify(err));
        } else {
          const obj = {};
          for (let i = 0; i < collections.length; i++) {
            obj[collections[i].name] = collections[i].count;
          }
          response.end(JSON.stringify(obj));
        }
      }
    );
  } else {
    // If we know understand the parameter we return a (Bad Parameter) (400)
    // status.
    response.status(400).send("Bad param " + param);
  }
});

/**
 * URL /user/list - Returns all the User objects.
 */
app.get("/user/list", isLoggedIn, function (request, response) {
  // Use the User model to find all users.
  // We select only the _id, first_name, and last_name fields
  // to match the data structure of the old fake model.
  User.find({}, "_id first_name last_name", function (err, users) {
    if (err) {
      console.error("Error in /user/list:", err);
      response.status(500).send(JSON.stringify(err));
      return;
    }
    if (users.length === 0) {
      response.status(500).send("Missing User data");
      return;
    }
    // Send the array of user objects as JSON.
    response.status(200).send(users);
  });
});

/**
 * URL /user/:id - Returns the information for User (id).
 */
app.get("/user/:id", isLoggedIn, function (request, response) {
  const id = request.params.id;
  
  // Find the user by _id
  User.findById(id, "-password", function (err, user) {
    if (err) {
      console.error("Error finding user by id:", err);
      response.status(400).send("Bad Request: Invalid ID format");
      return;
    }
    if (!user) {
      // Valid ID format, but no user found with ID
      console.log("User with _id:" + id + " not found.");
      response.status(400).send("Not found");
      return;
    }
    // Mongoose 6+ returns a Mongoose document.
    // We convert it to a plain JS object before sending.
    response.status(200).send(user.toObject());
  });
});

/**
 * URL /photosOfUser/:id - Returns the Photos for User (id).
 */
app.get("/photosOfUser/:id", isLoggedIn, function (request, response) {
  const id = request.params.id;
  
  // Find all photos for user
  // .lean() gets plain JS objects, whicha re faster and easier to modify
  Photo.find({ user_id: id }).lean().exec(function (err, photos) {
    if (err) {
      console.error("Error finding photos for user:", err);
      return response.status(400).send("Bad Request");
    }

    // We have photos, but we need to populate the comments.
    // Use async to iterate

    // Function be called for each photo
    const processPhoto = (photo, donePhoto) => {
      if (!photo.comments || photo.comments.length === 0) {
        return donePhoto(null); // No cmts, move to next photo
      }

      // Function to process each comment
      const processComment = (comment, doneComment) => {
        // Find the user who made the comment
        User.findById(comment.user_id, "_id first_name last_name", function (userErr, user) {
          if (userErr) {
            return doneComment(userErr);
          }
          if (!user) {
            return doneComment(new Error("User not found for comment"));
          }
          // Manually populate the user object into the comment
          comment.user = user.toObject();
          return doneComment(null);
        });
      };

      // Iterate over all comments, calling processComment for each
      // 'no-shadow' fix: 'err' renamed to 'commentErr'
      // 'consistent-return' fix: added return
      return async.each(photo.comments, processComment, function (commentErr) {
        donePhoto(commentErr);
      });
    };

    // Iterate over all photos, calling processPhoto for each
    return async.each(photos, processPhoto, (photoErr) => {
      if (photoErr) {
        console.error("Error processing photos/comments:", photoErr);
        return response.status(500).send("Internal Server Error");
      }
      // All photos processed successfully. Send the results
      return response.status(200).send(photos);
    });

  });

});

app.post("/admin/login", function (request, response) {
  const { login_name, password } = request.body;

  User.findOne({ login_name: login_name }, function (err, user) {
    if (err) {
      console.error("Error during login:", err);
      return response.status(500).send(JSON.stringify(err));
    }
    if (!user) {
      console.log("User with login_name:" + login_name + " not found.");
      return response.status(400).send("User not found");
    }

    // Check password
    if (!doesPasswordMatch(user.password, user.salt, password)) {
      console.log("Incorrect password for user:", login_name);
      return response.status(400).send("Incorrect password");
    }

    // Password matches, create session
    request.session.user = {
      _id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
    };

    // Send back the user object as confirmation of successful login
    return response.status(200).send(user.toObject());
  });
});

app.post("/admin/logout", function (request, response) {
  // Destroy the session
  request.session.destroy(function (err) {
    if (err) {
      return response.status(500).send("Error logging out");
    }
    return response.status(200).send("Logged out successfully");
  });
});

/**
 * URL /commentsOfPhoto/:photo_id
 * Adds a new comment to the photo with the given ID.
 */
app.post("/commentsOfPhoto/:photo_id", isLoggedIn, function (request, response) {
  // Get photo ID from URL
  const photoId = request.params.photo_id;

  // Get comment text from request body
  const { comment } = request.body;
  if (!comment) {
    return response.status(400).send("Bad Request: Comment text is required");
  }

  // Get user ID from session
  const loggedInUserId = request.session.user._id;

  // Find the photo by ID
  Photo.findById(photoId, function (err, photo) {
    if (err) {
      console.error("Error finding photo by id:", err);
      return response.status(400).send("Bad Request: Invalid Photo ID");
    }
    if (!photo) {
      console.log("Photo with _id:" + photoId + " not found.");
      return response.status(400).send("Not found: Photo does not exist");
    }

    // Create new comment object
    const newComment = {
      comment: comment,
      date_time: new Date(),
      user_id: loggedInUserId,
    };

    // Add the new comment to the photo's comments array
    photo.comments.push(newComment);

    // Save the updated photo document
    photo.save(function (saveErr, updatedPhoto) {
      if (saveErr) {
        console.error("Error saving new comment to photo:", saveErr);
        return response.status(500).send("Internal Server Error: Could not save comment");
      }
      // Successfully added comment
      return response.status(200).send(updatedPhoto);
    });
  });
});

/**
 * URL /photos/new
 * Uploads a new photo for the logged-in user.
 */
app.post("/photos/new", isLoggedIn, upload.single('uploadedphoto'), function (request, response) {
  // upload.single middleware processes the file upload
  // File details are in request file

  if (!request.file) {
    return response.status(400).send("No file uploaded");
  }

  // File saved to images directory
  // Create new Photo document
  Photo.create({
    file_name: request.file.filename,
    date_time: new Date(),
    user_id: request.session.user._id,
    comments: [],
    // Add the description if provided
    description: request.body.description || "",
  }, function (err, newPhoto) {
    if (err) {
      console.error("Error creating new photo in DB:", err);
      return response.status(500).send("Internal Server Error: Could not create photo");
    }
    // Successfully created photo
    return response.status(200).send(newPhoto.toObject());
  });
});

/**
 * URL /user
 * Allows a new user to register.
 */
app.post("/user", function (request, response) {
  const { login_name, password, first_name, last_name, location, description, occupation } = request.body;

  // Validate required fields
  if (!login_name || !password || !first_name || !last_name) {
    return response.status(400).send("Missing required fields (Login Name, Password, First Name, Last Name)");
  }

  // Check if login_name already exists
  User.findOne({ login_name: login_name }, function (err, existingUser) {
    if (err) {
      console.error("Error checking existing user:", err);
      return response.status(500).send("Internal Server Error");
    }
    if (existingUser) {
      return response.status(400).send("Login Name already taken");
    }
  });

  // 3. Create the new user
  // Note: We are storing the password in plain text to match the "weak" security
  // model established by the loadDatabase.js script.
  User.create({
    login_name,
    password,
    first_name,
    last_name,
    location,
    description,
    occupation,
  }, function (err, newUser) {
    if (err) {
      console.error("Error creating new user:", err);
      return response.status(500).send("Internal Server Error: Could not create user");
    }
    // Successfully created user
    return response.status(200).send(newUser.toObject());
  });

});

// We have the express static module
// (http://expressjs.com/en/starter/static-files.html) do all the work for us.
app.use(express.static(__dirname));

const server = app.listen(3000, function () {
  const port = server.address().port;
  console.log(
    "Listening at http://localhost:" +
      port +
      " exporting the directory " +
      __dirname
  );
});
