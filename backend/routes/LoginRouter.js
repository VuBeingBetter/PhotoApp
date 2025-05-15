const express = require("express");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const router = express.Router();

const verifyToken = require("../middleware/verifyToken");
const User = require("../db/userModel");

router.post("/", async (request, response) => {
    // Đăng bài
});

router.post("/login", async (request, response) => {
    if (request.body) {
      //console.log('Request body:', request.body);
      const { username, password } = request.body;
      
      try {
        const oneUser = await User.findOne({username: username});
        if(oneUser){
          const verifyPassword = await argon2.verify(oneUser.password, password);
          
          if (verifyPassword) {
            jwt.sign(
              { oneUser }, 
              process.env.secretKey, 
              { expiresIn: "1h" }, 
              (err, token) => {
                if (err) {
                  response.status(501).send("Error generating token");
                } else {
                  response.status(200).json({ token });
                }
              }
            );
          } else {
            response.status(500).send("Wrong password");
          }
        }
        else{
          response.status(404).send("User not found");
        }
  
      } catch (error){
        response.status(500).send(error);
      }
    }
    else {
      console.error("No request body found!");
      response.status(400).send("Bad Request: Missing request body");
    }
});

router.post("/register", async(request, response) => {
    // Sign-up
});

router.get("/", async (request, response) => {
    try {
        const users = await User.find({});
        response.send(users);
    } catch (error) {
        response.status(500).send({ error });
    }
});

module.exports = router;