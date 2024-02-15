import express from 'express';
import FriendshipController from './friendship.controller.js';

const friendshipRouter = express.Router();

const friendshipController = new FriendshipController();

friendshipRouter.get('/get-friends/:userId',(req,res,next) => {
    friendshipController.getUserFriends(req,res,next);  
})

friendshipRouter.get('/get-pending-requests',(req,res,next) => {
    friendshipController.pendingRequests(req,res,next);  
})

friendshipRouter.get('/toggle-friendship/:friendId',(req,res,next) => {
    friendshipController.toggleFriendship(req,res,next);  
})

friendshipRouter.get('/response-to-request/:friendId',(req,res,next) => {
    friendshipController.acceptRejectFriendship(req,res,next);  
})

export default friendshipRouter;
