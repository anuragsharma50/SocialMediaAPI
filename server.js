import express from 'express';
import cookieParser from "cookie-parser"
// import dotenv from 'dotenv'; - dotenv will config in db import

import {connectUsingMongoose} from './src/config/db.js';
import userRouter from './src/features/user/user.routes.js';
import { appLevelErrorHandlerMiddleware } from './src/middlewares/errorHandler.js';
import postRouter from './src/features/post/post.routes.js';
import commentRouter from './src/features/comment/comment.routes.js';
import likeRouter from './src/features/like/like.routes.js';
import friendshipRouter from './src/features/friendship/friendship.routes.js';
import otpRouter from './src/features/otp/otp.routes.js';
import { auth } from './src/middlewares/jwtAuth.js';

// dotenv.config();

const app = express();
app.use(cookieParser());
app.use(express.json());

// Routes
app.use('/api/users',userRouter);
app.use('/api/posts', auth, postRouter);
app.use('/api/comments',auth, commentRouter);
app.use('/api/likes', auth, likeRouter);
app.use('/api/friends', auth, friendshipRouter);
app.use('/api/otp', otpRouter);

// To return validation error as response
app.use(appLevelErrorHandlerMiddleware);

// 404 response
app.use((req,res) => {
    res.status(404).send("API not found");
})

const PORT = process.env.PORT || 8000

app.listen(PORT,() => {
    console.log(`Server is up and running on port ${PORT}`);
    connectUsingMongoose();
})
