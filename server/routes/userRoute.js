const express=require("express");
const router=express.Router();

const {registerUser,loginUser,findUser}=require("../controllers/userController");

router.post("/register",registerUser);

router.post("/login",loginUser);

router.get("/find/:userId",findUser);
// These are path params

module.exports=router;