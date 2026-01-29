const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, '.env') });

const mongoURI = process.env.MONGO_URI;

const connectDB = async () => {
    try {
        mongoose.set("strictQuery", false);
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    
    }
};

module.exports = connectDB;