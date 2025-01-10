import bcrypt from 'bcrypt';
import { UserRepository } from '../repository/userRepository.js';
import { sendEmail } from '../utils/sendEmail.js';
import {generateAccessToken,generateRefreshToken } from '../utils/userTokenGenerator.js'
import validator from 'validator';
import { nanoid } from 'nanoid';


export class UserService {
    static async registerUser({ name, email, password }) {
        try {
            const existingUser = await UserRepository.findByEmail(email);
            if (existingUser) {
                throw new Error('User with this email already exists');
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            const otpExpires = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes

            const newUser = {
                name,
                email,
                password: hashedPassword,
                otp,
                otpExpires,
            };

            await UserRepository.save(newUser);
            await sendEmail(email, 'Verify Your Account', `Your OTP is ${otp}`);

            return 'User registered successfully. OTP sent to your email.';
        } catch (error) {
            console.error('Error in UserService:', error.message);
            throw new Error(error.message || 'Failed to register user');
        }
    }

    static async verifyOtp(email, otp) {
        try {
            const user = await UserRepository.findByEmail(email);

            if (!user) {
                throw new Error('User not found');
            }

            if (user.otpExpires < Date.now()) {
                throw new Error('OTP has expired');
            }

            if (otp !== user.otp) {
                throw new Error('Invalid OTP');
            }

            user.otp = null; // Clear OTP after successful verification
            user.otpExpires = null; // Clear expiry time
            await UserRepository.update(user);

            return 'OTP verified successfully. Registration complete.';
        } catch (error) {
            console.error('Error in verifyOtp:', error.message);
            throw new Error(error.message || 'OTP verification failed');
        }
    }

    static async resendOtp(email) {
        try {
            const user = await UserRepository.findByEmail(email);

            if (!user) {
                throw new Error('User not found');
            }

            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            const otpExpires = Date.now() + 10 * 60 * 1000;

            user.otp = otp;
            user.otpExpires = otpExpires;
            await UserRepository.update(user);
            await sendEmail(email, 'Resend OTP', `Your new OTP is ${otp}`);

            return 'OTP resent successfully.';
        } catch (error) {
            console.error('Error in resendOtp:', error.message);
            throw new Error(error.message || 'Failed to resend OTP');
        }
    }




    static async login(email, password, res) { 

        try {
           
            const user = await UserRepository.findByEmail(email);
            if (!user) {
                throw new Error('Invalid email or password');
            }
    
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                throw new Error('Invalid email or password');
            }
    
            const accessToken = generateAccessToken(user);
            generateRefreshToken(user, res);
    
            return {
                  user: {
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                },
                token: accessToken,
            };
        } catch (err) {
            console.error("Error during login:", err);
            throw new Error("Login failed. Please try again.");
        }
    }    

    static async logout(res) { 
        try {
          res.cookie('refreshToken', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            expires: new Date(0), 
          });
        } catch (error) {
          throw new Error('Failed to log out: ' + error.message);
        }
      };


    
    static  async shortenUrl(originalUrl) {
        console.log('entred url sav srvcccccccccc');
        
        originalUrl = originalUrl.trim();
        if (!validator.isURL(originalUrl)) {
          throw new Error('Invalid URL format');
        }
    
        const shortUrl = nanoid(8); 
        await UserRepository.saveUrl(originalUrl, shortUrl);
        return shortUrl;
      }
    
      static async getOriginalUrl(shortUrl) {
        console.log('Finding original URL for:', shortUrl);
      
        const urlData = await UserRepository.findUrlByShort(shortUrl);
        if (!urlData) {
          throw new Error('Short URL not found');
        }
        console.log('Found URL data:', urlData);
      
        return urlData.originalUrl;
      }



      static async sendPasswordResetOtp(email) {
        try {
            const user = await UserRepository.findByEmail(email);

            if (!user) {
                throw new Error('User not found');
            }

            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            const otpExpires = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes

            user.otp = otp;
            user.otpExpires = otpExpires;

            await UserRepository.update(user);
            await sendEmail(email, 'Password Reset OTP', `Your OTP is ${otp}`);

            return 'OTP sent to your email for password reset.';
        } catch (error) {
            console.error('Error in sendPasswordResetOtp:', error.message);
            throw new Error(error.message || 'Failed to send password reset OTP');
        }
    }

    static async resetPassword(email,newPassword) {
        try {
            const user = await UserRepository.findByEmail(email);

            if (!user ) {
                throw new Error('User not found');
              }

              const salt = await bcrypt.genSalt(10);
              const hashedPassword = await bcrypt.hash(newPassword, salt);
              user.password = hashedPassword; 
              await user.save();
            
        } catch (error) {
            console.error('Error in resetPassword:', error.message);
            throw new Error(error.message || 'Failed to reset password');
        }
    }
      


}
