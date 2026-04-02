
import express from 'express'
import movieRoutes from './routes/movieRoutes.js'
import authRoutes from './routes/authRoute.js'
import watchlistRoutes from './routes/watchlistRoutes.js'
import {config} from "dotenv"
import {connectDB,disconnectDB} from "./config/db.js"


config()
connectDB()


const app=express()

//Body parser middleware
app.use(express.json())
app.use(express.urlencoded({extended:true}))

//API Routes
app.use("/movies",movieRoutes)
app.use("/auth",authRoutes)
app.use("/watchlist",watchlistRoutes)


const PORT=process.env.PORT || 5000

const server=app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})

//Handle unhandled promise rejections and uncaught exceptions (e.g. database connection errors, unexpected errors)

process.on("unhandledRejection",(err)=>{
    console.error(`Unhandled Rejection: ${err.message}`)

    server.close(async()=>{ 
await disconnectDB()
process.exit(1)
    })

})

process.on("uncaughtException",async(err)=>{
    console.error(`Uncaught Exception: ${err.message}`) 
    await disconnectDB()
    process.exit(1)
})

process.on("SIGINT",async()=>{
    console.log("SIGINT received. Shutting down gracefully...")
    await disconnectDB()
    process.exit(0)
})