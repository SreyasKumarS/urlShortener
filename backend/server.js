import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import connectDB from './config/db.js';


dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser()); 
app.use(express.json());




import userRoutes from './routes/userRoutes.js';
app.use('/users', userRoutes);
app.use('/', userRoutes); 


connectDB();


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started listening on port ${PORT}`);
});
