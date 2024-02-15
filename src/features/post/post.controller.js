import fs from "fs";
import path, {dirname} from "path";
import { fileURLToPath } from 'url';
import PostRepository from "./post.repository.js";
import { customErrorHandler } from "../../middlewares/errorHandler.js";

export default class PostController {

    constructor () {
        this.postRepository = new PostRepository();
    }

    async addPost(req,res,next) {
        const postData = {
            caption: req.body.caption,
            imageUrl: {
                data: fs.readFileSync(path.join(dirname(fileURLToPath(import.meta.url)),"../../../",'/uploads/' + req.file.filename)),
                contentType: req.file.mimetype
            },
            user: req.userId
        }
        const resp = await this.postRepository.add(postData);
        if(resp.success) {
            return res.status(201).json({
                success: true,
                // res: `data:image/${resp.res.imageUrl.contentType};base64,${resp.res.imageUrl.data.toString('base64')}`
                res: resp.res,
                msg: 'Post added successfully'
            });
        }
        else{
            next(new customErrorHandler(resp.error.statusCode,resp.error.msg));
        }
        // return res.status(200).json("wait");
    }

    async getOnePost(req,res,next) {
        const postId = req.params.postId;
        const resp = await this.postRepository.getOnePost(postId);
        if(resp.success) {
            res.status(200).json({
                success: true,
                res: resp.res
            })
        }
        else{
            next(new customErrorHandler(resp.error.statusCode,resp.error.msg));
        }
    }

    async getPosts(req,res,next) {
        const userId = req.userId;
        const resp = await this.postRepository.getPosts(userId);
        if(resp.success){
            return res.status(200).json(resp);
        }else{
            next(new customErrorHandler(resp.error.statusCode,resp.error.msg));
        }
    }

    async getAllPosts(req,res,next) {
        const resp = await this.postRepository.getAllPosts();
        if(resp.success){
            return res.status(200).json({
                success: true,
                res: resp.res
            });
        }else{
            next(new customErrorHandler(resp.error.statusCode,resp.error.msg));
        }
    }

    async deletePost(req,res,next) {
        const postId = req.params.postId;
        const userId = req.userId;
        const resp = await this.postRepository.deletePost(postId,userId);
        if(resp.success) {
            res.status(200).json({
                success: true,
                msg: 'Post deleted successfully'
            })
        }
        else{
            next(new customErrorHandler(resp.error.statusCode,resp.error.msg));
        }
    }

    async updatePost(req,res,next) {
        const postId = req.params.postId;
        const postData = {};

        if(req.file) {
            postData.imageUrl = {
                data: fs.readFileSync(path.join(dirname(fileURLToPath(import.meta.url)),"../../../",'/uploads/' + req.file.filename)),
                contentType: req.file.mimetype
            }
        }

        const caption = req.body.caption;
        if(caption) {
            postData.caption = caption;
        }

        if(postData.caption || postData.imageUrl) {
            postData.user = req.userId
        }

        const resp = await this.postRepository.updatePost(postId,postData);
        if(resp.success) {
            res.status(200).json({
                success: true,
                res: resp.res,
                msg: 'Post updated successfully'
            })
        }
        else{
            next(new customErrorHandler(resp.error.statusCode,resp.error.msg));
        }
    }

}