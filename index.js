import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose  from "mongoose";
import { User,Bikalpa, Checker } from "./DB.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import Joi from "joi";
const app=express();
app.use(bodyParser.json());
app.use(cors({origin:true, credentials: true}));

const Port=process.env.PORT || 5001;
const connection__Url="mongodb+srv://BMS:SL1aF9E66SFILDii@cluster0.ueicbqz.mongodb.net/test?retryWrites=true&w=majority"

app.get("/",(req,res)=>{
    res.send("Hello World");
})
mongoose.connect(connection__Url,{useNewUrlParser:true,useUnifiedTopology:true},(err)=>{
  console.log(err||"Connected to the database");
});
app.post("/auth",async(req,res)=>{
  try {
		// const { error } = validate(req.body);
		// if (error)
		// 	return res.status(400).send({ message: error.details[0].message });

		const user = await User.findOne({ phone: req.body.phone });
		if (!user)
			return res.status(401).send({ message: "Invalid phone number" });

		const validPhoneNumber =  bcrypt.compare(
			req.body.phone,
			user.phone
		);
		if (!validPhoneNumber)
			return res.status(401).send({ message: "Invalid Phone Number" });
			const validatePassard =  bcrypt.compare(
				req.body.passward,
				user.passward
			);
			if (!validatePassard)
				return res.status(401).send({ message: "Invalid passward" });
				const token = jwt.sign({ phone:user.phone }, "secreat123",{
					expiresIn:"7d"
				});
		res.status(200).send({ data: token, message: "Logged in successfully" });
	} catch (error) {
		res.status(500).send({ message: "Internal Server Error" });
	}
})
app.post("/user",async (req,res)=>{
  // try {
		// const { error } = validate(req.body);
		// if (error){
		// 	return res.status(400).send({ message: error.details[0].message });
		// }
		const user = await User.findOne({ phone: req.body.phone });
		// if (user){
		// 	return res
		// 	.status(409)
		// 	.send({ message: "User with given phone number already Exist!" });
		// }
	
		await new User({ ...req.body}).save();
    const {name,phone,passward}=req.body;
		const token = jwt.sign({ phone:phone }, "secreat123",{
      expiresIn:"7d"
    });
		res.status(201).json({name:name,phone:phone,token:token ,message: "User created successfully"});
	// }
  //  catch (error) {
	// 	res.status(500).send({ message: "Internal Server Error" });
	// }
})

app.post("/Checker",async (req,res)=>{
 
		// const user = await Checker.findOne({ pin: req.body.pin });
		// if (user){
		// 	return res
		// 	.status(409)
		// 	.send({ message: "User with given pin already Exist!" });
		// }
	
		await new Checker({ ...req.body}).save();
    const {name,pin}=req.body;
		const token = jwt.sign({ pin:pin }, "secreat123",{
      expiresIn:"7d"
    });
		res.status(201).json({name:name,pin:pin,token:token ,message: "User created successfully"});

})

app.post("/CheckerLogIn",async(req,res)=>{
  try {

		const user = await Checker.findOne({ pin: req.body.pin });
		// if (!user)
		// 	return res.status(401).send({ message: "Invalid pin number" });
		
		// if (user.pin!==req.body.pin)
		// 	return res.status(401).send({ message: "Invalid Pin Number" });
			
				const token = jwt.sign({ phone:user.phone }, "secreat123",{
					expiresIn:"7d"
				});
		res.status(200).send({ token: token, message: "Logged in successfully" });
	} catch (error) {
		res.status(500).send({ message: "Internal Server Error" });
	}
})

app.post("/Bikalpa",(req,res)=>{
  const stoppage=req.body.stoppage
	const distance=req.body.distance
	const data={
		stoppage:stoppage,
		distance:distance
	}
	new Bikalpa({...req.body},(err,data)=>{
    if(err){
   res.status(401).send(err.message)
		}
		else{
    res.status(200).send(data)
		}
	}).save()

})
app.get("/getBikalpa",(req,res)=>{
	Bikalpa.find((err,data)=>{
		if(err){
			res.status(401).send(err.message)
			 }
			 else{
			 res.status(200).send(data)
			 }
	})
})
app.listen(Port,()=>{
  console.log("server started at port 5001");
})