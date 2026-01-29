const Photo = require("../models/photo");
const User = require("../models/User");

exports.getPhotosOfUser = async (req, res) => {
    const id = req.params.id;
    try {
        // Find all photos for user
        // .lean() gets plain JS objects, which are faster and easier to modify
        const photos = await Photo.find({ user_id: id }).lean().exec();
        // If this user has no photos, return empty array
        if (!photos || photos.length === 0) {
            return res.status(200).send([]);
        }

        // Process each photo to populate user details in comments
        // Use Promise.all and map() to handle asynchronously
        await Promise.all(photos.map(async (photo) => {
            if (photo.comments && photo.comments.length > 0) {
                // For each comment, fetch the user details
                await Promise.all(photo.comments.map(async (comment) => {
                    const commenter = await User.findById(comment.user_id, "_id first_name last_name");
                    if (commenter) comment.user = commenter;
                }));
            };
        }));
        return res.status(200).send(photos);
    
    } catch (err) {
        console.error("Error in getPhotosByUser:", err);
        return res.status(500).send("Internal Server Error");
    }

};

/**
 * URL /photos/new
 * Uploads a new photo for the logged-in user.
 */
exports.uploadPhoto = async (req, res) => {
    // upload.single middleware processes the file upload
    // File details are in request file
    if (!req.file) {
        return res.status(400).send("Bad Request: No file uploaded");
    }
    try {
        const photo = await Photo.create({
            file_name: req.file.filename,
            date_time: new Date(),
            user_id: req.session.user._id,
            comments: [],
            // Add the description if provided
            description: req.body.description || "",
        });
        return res.status(200).send(photo.toObject());
    } catch (err) {
        console.error("Error creating photo in DB:", err);
        return res.status(500).send("Internal Server Error");
    }
};

/**
 * URL /commentsOfPhoto/:photo_id
 * Adds a new comment to the photo with the given ID.
 */
exports.addCommentToPhoto = async (req, res) => {
    // Get photo ID from URL params
    const photo_id = req.params.photo_id;
    // Get comment text from request body
    const { comment } = req.body;
    if (!comment) {
        return res.status(400).send("Bad Request: Comment text is required");
    }
    // Get logged-in user ID from session
    const loggedInUserId = req.session.user._id;
    
    try {
        // Find the photo by ID
        const photo = await Photo.findById(photo_id);
        if (!photo) {
            console.log("Photo with _id:" + photo_id + " not found.");
            return res.status(404).send("Photo not found");
        }
        // Create new comment object
        const newComment = {
            comment: comment,
            date_time: new Date(),
            user_id: loggedInUserId
        };
        // Add comment to photo's comments array
        photo.comments.push(newComment);
        // Save the updated photo
        try {
            await photo.save();
            return res.status(200).send(photo);
        } catch (saveErr) {
            console.error("Error saving new comment to photo:", saveErr);
            return res.status(500).send("Internal Server Error");
        }
    } catch (err) {
        console.error("Error finding photo by ID:", err);
        return res.status(500).send("Internal Server Error");
    }
};