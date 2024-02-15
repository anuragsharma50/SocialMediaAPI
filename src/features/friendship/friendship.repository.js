import mongoose from "mongoose";
import { friendshipSchema } from "./friendship.schema.js";

const friendshipModel = mongoose.model('friendship',friendshipSchema);

export default class FriendshipRepository {

    async getUserFriends(user) {
        try {
            // const friendships = await friendshipModel.find({$or:[{user1:user},{user2:user}],isAccepted:true}).populate('user1',{password:0,logins:0}).populate('user2',{password:0,logins:0});
            let friendships = await friendshipModel.find({user1:user,isAccepted:true}).populate('user2',{password:0,logins:0});
            friendships.push(await friendshipModel.find({user2:user,isAccepted:true}).populate('user1',{password:0,logins:0}));
            return {
                success: true,
                res: friendships,
            }
        } catch (err) {
            return {
                success:false,
                error: {
                    statusCode: 400,
                    msg: err
                }
            }
        }
    }

    async pendingRequests(user) {
        try {
            const requests = await friendshipModel.find({user2:user,isAccepted:false}).populate('user1',{password:0,logins:0});
            return {
                success: true,
                res: requests,
            }
        } catch (err) {
            return {
                success:false,
                error: {
                    statusCode: 400,
                    msg: err
                }
            }
        }
    }

    async toggleFriendship(user,friend) {
        try {
            const friendRequest = await friendshipModel.findOne({user1:user,user2:friend,isAccepted:false});
            if(!friendRequest){
                const newRequest = new friendshipModel({user1:user,user2:friend});
                await newRequest.save();
                return {
                    success: true,
                    res: newRequest,
                    msg: 'Friend request sent successfully'
                }
            }
            else{
                await friendshipModel.findByIdAndDelete(friendRequest._id);
                return {
                    success: true,
                    res: null,
                    msg: 'Request Unsent'
                }
            }
        } catch (err) {
            return {
                success:false,
                error: {
                    statusCode: 400,
                    msg: err
                }
            }
        }
    }

    async acceptRejectFriendship(user,friend,status) {
        try {
            if(status == "accept"){
                const request = await friendshipModel.findOne({user1:friend,user2:user,isAccepted:false});
                if(!request) {
                    return {
                        success:false,
                        error: {
                            statusCode: 404,
                            msg: "Request not found"
                        }
                    }
                }
                request.isAccepted = true;
                await request.save();
                return {
                    success: true,
                    res: request,
                    msg: 'Request Accepted'
                }
            }
            // it will also go to rejected, if incorrect value is provided for status
            else{
                await friendshipModel.findOneAndDelete({user1:friend,user2:user,isAccepted:false});
                return {
                    success: true,
                    res: null,
                    msg: 'Request Rejected'
                }
            }
        } catch (err) {
            return {
                success:false,
                error: {
                    statusCode: 400,
                    msg: err
                }
            }
        }
    }

}

