const express = require("express");
const {ObjectId} = require("mongodb");

const User = require("../db/userModel");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");

router.post("/", async (request, response) => {
  // Đăng người dùng
});

router.get("", verifyToken, async (request, response) => {
  try {
    const allUsers = await User.find({});
    // console.log(allUsers);
    response.json(allUsers);
  } catch (error) {
    response.status(500).send(error);
  }
});

router.get("/detail", verifyToken, async (request, response) => {
  const id = request.query.userId;
  const objectid = new ObjectId(id);
  try {
    const userDetail = await User.findOne({_id: objectid});
    response.json(userDetail);
  } catch (error) {
    response.status(500).send(error); 
  }
});

module.exports = router;
