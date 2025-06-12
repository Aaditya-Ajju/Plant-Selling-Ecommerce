// jsonwebtoken to generate secret
const jwt = require('jsonwebtoken');

// import the model for user 
const userModel = require('../model/userModel/user');
const nurseryModel = require('../model/nurseryModel/nursery');


const auth = async (req, res, next) => {
    try {
        // Skip authentication for sign-up and sign-in routes
        if (req.path === '/api/v2/auth/sign-up' || req.path === '/api/v2/auth/sign-in') {
            return next();
        }

        //? request to the browser for the cookies 
        //? Remove the cookie based authentication and implemented the Bearer authentication in the headers 
        // const token = req.cookies.auth;

        const authHeader = req.headers['authorization'];
        console.log("Auth Header for", req.originalUrl, ":", authHeader);

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.log("Authentication failed for:", req.originalUrl, "(Missing or invalid Bearer header)");
            const error = new Error("Authentication failed");
            error.statusCode = 403;
            throw error;
        }

        const token = authHeader.split(' ')[1];
        console.log("Extracted Token for", req.originalUrl, ":", token);

        //! if the token is null
        if (token === null || token === undefined || token === "" || token === "null" || token === "undefined" || token === "") {
            console.log("Authentication failed (token null/undefined) for:", req.originalUrl);
            const error = new Error("Authentication failed");
            error.statusCode = 403;
            throw error;
        };

        // Convert hex secret key to Buffer for verification
        const accessSecret = Buffer.from(process.env.ACCESS_SECRET_KEY, 'hex');
        console.log("Access Secret Key Length in Auth Middleware:", accessSecret.length);
        console.log("Access Secret Key in Auth Middleware:", process.env.ACCESS_SECRET_KEY);

        //? verify the jwt token and return the document id 
        const verifyUser = jwt.verify(token, accessSecret);
        console.log("verifyUser result for", req.originalUrl, ":", verifyUser);

        if(!verifyUser) {
            console.log("Authentication failed (invalid verifyUser) for:", req.originalUrl);
            const error = new Error("Authentication failed!");
            error.statusCode = 403;
            throw error;
        }

        //? find the right user from the database 
        const user = await userModel.findOne({ _id: verifyUser._id }).select({ _id: 1, role: 1, isUserVerified: 1 });
        console.log("User found in DB for", req.originalUrl, ":", user ? user._id : "Not Found");

        //! if user not found
        if (!user) {
            console.log("Authentication failed (user not found) for:", req.originalUrl);
            const error = new Error("Authentication failed");
            error.statusCode = 403;
            throw error;
        }

        //! if user is not verified
        if (!user.isUserVerified) {
            console.log("Authentication failed (user not verified) for:", req.originalUrl);
            const error = new Error("Your Account is not verified please login and verify your account");
            error.statusCode = 403;
            throw error;
        }

        req.token = token;
        req.user = user._id;
        req.role = user.role;

        if (req.role.includes("seller")) {
            const nursery = await nurseryModel.findOne({ user: user._id }).select({ _id: 1 });
            req.nursery = nursery._id;
        }

        next();

    } catch (error) {
        console.error("Auth Middleware Catch Error for:", req.originalUrl, ":", error);
        next(error); //! Pass the error to the error handling middleware
    }

}



module.exports = auth;