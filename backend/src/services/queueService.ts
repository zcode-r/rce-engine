import {Queue,Worker} from 'bullmq'
import { executioncpp } from './compilerService.js'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const pool=new Pool({
    connectionString:process.env.DATABASE_URL
})

const adapter=new PrismaPg(pool)

const prisma=new PrismaClient({
    adapter
})

export const submissionqueue=new Queue('code-submission',{
    connection:{
        host:'127.0.0.1',
        port:6379
    }
})

const worker=new Worker('code-submission',async(job)=>{

    console.log(`\nWorker Picked up ticket #${job.id}. Booting up Docker...`)

    const {submissionId,language,code,input}=job.data

    const result=await executioncpp(language,code,input)

    await prisma.submission.update({
      where: { id: submissionId },
      data: {
        output: result.output,
        error: result.error,
        status: result.error ? "failed" : "completed",
      },
    })

    console.log(`Worker DB Ticket #${submissionId} successfully saved to Postgres!`)
    return result
},
{
    connection:{
        host:'127.0.0.1',
        port:6379
    },

    concurrency:1
})