
require("dotenv").config();
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(express.json());
// app.use(express.urlencoded());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

app.get("/", (req, res)=>{
    res.send("Full stack React Express server");
})

app.post("/name", (req, res)=>{
    if(req.body.name){
        return res.json({name: req.body.name})
    }else{
        return res.status(400).json({error: "No names provided"})
    }
})


app.listen(process.env.PORT, ()=>{
    console.log(`Server running on port  ${process.env.PORT}`)
})