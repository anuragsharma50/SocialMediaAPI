import mongoose from "mongoose";
import { OtpModel } from "./otp.schema.js";
import { userSchema } from "../user/user.schema.js";

const userModel = mongoose.model('user',userSchema);

export default class OtpRepository {

    async sendOtp(email,otp) {
        try {
            const user = await userModel.findOne({email});
            if(!user) {
                return { success:false,error: {statusCode:404, msg: "No user exist with this email,please signup"} }
            }
            
            const newOTP = new OtpModel({email,otp});
            await newOTP.save();
            console.log(newOTP);
            return {
                success: true,
                msg: 'OTP sent successfully'
            }
        } catch (err) {
            return { success:false,error: {statusCode:400, msg: err} }
        }
    }

    async verifyOtp(email,otp) {
        try {
            const findOTP = await OtpModel.findOne({email,otp});
            if(findOTP) {
                const user = await userModel.findOne({email});
                if(!user) {
                    return { success:false, error: {statusCode:400, msg: "No user exist with this email,please signup"} };
                }
                return {
                    success: true,
                    msg: 'OTP matched successfully',
                    res: user
                }
            }
            else{
                return { success:false, error: {statusCode:400, msg: "Invalid OTP"} };
            }
        } catch (err) {
            return { success:false,error: {statusCode:400, msg: err} }
        }
    }

    async resetPassword(userId,password) {
        try {
            const user = await userModel.findByIdAndUpdate(userId, {password},
                {returnDocument:'after'}
            );
            return {success:true,res:user};
        } catch (err) {
            return { success:false,error: {statusCode:400, msg: err} }
        }
    }

}