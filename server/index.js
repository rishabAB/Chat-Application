const express=require("express");
const app=express();
const cors= require("cors"); 
const mongoose=require("mongoose");
const port = process.env.PORT || 5000;
require("dotenv").config();
const uri=process.env.ATLAS_URI;

const userRoute=require("./routes/userRoute");

app.use("/api/users",userRoute);

app.use(express.json());
app.use(cors());

app.get("/",(req,res) =>
{
    res.send("welcome to chat api")
})

app.listen(port,() =>
{
    console.log(`Server is listening on port : ${port}`);
})

mongoose.connect(uri,{ 
}).then(() =>
{
  console.log("Mongodb connection successfull");  
})
.catch((error) =>
{
    console.error("Mongodb connection failed",error.message);
})

