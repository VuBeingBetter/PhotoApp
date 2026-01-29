const User = require('../models/User');
const { doesPasswordMatch } = require('../utils/passwordUtils');

/**
 * URL /login
 * Allows a user to login.
 */
exports.login = async (req, res) => {
    const { login_name, password } = req.body;
    try {
        // Find the user by login_name
        const user = await User.findOne({ login_name: login_name });
        if (!user) {
            console.log("User with login_name:" + login_name + " not found.");
            return res.status(400).send("User not found");
        }
        // Check password
        if (!doesPasswordMatch(user.password, user.salt, password)) {
            console.log("Incorrect password for user:", login_name);
            return res.status(400).send("Incorrect password");
        }
        // Password matches, create session
        req.session.user = {
            _id: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
        };
        // Send back the user object as confirmation of successful login
        return res.status(200).send(user.toObject());
    } catch (error) {
        // Any database errors are caught here
        res.status(500).send("Internal Server Error");
    }
};

/**
 * URL /logout
 * Allows a user to logout.
 */
exports.logout = (req, res) => {
    // Destroy the session
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send("Could not log out.");
        } else {
            return res.status(200).send("Logged out successfully.");
        }
    });
};

/**
 * URL /register
 * Allows a new user to register.
 */
exports.register = async (req, res) => {
    const { login_name, password, first_name, last_name, location, description, occupation } = req.body;

    // 1. Validate required fields
    if (!login_name || !password || !first_name || !last_name) {
        return res.status(400).send("Missing required fields (Login Name, Password, First Name, Last Name)");
    }

    // 2. Check if login_name already exists
    try {
        const existingUser = await User.findOne({ login_name: login_name });
        if (existingUser) {
            return res.status(400).send("Login Name already taken");
        }
        } catch (err) {
            console.error("Error checking existing user:", err);
            return res.status(500).send("Internal Server Error");
    }
    
    // 3. Create the new user
    // Note: We are storing the password in plain text to match the "weak" security
    // model established by the loadDatabase.js script.
    try {
        const newUser = await User.create({
            login_name,
            password,
            first_name,
            last_name,
            location,
            description,
            occupation,
        });
        return res.status(200).send(newUser.toObject());
    } catch (err) {
        console.error("Error creating new user:", err);
        return res.status(500).send("Internal Server Error: Could not create user");
    }
};

/**
 * URL /user/list - Returns all the User objects.
 */
exports.getUserList = async (req, res) => {
    // Use the User model to find all users.
    // We select only the _id, first_name, and last_name fields
    // to match the data structure of the old fake model.
    try {
        const userList = await User.find({}, "_id first_name last_name");
        if (userList.length === 0) {
            return res.status(500).send("Missing User data");
        }
        return res.status(200).send(userList);
    } catch (err) {
        console.error("Error in finding user list: ", err);
        return res.status(500).send(JSON.stringify(err));
    }
};

/**
 * URL /user/:id - Returns the information for User (id).
 */
exports.getUserById = async (req, res) => {
    const id = req.params.id;
    try {
        const user = await User.findById(id, "-password");
        if (!user) {
            console.log("User with _id:" + id + " not found.");
            return res.status(400).send("Not found");
        }
        return res.status(200).send(user.toObject());
    } catch (err) {
        console.error("Error in finding user by id:", err);
        return res.status(500).send(JSON.stringify(err));
    }
}

