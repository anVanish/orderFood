const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const route = require('./routes')
const morgan = require('morgan')
const db = require('./config/db')
const dotenv = require('dotenv')
dotenv.config()

//connect to db
db.connect()

//middlewares
app.use(morgan('short'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

//route here
route(app)

//handle error

app.listen(port, () => console.log(`Web api started at http://localhost:${port}`))