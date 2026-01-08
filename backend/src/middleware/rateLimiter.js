import ratelimit from "../config/upStash.js";


const rateLimiter = async(req,res,next)=>{
    try {
        const {success} = await ratelimit.limit("my-rate-limit");
        if(!success){
            return res.status(429).json({
                message:"Try again later,Too many request"
            })
        }
        next();
    } catch (error) {
        console.log("Error in rate limiter");
        next(error);
    }
}

export default rateLimiter;