import express from 'express'
import cors from 'cors'
import path from "path";
import cookieParser from "cookie-parser";
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import connectDatabase from './src/database/db.js';
import routes from './src/routes.js'

dotenv.config()

const app = express()


app.use((req,res,next) =>{

    res.header("Access-Control-Allow-Origin","*")
    res.header("Access-Control-Allow-Methods","GET,PATCH, PUT,POST,DELETE")
    app.use(cors())
    next()
})
app.use(cookieParser())
app.use(express.json())

connectDatabase()


const port = process.env.PORT || 5000


app.use(routes)

app.listen(port, (req,res) =>{
    console.log("Servidor rodando na porta "+port)
})