import {exec,spawn} from 'child_process'
import fs from 'fs'
import path from 'path'

interface executionresult {
    output:string,
    error:string | null
}

const compilecode = (compiler:string,filepath:string,outpath:string): Promise<void> =>{
    return new Promise((resolve,reject)=>{

        const command=`docker run --rm -v "${process.cwd()}:/app" -w /app rce-compiler ${compiler} ${filepath} -o ${outpath}`

        exec(command,(error,stdout,stderr)=>{
            if(error){
                reject(stderr || error.message)
            }
            else{
                resolve()
            }
        })
    })
}

const runcode = (command:string,args:string[],input:string): Promise<string> =>{
    return new Promise((resolve,reject)=>{
        
        const child=spawn(command,args, { shell: true })

        let outputbuffer=""
        let errorbuffer=""

        const timer=setTimeout(()=>{
            child.kill()
            reject("Time Limit Exceeded")
        },20000)

        child.on('error', (err) => {
            clearTimeout(timer)
            reject(`Failed to start subprocess: ${err.message}`)
        })

        if(input){
            child.stdin.write(input)
        }
        child.stdin.end() 

        child.stdout.on('data',(data)=>{
            outputbuffer+=data.toString()
        })

        child.stderr.on('data',(data)=>{
            errorbuffer+=data.toString()
        })

        child.on('close',(code)=>{
            clearTimeout(timer)

            if(code!==0){
                reject(errorbuffer)
            }
            else{
                resolve(outputbuffer)
            }
        })
    })
}


export const executioncpp = async (language:string,code:string,input:string=""): Promise<executionresult> =>{
    
    let filepath=""
    const outpath="temp.out"
    let compiler=""

    if(language=="cpp"){
        filepath="temp.cpp"
        compiler="g++"
    }
    else if(language=="c"){
        filepath="temp.c"
        compiler="g++"
    }
    else if(language=="python"){
        filepath="temp.py"
    }

    const realfilepath=path.join(process.cwd(),filepath)
    const realoutpath=path.join(process.cwd(),outpath)
    
    const currentDir = process.cwd().replace(/\\/g, '/')

    try{
        fs.writeFileSync(realfilepath,code)
        let output=""

        if(language=="python"){
            output= await runcode("docker", ["run", "--rm", "-i", "-v", `${currentDir}:/app`, "-w", "/app", "rce-compiler", "python3", filepath], input)
        }
        else{
            await compilecode(compiler,filepath,outpath)
            output= await runcode("docker", ["run", "--rm", "-i", "-v", `${currentDir}:/app`, "-w", "/app", "rce-compiler", `./${outpath}`], input)
        }

        return {output:output,error:null}
    }
    catch(err:any){
        return {output:"",error:err.toString()}
    }
    finally{
        if(fs.existsSync(realfilepath)) fs.unlinkSync(realfilepath)
        if(fs.existsSync(realoutpath)) fs.unlinkSync(realoutpath)
    }
}