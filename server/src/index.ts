import express from 'express';
import 'dotenv/config';
import { router as authRoutes } from './modules/auth/auth.route';
import { router as postRoutes } from './modules/post/post.routes';
import { router as userRoutes } from './modules/user/user.route';
import cookieParser from 'cookie-parser';
import { configurePassport } from './config/passport';
import cors from 'cors';
import passport from 'passport';

configurePassport();

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

//express middleware which parses incoming JSON data from req into json object and stored in req.body
app.use(express.json());

//parses application/form-data only (converts string into js notation)
app.use(express.urlencoded({ extended: true }));

//middleware for cookies
app.use(cookieParser());

// Initialize Passport
app.use(passport.initialize());

app.use("/api/auth", authRoutes);

app.use("/api/user", userRoutes);

app.use("/api/post", postRoutes);


const PORT = 4000;

app.listen(PORT, async () => {
    console.log(`Server is listening on port ${PORT}`);
});