import app from './app.js'
import {connectDatabase} from './config/connection.js'

connectDatabase()

app.listen(process.env.PORT, ()=>{
    console.log(`Working on ${process.env.PORT}`)
})