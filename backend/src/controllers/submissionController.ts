import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { submissionqueue } from "../services/queueService.js";
import dotenv from "dotenv";


dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

export const createsubmission = async (req: Request, res: Response) => {
  const { title, code, language, userId} = req.body
  const userinput = req.body.input || ""

  if (!code || !language || !userId) {
    res.status(400).json({ error: "Code and language are required!" });
    return;
  }

  try {
    const submission = await prisma.submission.create({
      data: {
        title: title || "Untitled",
        code,
        language,
        status: "pending",
        userId:userId
      },
    })

    await submissionqueue.add('code-job',{
      submissionId:submission.id,
      language,
      code,
      input:userinput
    })



    res.status(201).json({
            message: "Code added to the waiting room!",
            id:submission.id,
            ticket: submission
    })

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error!" });
  }
}

export const getsubmission=async (req:Request,res:Response):Promise<void>=>{

  const ticketid=parseInt(req.params.id as string)

  try{

    const submission=await prisma.submission.findUnique({
      where:{id:ticketid}
    })

    if(!submission){
      res.status(404).json({err:'Ticket not found!'})
      return
    }

    res.status(200).json(submission)

  }
  catch(err){
    console.error(err)
    res.status(500).json({err:'Internal server error!'})
  }

}

export const gethistory=async (req:Request,res:Response): Promise<void>=>{

  try{
    const userId=req.body.userId

    const history=await prisma.submission.findMany({
      where:{userId:userId},
      orderBy:{id:'desc'}
    })

    res.status(200).json(history)
  }
  catch(err){
    console.error(err)
    res.status(500).json({err:'Internal server error!'})
  }
}