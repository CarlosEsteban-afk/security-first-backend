const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/signup', authController.signup);
router.post('/confirm-signup', authController.confirmSignup);
router.post('/login', authController.login);
router.post('/respond-challenge', authController.respondChallenge);
router.post('/forgot-password', authController.forgotPassword);
router.post('/confirm-forgot-password', authController.confirmForgotPassword);
router.get('/me', authController.getProfile); 

module.exports = router;
