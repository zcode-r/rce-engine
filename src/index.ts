import express from 'express'
import submissionRoutes from './routes/submissionRoutes.js'
import authrouter from './routes/authroutes.js'

const app = express()
const PORT = 3000

app.use(express.json())

app.use('/api', submissionRoutes)
app.use('/api',authrouter)

app.listen(PORT, () => {
    console.log(`Backend running at http://localhost:${PORT}`)
})

export default app