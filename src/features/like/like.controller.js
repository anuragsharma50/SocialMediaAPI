import { customErrorHandler } from "../../middlewares/errorHandler.js";
import LikeRepository from "./like.repository.js";


export default class LikeController {

    constructor() {
        this.likeRepository = new LikeRepository();
    }

    async toggleLikes(req,res,next) {
        const type = req.query.type;
        const id = req.params.id;
        const userId = req.userId;
        const resp = await this.likeRepository.toggleLikes(id,userId,type);
        if(resp.success){
            res.status(200).json({
                success: true,
                res: resp.res,
                msg: resp.msg
            })
        }
        else{
            next(new customErrorHandler(resp.error.statusCode,resp.error.msg));
        }
    }

    async getLikes(req,res,next) {
        const id = req.params.id;
        const resp = await this.likeRepository.getLikes(id);
        if(resp.success){
            res.status(200).json({
                success: true,
                res: resp.res
            })
        }
        else{
            next(new customErrorHandler(resp.error.statusCode,resp.error.msg));
        }
    }

}
