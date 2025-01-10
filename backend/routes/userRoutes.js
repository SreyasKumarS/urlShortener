import { Router } from 'express';
import { UserController } from '../controllers/userController.js';
import { authenticate } from '../utils/middlewareAccessToken.js';

const userController = new UserController();

const router = Router();
router.post('/register', userController.register);
router.post('/verify-otp', userController.verifyOtp);
router.post('/resend-otp', userController.resendOtp);

router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.post('/forgot-password', userController.forgotPassword);
router.post('/reset-password', userController.resetPassword);

router.post('/shorten-url',authenticate,userController.shortenUrl);
router.get('/r/:shortUrl',userController.redirect);



export default router;
