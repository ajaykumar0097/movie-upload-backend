import jwt from "jsonwebtoken"
import {prisma} from "../config/db.js"

//Read the JWT token from the cookie and verify it, if valid, extract the user information and attach it to the request object for use in the controllers.
//Check if the token is present in the cookies

const authMiddleware=async (req,res,next)=>{
    
    let token;    

    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        token=req.headers.authorization.split(" ")[1]
    }else if(req.cookies && req.cookies.jwt){
        token=req.cookies.jwt
    }

    if(!token){
        return res.status(401).json({ message: "Not authorized, no token" });
    }

    try {
        //verify the token and extract the user information
        const decoded=jwt.verify(token,process.env.JWT_SECRET)
        //Find the user in the database and attach it to the request object
        const user=await prisma.user.findUnique({
            where:{id:decoded.id}
        })
        if(!user){
            return res.status(401).json({ message: "Not authorized, user not found" });
        }
        req.user=user
        next()

    } catch (error) {
        return res.status(401).json({ message: "Not authorized, token failed" });
    }
}
export default authMiddleware