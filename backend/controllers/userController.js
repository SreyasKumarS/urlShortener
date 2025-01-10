import { UserService } from '../services/userService.js';

export class UserController {
    async register(req, res) {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        try {
            const message = await UserService.registerUser({ name, email, password });
            res.status(201).json({ message });
        } catch (error) {
            console.error('Error registering user');
            res.status(400).json({ message: error.message });
        }
    }

    async verifyOtp(req, res) {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ message: 'Email and OTP are required' });
        }

        try {
            const message = await UserService.verifyOtp(email, otp);
            res.status(200).json({ message });
        } catch (error) {
            console.error('Error verifying OTP');
            res.status(400).json({ message: error.message });
        }
    }

    async resendOtp(req, res) {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        try {
            const message = await UserService.resendOtp(email);
            res.status(200).json({ message });
        } catch (error) {
            console.error('Error resending OTP');
            res.status(400).json({ message: error.message });
        }
    }

    async login(req, res){
        
        const { email, password } = req.body;
      
        try {
            const result = await UserService.login(email, password, res);
            return res.status(200).json({
                message: 'Login successful',
                user: result.user,
                token: result.token,
            });
        } catch (error) {
            console.error('erro logging in');
            res.status(400).json({ message: error.message });
        }
      };

      
      async logout(req, res) {
        try {
          await UserService.logout(res); 
          return res.status(200).json({ message: 'Logout successful' }); 
        } catch (error) {
            console.error('erro logging in');
            res.status(400).json({ message: error.message });
        }
      }


      async shortenUrl(req, res) {
        
        const { url } = req.body;
    
        try {
          const shortUrl = await UserService.shortenUrl(url);
          const fullShortUrl = `${req.protocol}://${req.get('host')}/r/${shortUrl}`;
          
          res.status(201).json({ shortenedUrl: fullShortUrl });
        } catch (error) {
          res.status(400).json({ message: error.message });
        }
      }
    
      async redirect(req, res) {
        const { shortUrl } = req.params;
        console.log('Short URL received:', shortUrl);
      
        try {
          const originalUrl = await UserService.getOriginalUrl(shortUrl);
          res.redirect(originalUrl);
        } catch (error) {
          console.error('Error during redirection:', error.message);
          res.status(404).json({ message: error.message });
        }
      }
      


      async forgotPassword(req, res) {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        try {
            const message = await UserService.sendPasswordResetOtp(email);
            res.status(200).json({ message });
        } catch (error) {
            console.error('Error in forgotPassword:', error.message);
            res.status(400).json({ message: error.message });
        }
    }

    async resetPassword(req, res) {
      const { email, newPassword, confirmPassword } = req.body;

      if (newPassword !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
      }

        try {
            const message = await UserService.resetPassword(email,newPassword);
            res.status(200).json({ message });
        } catch (error) {
            console.error('Error in resetPassword:', error.message);
            res.status(400).json({ message: error.message });
        }
    }

}
