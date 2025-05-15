const express = require("express");
const {ObjectId} = require("mongodb");
const Photo = require("../db/photoModel");
const verifyToken = require("../middleware/verifyToken");
const router = express.Router();

router.post("/", verifyToken, async (request, response) => {
  // Đăng bài
});

router.post("/comment", verifyToken, async (request, response) => {
  const photoId = request.query.photoId;
  const comment = request.body.comment;
  const user_id = request.body.user_id;
  try {
    const commentPhoto = await Photo.findOne({_id: photoId });
    console.log(commentPhoto);
    if(commentPhoto){
      commentPhoto.comments.push({comment, user_id});
      await commentPhoto.save();

      const theComment = await Photo.findOne({_id: photoId }).populate({
        path: "comments.user_id", 
        model: "Users"
      });
      console.log(theComment);
      response.status(200).json({message: "Comment received", data: theComment});
    }
    else{
      response.status(404).json("Photo not found");
    }
  } catch (error) {
    response.status(500).send(error);
  }
});

router.get("", verifyToken, async (request, response) => {
  const id = request.query.userId;
  const objectid = new ObjectId(id);
  try {
    const photo = await Photo.find({ user_id: objectid }).populate({
      path: "comments.user_id", 
      model: "Users"
    });
    response.json(photo);
  } catch (error) {
    response.status(500).send(error);
  }
});

module.exports = router;
