const router = require('express').Router();

const auth = require('../middleware/auth');

const { signUp, checkUser, logout, signIn, resetUserPassword, refreshToken, validateOtp, validateOtpToken, resendOtp } = require('../controllers/authController');
const validateSignup = require('../controllers/userController/Validations/validateSignup');

router.post('/resetPassword', resetUserPassword);

router.post('/sign-up',validateSignup, signUp);

router.post('/sign-in', signIn);

router.post('/refresh-token', refreshToken);

router.route('/validateOtp/:token')
    .get(validateOtpToken)
    .post(validateOtp);

router.route('/resendOtp/:token')
    .post(resendOtp);

//* Auth Middleware
//? Protected Routes After auth middleware

router.get('/logout', auth, logout);
router.get('/checkUser', auth, checkUser);


module.exports = router;