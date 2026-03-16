import jwt from 'jsonwebtoken'
import { Response,Request,NextFunction } from 'express'
import { error } from 'node:console'

export const protect=(req:Request,res:Response,next:NextFunction):void=>{

    const authheader=req.header("Authorization")

    if(!authheader || !authheader.startsWith("Bearer")){
        res.status(400).json({error:"Access denied"})
        return
    }

    const token=authheader?.split(" ")[1]

    try{

        const decode=jwt.verify(token,process.env.JWT as string) as {userId:number}

        req.body.userId=decode.userId

        next()
    }
    catch(err){
        console.log(err)
        res.status(500).json({err:"Internal server error!"})
    }
}