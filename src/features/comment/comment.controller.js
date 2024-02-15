import { customErrorHandler } from "../../middlewares/errorHandler.js";
import CommentRepository from "./comment.repository.js";


export default class CommentController {

    constructor () {
        this.commentRepository = new CommentRepository();
    }

    async addComment(req,res,next) {
        const postId = req.params.postId;
        const content = req.body.content;
        const userId = req.userId;
        const resp = await this.commentRepository.addComment(postId,userId,content);
        if(resp.success) {
            res.status(201).json({
                success: true,
                res: resp.res,
                msg: 'Comment added successfully'
            });
        }
        else{
            next(new customErrorHandler(resp.error.statusCode,resp.error.msg));
        }
    }

    async getComments(req,res,next) {
        const postId = req.params.postId;
        const resp = await this.commentRepository.getComments(postId);
        if(resp.success) {
            res.status(200).json(resp);
        }
        else{
            next(new customErrorHandler(resp.error.statusCode,resp.error.msg));
        }
    }

    async updateComment(req,res,next) {
        const commentId = req.params.commentId;
        const content = req.body.content;
        const userId = req.userId;
        const resp = await this.commentRepository.updateComment(commentId,userId,content);
        if(resp.success) {
            res.status(201).json({
                success: true,
                res: resp.res,
                msg: 'Comment updated successfully'
            });
        }
        else{
            next(new customErrorHandler(resp.error.statusCode,resp.error.msg));
        }
    }

    async deleteComment(req,res,next) {
        const commentId = req.params.commentId;
        const userId = req.userId;
        const resp = await this.commentRepository.deleteComment(userId,commentId);
        if(resp.success) {
            res.status(201).json({
                success: true,
                msg: 'Comment deleted successfully'
            });
        }
        else{
            next(new customErrorHandler(resp.error.statusCode,resp.error.msg));
        }
    }

}