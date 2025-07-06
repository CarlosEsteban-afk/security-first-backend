const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/signup', authController.signup);
router.post('/confirm-signup', authController.confirmSignup);
router.post('/resend-confirmation', authController.resendConfirmation);
router.post('/login', authController.login);
router.post('/respond-challenge', authController.respondChallenge);
router.post('/forgot-password', authController.forgotPassword);
router.post('/confirm-forgot-password', authController.confirmForgotPassword);
router.get('/me', authController.getProfile); 

router.post('/setup-mfa', authController.setupMfa);
router.post('/verify-mfa', authController.verifyMfa);
router.post('/enable-mfa', authController.enableMfa);

module.exports = router;
