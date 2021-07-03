import express, { Express } from "express"
import morgan from "morgan"
import cors from "cors"

import * as dotenv from 'dotenv'
import mongoose, { ConnectOptions } from "mongoose"

// Setup all process.env.* vars - this must be done before any
// imports of modules that rely on such vars.
dotenv.config()

const app: Express = express()


// app middlewares
app.use(morgan('dev'))          // output log lines of endpoints in dev mode

// https://medium.com/@mmajdanski/express-body-parser-and-why-may-not-need-it-335803cd048c
app.use(express.json())         // Parse JSON encoded bodies
app.use(express.urlencoded({ extended: true }))   //Parse URL-encoded bodies


//app.use(cors())    // allows all origins
if ((process.env.NODE_ENV === 'development')) {
    app.use(cors({
        origin: 'http://localhost:3000'
    }))
}


// import routes
import authRoutes from "./routes/auth"
import userRoutes from "./routes/user"
import { errorMiddleware } from "./validators"


app.use('/api', authRoutes)
app.use('/api', userRoutes)

// express error handling middleware - must be last in stack
app.use(errorMiddleware)

const port = process.env.PORT || 8000

const database: string = process.env.DATABASE || 'test'
const dbuser: string = process.env.DBUSER || 'root'
const dbpass: string = process.env.DBPASSWORD || 'pass'
const dbhost: string = process.env.DBHOST || 'localhost'
const dbport: string = process.env.DBPORT || '27017'

const url = `mongodb://${dbhost}:${dbport}/${database}`
const options: ConnectOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex:true,
    user: dbuser,
    pass: dbpass
}

mongoose.connect(url, options)
    .then(() => {
        console.log('DB connected')
    })
    .catch((err) => console.log(' DB Connection error: ', err))
    .finally()

app.listen(port, () => {
    console.log(`API is running on port ${port}`)
})
