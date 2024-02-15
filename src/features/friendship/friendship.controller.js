import { customErrorHandler } from "../../middlewares/errorHandler.js";
import FriendshipRepository from "./friendship.repository.js";

export default class FriendshipController {

    constructor() {
        this.friendshipRepository = new FriendshipRepository();
    }

    async getUserFriends(req,res,next) {
        // taking userId from params, so anyone can see user friends
        const userId = req.params.userId;
        const resp = await this.friendshipRepository.getUserFriends(userId);
        if(resp.success) {
            res.status(200).json(resp);
        }
        else{
            next(new customErrorHandler(resp.error.statusCode,resp.error.msg));
        }
    }

    async pendingRequests(req,res,next) {
        const userId = req.userId;
        const resp = await this.friendshipRepository.pendingRequests(userId);
        if(resp.success) {
            res.status(200).json(resp);
        }
        else{
            next(new customErrorHandler(resp.error.statusCode,resp.error.msg));
        }
    }

    async toggleFriendship(req,res,next) {
        const userId = req.userId;
        const friendId = req.params.friendId;
        if(userId == friendId){
            return next(new customErrorHandler(400,"Cannot send friend request to yourself"));
        }
        const resp = await this.friendshipRepository.toggleFriendship(userId,friendId);
        if(resp.success) {
            res.status(200).json(resp);
        }
        else{
            next(new customErrorHandler(resp.error.statusCode,resp.error.msg));
        }
    }

    async acceptRejectFriendship(req,res,next) {
        const userId = req.userId;
        const friendId = req.params.friendId;
        const confirm = req.query.confirm;
        if(userId == friendId){
            return next(new customErrorHandler(400,"Cannot send friend request to yourself"));
        }
        const resp = await this.friendshipRepository.acceptRejectFriendship(userId,friendId,confirm);
        if(resp.success) {
            res.status(200).json(resp);
        }
        else{
            next(new customErrorHandler(resp.error.statusCode,resp.error.msg));
        }
    }

}
