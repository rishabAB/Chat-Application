const userModel=require("../models/userModel");
const bcrypt=require("bcrypt");
const validator=require("validator");
const jwt=require("jsonwebtoken");

const createToken = (_id) =>
{
    const jwtkey=process.env.JWT_SECRET_KEY;
    return jwt.sign({_id},jwtkey,{expiresIn:"3d"});
}

const Base64ToUrl = (base64String) => {
    return new Promise((resolve,reject)=>
    {
        const base64Data = base64String.replace(/^data:image\/(png|jpeg);base64,/, "");
        const byteCharacters = atob(base64Data);

        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        
        const byteArray = new Uint8Array(byteNumbers);
        const buffer = Buffer.from(byteArray);
        const blob = new Blob([byteArray], { type: "image/jpeg" }); // or "image/jpeg"
        resolve(buffer);

    })
   
};
const registerUser = async(req,res) =>
{
    try{
        const {name,email,password,profile}=req.body;
        let imageBlob;

        if(profile)
        {
            imageBlob=await Base64ToUrl(profile)
        }

        let user=await userModel.findOne({email});
    
        if(user) return res.status(400).json("User with the given email already exists");
    
        if(!name || !email || !password) return res.status(400).json("All fields are required");
    
        if(!validator.isEmail(email))  return res.status(400).json("Email must be a valid email");
    
        if(!validator.isStrongPassword(password))  return res.status(400).json("Password must be a strong password");
    
        user=new userModel({name,email,password,profile:imageBlob});
        const salt=await bcrypt.genSalt(10);
        user.password=await bcrypt.hash(user.password,salt);
    
        await user.save();
    
        const token=createToken(user._id);
    
        res.status(200).json({_id:user._id,name,email,token,profile:user.profile});

    }

    catch(error)
    {
        console.error("An unknown error occurred",error);
        res.status(500).json(error);
    }
   
}

const loginUser= async(req,res) =>
{
    const {email,password}=req.body;

    try{
        let user=await userModel.findOne({email});

        if(!user) return res.status(400).json("Invalid email or password");

        const isValidPassword= await bcrypt.compare(password,user.password);

        if(!isValidPassword) return res.status(400).json("Invalid email or password");

        const token = createToken(user._id);
    
        res.status(200).json({_id:user._id,name:user.name,email,token,profile:user.profile});

    }
    catch(error)
    {
        console.error("An unknown error occurred",error);
        return res.status(500).json(error);
    }
}

const findUser = async(req,res) =>
{
    const userId = req.params.userId;

    try{
        const user= await userModel.findById(userId);
        res.status(200).json(user);

    }
    catch(error)
    {
        console.error("An unknown error occured ",error);
        res.status(500).json(error);
    }
} 

const getUsers = async(req,res) =>
{
    try{
        const users=await userModel.find();
        res.status(200).json(users);
    }
    catch(error)
    {
        console.error("An unknown error occured",error);
        res.status(500).json(error);
    }
}


module.exports={registerUser,loginUser,findUser,getUsers};