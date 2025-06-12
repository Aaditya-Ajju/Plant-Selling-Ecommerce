require('dotenv').config();
const cloudinary = require('cloudinary').v2;

console.log("CLOUDINARY_NAME:", process.env.CLOUDINARY_NAME ? "Loaded" : "Undefined/Null");
console.log("CLOUDINARY_API_KEY:", process.env.CLOUDINARY_API_KEY ? "Loaded" : "Undefined/Null");
console.log("CLOUDINARY_API_SECRET:", process.env.CLOUDINARY_API_SECRET ? "Loaded" : "Undefined/Null");

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});

module.exports = cloudinary;