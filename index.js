const express = require('express')
const app = express()
require('dotenv').config()
const cors = require('cors')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const connectDB = require('./config/db')

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization', 'Access-Control-Allow-Headers', 'Access-Control-Request-Headers', 'Access-Control-Allow-Origin', 'Access-Control-Allow-Credentials', 'Access-Control-Allow-Methods', 'Access-Control-Request-Method', 'Access-Control-Request-Headers', 'Access-Control-Allow-Headers', 'Access-Control-Allow-Origin', 'Access-Control-Allow-Credentials', 'Access-Control-Allow-Methods', 'Access-Control-Request-Method', 'Access-Control-Request-Headers', 'Access-Control-Allow-Headers', 'Access-Control-Allow-Origin', 'Access-Control-Allow-Credentials', 'Access-Control-Allow-Methods', 'Access-Control-Request-Method', 'Access-Control-Request-Headers', 'Access-Control-Allow-Headers', 'Access-Control-Allow-Origin', 'Access-Control-Allow-Credentials', 'Access-Control-Allow-Methods', 'Access-Control-Request-Method', 'Access-Control-Request-Headers', 'Access-Control-Allow-low-Origin', 'Access-Control-Allow-Credentials', 'Access-Control-Allow-Methods', 'Access-Control-Request-Method', 'Access-Control-Request-Headers'],
    credentials: true,
    optionsSuccessStatus: 200
}
))
app.use(express.json())
app.use(bodyParser.json())
app.use(morgan('dev'))

app.get('/', (req, res) => {
    res.send('Hello World!')
})
app.use('/admin', require('./routes/admin'))
app.use('/', require('./routes/entries'))

connectDB()
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
})


