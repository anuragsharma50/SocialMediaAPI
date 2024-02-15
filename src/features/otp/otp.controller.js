import otpGenerator from "otp-generator";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import OtpRepository from "./opt.repository.js";
import { customErrorHandler } from "../../middlewares/errorHandler.js";
import UserRepository from "../user/user.repository.js";

export default class OtpController {

    constructor() {
        this.otpRepository = new OtpRepository();
        this.userRepository = new UserRepository();
    }

    async sendOtp(req,res,next) {
        const {email} = req.body;
        const otp = otpGenerator.generate(6,{lowerCaseAlphabets:false,upperCaseAlphabets:false,specialChars:false});
        const resp = await this.otpRepository.sendOtp(email,otp);
        if(resp.success) {
            res.status(200).json(resp);
        }
        else{
            next(new customErrorHandler(resp.error.statusCode,resp.error.msg));
        }
    }

    async verifyOtp(req,res,next) {
        const {otp,email} = req.body;
        const resp = await this.otpRepository.verifyOtp(email,otp);
        if(resp.success) {
            const token = jwt.sign({userId:resp.res._id},process.env.JWT_SECRET, {
                expiresIn: '1h'
            })

            const updatedRes = await this.userRepository.addLoginToken(resp.res._id,token);
            res.cookie("jwtToken",token,{ maxAge: 1*60*60*1000, httpOnly:true })
            .json({
                success: true,
                msg: 'OTP matched successfully',
                res: updatedRes.res
            });
        }
        else{
            next(new customErrorHandler(resp.error.statusCode,resp.error.msg));
        }
    }

    async resetPassword(req,res,next) {
        const userId = req.userId;
        const { password } = req.body;
        let hashedPassword
        if(password){
            hashedPassword = await bcrypt.hash(password,12);
        }
        const resp = await this.otpRepository.resetPassword(userId,hashedPassword);
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