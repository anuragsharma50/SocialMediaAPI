import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { userSchema } from "./user.schema.js";

const userModel = mongoose.model('user',userSchema);

export default class UserRepository {

    async signup(user) {
        try {
            const newUser = new userModel(user);
            await newUser.save();
            return { success: true, res:newUser };
        } catch (err) {
            console.log(err);
            return {
                success: false,
                error: {
                    statusCode: 400,
                    msg: err
                }
            }
        }
    }

    async signin(email,password) {
        try {
            const user = await userModel.findOne({email});

            if(!user) {
                // throw new Error("Invalid Credentials");
                return { success:false,error: {statusCode:404, msg: 'Invalid Email'} }
            }
            const checkPassword = await bcrypt.compare(password,user.password);

            if(!checkPassword) {
                // throw new Error("Incorrect Password");
                return { success:false,error: {statusCode:400, msg: 'Incorrect Password'} }
            }

            return {success:true,res:user};
        } catch (err) {
            console.log(err);
            return { success:false,error: {statusCode:400, msg: err} }
        }
    }

    async addLoginToken(userId,token) {
        try {
            const user = await userModel.findById(userId);
            user.logins.push(token);
            await user.save();
            return {success:true,res:user};
        } catch (err) {
            console.log(err);
            return { success:false,error: {statusCode:400, msg: err} }
        }
    }

    async verifyToken(userId,token) {
        try {
            const user = await userModel.findById(userId);
            const verify = user.logins.includes(token);
            if(verify) {
                return {success:true};
            }
            else{
                return { success:false,error: {statusCode:404, msg: "token not found"} }
            }
        } catch (err) {
            console.log(err);
            return { success:false,error: {statusCode:400, msg: err} }
        }
    }

    async logout(userId,token) {
        try {
            const user = await userModel.findById(userId);
            const index = user.logins.indexOf(token);
            user.logins.splice(index, 1);
            // user.logins.push(token);
            const updatedUser = await user.save();
            return {success:true};
        } catch (err) {
            console.log(err);
            return { success:false,error: {statusCode:400, msg: err} }
        }
    }

    async logoutAll(userId) {
        try {
            const user = await userModel.findById(userId);
            user.logins = [];
            await user.save();
            return {success:true};
        } catch (err) {
            console.log(err);
            return { success:false,error: {statusCode:400, msg: err} }
        }
    }

    async getUserDetails(userId) {
        try {
            const user = await userModel.findOne({_id:userId},{password:0,logins:0});
            return {success:true,res:user};
        } catch (err) {
            console.log(err);
            return { success:false,error: {statusCode:400, msg: err} }
        }
    }

    async getAllUsers() {
        try {
            const users = await userModel.find({},{password:0,logins:0});
            // return users;
            return {success:true,res:users};
        } catch (err) {
            console.log(err);
            return { success:false,error: {statusCode:400, msg: err} }
        }
    }

    async updateUser(userId, updates) {
        try {
            const user = await userModel.findByIdAndUpdate(userId,
                {
                    ...updates
                },
                {returnDocument:'after'}
                );
            return {success:true,res:user};
        } catch (err) {
            console.log(err);
            return { success:false,error: {statusCode:400, msg: err} }
        }
    }

}


