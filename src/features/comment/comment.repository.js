import mongoose from "mongoose";
import { commentSchema } from "./comment.schema.js";
import { postModel } from "../post/post.schema.js";

const commentModel = mongoose.model('comment',commentSchema);

export default class CommentRepository {

    async addComment(postId,userId,content) {
        try {
            // Find post by id, if not found return error, else add comment to db, then attach comment to post 
            const post = await postModel.findById(postId);

            if(!post) {
                return {
                    success: false,
                    error: {
                        statusCode: 404,
                        msg: "Post not found"
                    }
                }
            }

            const comment = new commentModel({content:content,post:postId,user:userId});
            await comment.save();

            post.comments.push(comment._id);
            await post.save();

            return {
                success:true,
                res: comment
            }
        } catch (err) {
            return {
                success: false,
                error: {
                    statusCode: 400,
                    msg: err
                }
            }
        }
    }

    async getComments(postId) {
        try {
            const post = await postModel.findById(postId).populate('comments');

            if(!post) {
                return {
                    success: false,
                    error: {
                        statusCode: 404,
                        msg: "Post not found"
                    }
                }
            }

            return {
                success: true,
                res: post.comments
            }

        }catch (err) {
            return {
                success: false,
                error: {
                    statusCode: 400,
                    msg: err
                }
            }
        }
    }

    async updateComment(commentId,userId,content) {
        try {
            const comment = await commentModel.findOneAndUpdate({_id:commentId,user:userId}, {
                content: content
                },
                {
                    returnDocument:'after'
                }
            );

            if(!comment) {
                return {
                    success: false,
                    error: {
                        statusCode: 404,
                        msg: "Comment not found"
                    }
                }
            }

            return {
                success:true,
                res: comment
            }
        } catch (err) {
            return {
                success: false,
                error: {
                    statusCode: 400,
                    msg: err
                }
            }
        }
    }

    async deleteComment(userId,commentId) {
        try {
            const comment = await commentModel.findOneAndDelete({_id:commentId, user:userId});

            if(!comment) {
                return {
                    success: false,
                    error: {
                        statusCode: 404,
                        msg: "Comment not found"
                    }
                }
            }

            const post = await postModel.findById(comment.post);
            const indx = post.comments.indexOf(comment._id);
            post.comments.splice(indx,1);
            await post.save();
            return {
                success:true
            }
        } catch (err) {
            return {
                success: false,
                error: {
                    statusCode: 400,
                    msg: err
                }
            }
        }
    }

}

