
require("dotenv").config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require ('mongoose')
const authRout = require("./routes/auth");
const cookeiParser = require('cookie-parser');
const toDosRoute = require('./routes/Todos')

const app = express();

app.use(express.json());
// app.use(express.urlencoded());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(cookeiParser())

app.get("/api", (req, res)=>{
    res.send("Full stack React Express server");
})


app.use("/api/auth", authRout);
app.use("/api/todos", toDosRoute)

mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    console.log('Connected to database')
    app.listen(process.env.PORT, ()=>{
        console.log(`Server running on port  ${process.env.PORT}`)
    })
}).catch((error)=>{
    console.log(error)
})

