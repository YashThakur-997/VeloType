let router = require('express').Router();
let { login_handler, signup_handler ,logout_handler } = require('../controllers/controller.auth');
let { loginvalidation, signupvalidation } = require('../middlewares/auth.validation');


router.post('/login', loginvalidation, login_handler);

router.post('/signup', signupvalidation, signup_handler);

router.post('/logout', logout_handler);

module.exports = router;