
export class customErrorHandler extends Error {
    constructor(statusCode,message){
        super(message);
        this.statusCode = statusCode;
        Error.captureStackTrace(this,this.constructor);
    }
}

export const appLevelErrorHandlerMiddleware = (err,req,res,next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || 'Server Error! Please try again later';
    res.status(err.statusCode).json({success:false,error:err.message})
    // next();
}