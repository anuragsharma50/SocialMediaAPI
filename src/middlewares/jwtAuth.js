import jwt from 'jsonwebtoken';
import UserRepository from '../features/user/user.repository.js';

export const auth = async (req,res,next) => {
    const { jwtToken } = req.cookies;
    const secretKey = process.env.JWT_SECRET

    jwt.verify(jwtToken,secretKey, async (err,data) => {
        if(err){
            res.status(400).send("UnAuthorized! Please login to continue");
        }
        else{

            const userRepository = new UserRepository();
            const result = await userRepository.verifyToken(data.userId,jwtToken);

            if(!result.success) {
                return res.status(400).send("UnAuthorized! Please login");
            }

            req.userId = data.userId;
            req.token = jwtToken;
            next();
        }
    })
} 