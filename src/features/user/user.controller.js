import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserRepository from "./user.repository.js";
import { customErrorHandler } from "../../middlewares/errorHandler.js";

export default class UserController {

    constructor() {
        this.userRepository = new UserRepository();
    }

    async signup(req,res,next) {
        const {name,email,password,gender} = req.body;
        const hashedPassword = await bcrypt.hash(password,12);
        const resp = await this.userRepository.signup({name,email,password:hashedPassword,gender});
        if(resp.success) {
            res.status(201).json({
                success: true,
                msg: 'User Signup successfully',
                res: resp.res
            });
        }
        else{
            next(new customErrorHandler(resp.error.statusCode,resp.error.msg));
        }
        
    }

    async signin(req,res,next) {
        const {email,password} = req.body;
        const resp = await this.userRepository.signin(email,password);

        if(resp.success) {
            const token = jwt.sign({userId:resp.res._id},process.env.JWT_SECRET, {
                expiresIn: '1h'
            })

            const updatedRes = await this.userRepository.addLoginToken(resp.res._id,token);
            res.cookie("jwtToken",token,{ maxAge: 1*60*60*1000, httpOnly:true })
            .json({
                success: true,
                msg: 'Login successful',
                res: updatedRes.res
            });
        }
        else{
            next(new customErrorHandler(resp.error.statusCode,resp.error.msg));
        }
    }

    async logout(req,res,next) {
        const userId = req.userId;
        const token = req.token;
        console.log(token);
        const resp = await this.userRepository.logout(userId,token);
        if(resp.success) {
            res.clearCookie("jwtToken").json({
                success:true,
                msg: 'Logged out successfully'
            })
        }
        else{
            next(new customErrorHandler(resp.error.statusCode,resp.error.msg));
        }
    }

    async logoutAll(req,res,next) {
        const userId = req.userId;
        const resp = await this.userRepository.logoutAll(userId);
        if(resp.success) {
            res.clearCookie("jwtToken").json({
                success:true,
                msg: 'Logged out from all devices'
            })
        }
        else{
            next(new customErrorHandler(resp.error.statusCode,resp.error.msg));
        }
    }

    async getDetails(req,res,next) {
        const userId = req.params.userId;
        const resp = await this.userRepository.getUserDetails(userId);
        if(resp.success) {
            res.status(200).json({
                success:true,
                res:resp.res
            })
        }
        else{
            next(new customErrorHandler(resp.error.statusCode,resp.error.msg));
        }
    }

    async getAllDetails(req,res,next) {
        const resp = await this.userRepository.getAllUsers();
        if(resp.success) {
            res.status(200).json({
                success:true,
                res:resp.res
            })
        }
        else{
            next(new customErrorHandler(resp.error.statusCode,resp.error.msg));
        }
    }

    async updateDetails(req,res,next) {
        const userId = req.params.userId;
        const { password } = req.body;
        if(password){
            return next(new customErrorHandler(400,"please use reset password endpoint to update password"));
        }
        const resp = await this.userRepository.updateUser(userId,req.body);
        if(resp.success) {
            res.status(200).json({
                success:true,
                res:resp.res
            })
        }
        else{
            next(new customErrorHandler(resp.error.statusCode,resp.error.msg));
        }
    }

}