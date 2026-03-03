require('dotenv').config();
const express = require('express');
const connectDB  = require('./src/config/database_connection');      

const { env } = require('node:process')
const port =process.env.port
const app = express()

connectDB();  
app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))





