import mongoose from "mongoose";
import { likeSchema } from "./like.schema.js";
import { postModel } from "../post/post.schema.js";

const likeModel = mongoose.model('like',likeSchema);

export default class LikeRepository {

    async toggleLikes(likeable,userId,on_model) {
        try {
            let like = await likeModel.findOne({likeable:likeable,on_model:on_model,user:userId});
            if(!like) {
                like = await new likeModel({likeable:likeable,on_model:on_model,user:userId})
                like.save();
                return {
                    success: true,
                    res: like,
                    msg: `${on_model} liked successfully`
                }
            }
            else{
                await likeModel.findByIdAndDelete(like._id);
                like = null;
                return {
                    success: true,
                    res: like,
                    msg: `${on_model} unliked successfully`
                }
            }

        } catch (err) {
            return {
                success: false,
                error:{
                    statusCode: 400,
                    msg: err
                }
            }
        }
    }

    async getLikes(likeable) {
        try {
            let on_model;
            const post = await postModel.findById(likeable);
            if(post) {
                on_model = 'Post'
            }else{
                on_model = 'Comment'
            }

            const likes = await likeModel.find({likeable:likeable,on_model:on_model}).populate('user',{password:0,logins:0});

            return {
                success: true,
                res: likes
            }
        } catch (err) {
            return {
                success: false,
                error:{
                    statusCode: 400,
                    msg: err
                }
            }
        }
    }

}
