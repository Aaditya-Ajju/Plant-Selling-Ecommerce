require('dotenv').config();
const mongoose = require('mongoose');

mongoose.set("strictQuery", false);

const DB = process.env.MONGO_URI;

console.log("MongoDB URI from .env: ", DB);

mongoose.connect(DB, {
    useNewUrlParser: true,
}).then(() => {
    console.log("connection successful!...");
}).catch((err) => {
    console.log(`connection failed!.... ${err}`);
});
