import mongoose from "mongoose";
import { postModel } from "./post.schema.js";

export default class PostRepository {
    async add(postData) {
        try {
            const newPost = new postModel(postData);
            const savedPost = await newPost.save();
            return {
                success: true,
                res: savedPost
            }
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

    async getOnePost(postId) {
        try {
            const post = await postModel.findById(postId);
            return {
                success: true,
                res: post
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

    async getPosts(userId) {
        try {
            const posts = await postModel.find({user:userId});
            return {
                success: true,
                res: posts
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

    async getAllPosts() {
        try {
            const posts = await postModel.find({});
            return {
                success: true,
                res: posts
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

    async deletePost(postId,userId) {
        try {
            const post = await postModel.findOneAndDelete({_id:postId,user:userId});

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
                success: true
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

    async updatePost(postId,updates) {
        try {
            const post = await postModel.findOneAndUpdate({_id:postId, user: updates.user}, {
                ...updates
            },{
                returnDocument:'after'
            });

            if(!post) {
                return {
                    success: false,
                    error: {
                        statusCode: 404,
                        msg: "Post not found"
                    }
                }
            }
            
            return { success: true, res: post }
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
