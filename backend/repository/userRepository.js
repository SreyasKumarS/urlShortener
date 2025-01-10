import User from '../models/userModel.js';
import URL from '../models/urlModel.js'

export class UserRepository {
    static async findByEmail(email) {
        try {
            return await User.findOne({ email });
        } catch (error) {
            console.error('Error finding user by email:', error.message);
            throw new Error('Database query failed');
        }
    }

    static async save(user) {
        try {
            const newUser = new User(user);
            return await newUser.save();
        } catch (error) {
            console.error('Error saving user:', error.message);
            throw new Error('Failed to save user to database');
        }
    }

    static async update(user) {
        try {
            return await User.findByIdAndUpdate(user._id, user, { new: true });
        } catch (error) {
            console.error('Error updating user:', error.message);
            throw new Error('Failed to update user');
        }
    }


    static async saveUrl(originalUrl, shortUrl) { 
        const url = new URL({ originalUrl, shortUrl });
        const savedUrl = await url.save();
        return savedUrl;
      }
      
    
      static async findUrlByShort(shortUrl) {
        console.log('Searching DB for short URL:', shortUrl);
      
        const urlData = await URL.findOne({ shortUrl });
        console.log('DB search result:', urlData);
      
        return urlData;
      }
      







}
