import express from 'express';
import UserController from './user.controller.js';
import { auth } from '../../middlewares/jwtAuth.js';

const userRouter = express.Router();

const userController = new UserController();

userRouter.post('/signup',(req,res,next) => {
    userController.signup(req,res,next);
})

userRouter.post('/signin',(req,res,next) => {
    userController.signin(req,res,next);
})

userRouter.get('/logout', auth, (req,res,next) => {
    userController.logout(req,res,next);
})

userRouter.get('/logout-all-devices', auth, (req,res,next) => {
    userController.logoutAll(req,res,next);
})

userRouter.get('/get-details/:userId', auth, (req,res,next) => {
    userController.getDetails(req,res,next);
})

userRouter.get('/get-all-details', auth, (req,res,next) => {
    userController.getAllDetails(req,res,next);
})

userRouter.put('/update-details/:userId', auth, (req,res,next) => {
    userController.updateDetails(req,res,next);
})

export default userRouter;
