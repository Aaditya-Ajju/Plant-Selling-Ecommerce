const mongoose = require('mongoose');

const bcryptjs = require('bcryptjs');

const validator = require('validator');

const jwt = require('jsonwebtoken');
const { encryptMessage } = require('../../utils/cryptoUtil');


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        minlength: 3,
    },
    email: {
        type: String,
        required: [true, "Email address is required"],
        unique: true, 
        validate(email) {
            if (!validator.isEmail(email)) {
                throw new Error("Invalid Email");
            }
        }
    },
    phone: {
        type: String,
        required: [true, "Phone number is required"],
        unique: true,
        validate(phone) {
            if (!validator.isMobilePhone(phone, 'en-IN')) {
                throw new Error("Invalid Phone");
            }
        }
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    role: {
        type: [String],
        default: ["user"]
    },
    isUserVerified: {
        type: Boolean,
        default: false
    },
    isTwoFactorAuthEnabled: {
        type: Boolean,
        default: false
    },
    avatar: {
        public_id: {
            type: String,
        },
        url: {
            type: String,
        }
    },
    avatarList: [{
        public_id: {
            type: String,
        },
        url: {
            type: String,
        }
    }],
    gender: {
        type: String,
        required: [true, "Gender is required"],
    },
    age: {
        type: Number,
        required: [true, "Age is required"],
        validate(age) {
            if (!(age >= 18 && age <= 100)) {
                throw new Error("Invalid Age");
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
});

// generating the JWT Tokens 
userSchema.methods.generateAuthToken = async function () {
    try {
        // Convert hex secret keys to Buffer
        const accessSecret = Buffer.from(process.env.ACCESS_SECRET_KEY, 'hex');
        const refreshSecret = Buffer.from(process.env.REFRESH_SECRET_KEY, 'hex');

        // generate the access token
        const accessToken = jwt.sign({_id: this._id.toString()}, accessSecret, { expiresIn: "15m" });

        // generate the refresh token 
        const refreshToken = jwt.sign({ _id: this._id.toString() }, refreshSecret, { expiresIn: "7d" });
        
        // Store the unencrypted refresh token in the database
        this.tokens = this.tokens.concat({ token: refreshToken });
        await this.save();

        // Encrypt the refresh token for sending to client
        const encryptedRefreshToken = encryptMessage(refreshToken);
        
        console.log("Raw Refresh Token (JWT):", refreshToken);
        console.log("Encrypted Refresh Token Object:", encryptedRefreshToken);

        if (!encryptedRefreshToken || !encryptedRefreshToken.encryptedMessage || !encryptedRefreshToken.iv) {
            throw new Error("Failed to encrypt refresh token");
        }

        return { 
            refreshToken: encryptedRefreshToken,
            accessToken
        };
    } catch (err) {
        console.error("JWT Sign Error:", err);
        throw new Error("Failed to generate authentication tokens");
    }
}

userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        const salt = await bcryptjs.genSalt(10);
        this.password = await bcryptjs.hash(this.password, salt);
    }
    next();
})




const user = new mongoose.model('user', userSchema);

module.exports = user;