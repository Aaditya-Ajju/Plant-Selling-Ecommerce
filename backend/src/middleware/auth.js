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

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            const error = new Error("Authentication failed");
            error.statusCode = 403;
            throw error;
        }

        const token = authHeader.split(' ')[1];

        //! if the token is null
        if (!token || token === "null" || token === "undefined") {
            const error = new Error("Authentication failed");
            error.statusCode = 403;
            throw error;
        };

        // Convert hex secret key to Buffer for verification
        const accessSecret = Buffer.from(process.env.ACCESS_SECRET_KEY, 'hex');

        //? verify the jwt token and return the document id 
        const verifyUser = jwt.verify(token, accessSecret);

        if(!verifyUser) {
            const error = new Error("Authentication failed!");
            error.statusCode = 403;
            throw error;
        }

        //? find the right user from the database 
        const user = await userModel.findOne({ _id: verifyUser._id }).select({ _id: 1, role: 1, isUserVerified: 1 });

        //! if user not found
        if (!user) {
            const error = new Error("Authentication failed");
            error.statusCode = 403;
            throw error;
        }

        //! if user is not verified
        if (!user.isUserVerified) {
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