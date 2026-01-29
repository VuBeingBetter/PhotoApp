const express = require('express');
const router = express.Router();
const path = require('path');
const photoController = require('../controllers/photoController');
const { isAuthenticated } = require('../middleware/auth');
const multer = require('multer');
const { ensureDirectoryExists } = require('../utils/fileSystem');

// Run this once at startup to ensure images directory exists
ensureDirectoryExists({ path: path.join(__dirname, '/../images') });

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '/../images'));
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

// Routes
router.get('/photosOfUser/:id', isAuthenticated, photoController.getPhotosOfUser);
router.post('/commentToPhoto/:photoId', isAuthenticated, photoController.addCommentToPhoto);
// Middleware 'upload.single' is used to handle single file upload with field name 'photo'
router.post('/new', isAuthenticated, upload.single('photo'), photoController.uploadPhoto);

module.exports = router;