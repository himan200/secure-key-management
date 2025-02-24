const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const cors =require('cors');
const connectToDb = require('./db/db');
const authRoutes = require('./routes/authRoutes');

connectToDb();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));


app.get('/',(req, res)=>{
    res.send('Hello World!');
});

app.use('api/auth', authRoutes);

module.exports = app;
