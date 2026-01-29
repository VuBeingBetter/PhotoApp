const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const { isAuthenticated } = require('../middleware/auth');

router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.post("/register", userController.register);
router.get('/list', isAuthenticated, userController.getUserList);
router.get('/:id', isAuthenticated, userController.getUserById);

module.exports = router;