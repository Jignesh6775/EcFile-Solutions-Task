const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { connection } = require('./config/db');
const { userRouter } = require('./routes/user.routes');
const app = express();
const port = process.env.port || 8080

app.use(cors());
app.use(express.json());

app.get("/check", (req, res) => {
    res.send("Welcome to the server");
})

app.use("/users", userRouter)

app.listen(port, async()=>{
    try{
        await connection
        console.log("Connected to DB");
    }
    catch(err){
        console.log(err);
        console.log("Error connecting to DB")
    }
    console.log(`Server is running on port ${port}`)
})