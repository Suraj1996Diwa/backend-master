const express = require('express')
const path = require('path')
const dotenv = require('dotenv')
dotenv.config()
const app = express()
const PORT = process.env.PORT || 3500

//database 
const connectDB = require('./config/dbConn')
const mongoose = require('mongoose')

connectDB()

//middleware
const { logger } = require('./middleware/logger')
const errorHandler = require('./middleware/errorHandler')

const corsOptions = require('./config/corsOptions')
const cors = require('cors')
const cookieParser = require('cookie-parser')




//middleware
app.use(logger)
app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())




//static files

app.use('/', express.static(path.join(__dirname, 'public')))




//routes
app.use('/', require('./routes/root'))
// app.use('/auth',require('./routes/auth'))
app.use('/users', require('./routes/user'))
app.use('/notes', require('./routes/noteRoutes'))



app.all('*', (req, res) => {
    res.status(404)
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    } else if (req.accepts('json')) {
        res.json({ message: '404 Not Found' })
    } else {
        res.type('txt').send('404 Not Found')
    }
})


app.use(errorHandler)

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB')
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})

mongoose.connection.on('error', err => {
    console.log(err)
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log')
})
