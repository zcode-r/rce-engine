import { Request ,Response } from "express"
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { Pool } from "pg"
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'

dotenv.config()

const pool = new Pool({
    connectionString:process.env.DATABASE_URL
})

const adapter= new PrismaPg(pool)

const prisma=new PrismaClient({
    adapter
})

export const register=async (req:Request,res:Response):Promise<void> =>{

    const {email,password}=req.body

    if(!email || !password){
        res.status(400).json({error: "Email and password are required!"})
    }

    try{
        const existinguser = await prisma.user.findUnique({
            where:{email:email}
        })

        if(existinguser){
            res.status(400).json({ error: "User already exists with this email!"})
            return
        }

        const hashed= await bcrypt.hash(password,10)

        const newuser=await prisma.user.create({
            data:{
                email:email,
                password:hashed
            }
        })

        res.status(201).json({
            message:`New user created!`,
            user: {
                id: newuser.id,
                email: newuser.email
            }
        })
    }
    catch(err){
        console.error(err)
        res.status(500).json({err:`Internal server error`})
    }
}

export const login=async (req:Request,res:Response):Promise<void>=>{
    
    const {email,password}=req.body

    if(!email || !password){
        res.status(400).json({error:"Email and Password are required!"})
        return 
    }

    try{
            const user=await prisma.user.findUnique({
                where:{email:email}
            })

            if(!user){
                res.status(400).json({error:"User not found!"})
                return 
            }

            const ispass=await bcrypt.compare(password,user?.password)

            if(!ispass){
                res.status(401).json({error:"Invalid password!"})
                return
            }

            const token=jwt.sign({ userId: user?.id }, process.env.JWT as string, { expiresIn: "1h" })

            res.status(200).json({
                message:"Login successfull",
                token:token
            })
    }
    catch(err){
        console.log(err)
        res.status(500).json({err:"Internal server error!"})
    }

}

export const getdata=async (req:Request,res:Response):Promise<void>=>{
    try{
        const id=req.body.userId

        const history=await prisma.submission.findMany({
            where:{userId:id},
            orderBy:{createdAt:"desc"}
        })

        res.status(200).send(history)
    }
    catch(err){
        console.log(err)
        res.status(500).json({err:"Falied to fetch data!"})
    }
}

export const del=async (req:Request,res:Response):Promise<void>=>{
    try{
        const subid=parseInt(req.params.id as string)
        const id=req.body.userId

        if(isNaN(subid)){
            res.status(404).json({err:"Invalid submission id!"})
            return 
        }

        const submission=await prisma.submission.findUnique({
            where:{id:subid}
        })

        if(!submission){
            res.status(404).json({err:"Code submission is not found!"})
            return
        }

        if(submission.userId!==id){
            res.status(404).json({err:"User not authenticated to delete this!"})
            return 
        }

        await prisma.submission.delete({
            where:{id:subid}
        })

        res.status(200).json({message:"Code deleted successfully!"})

    }
    catch(err){
        console.log(err)
        res.status(500).json({err:"Internal server error"})
    }
}