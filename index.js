import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose  from "mongoose";
import { User, validate } from "./DB.js";
import bcrypt from "bcrypt";
import Joi from "joi";
const app=express();
app.use(bodyParser.json());
app.use(cors());

const Port=process.env.PORT || 5001;
const connection__Url="mongodb+srv://Job_Find:SL1aF9E66SFILDii@cluster0.ynzcego.mongodb.net/?retryWrites=true&w=majority"

app.get("/",(req,res)=>{
    res.send("Hello World");
})
mongoose.connect(connection__Url,{useNewUrlParser:true,useUnifiedTopology:true},(err)=>{
  console.log(err||"Connected to the database");
});
app.post("/auth",async(req,res)=>{
  try {
		const { error } = validate(req.body);
		if (error)
			return res.status(400).send({ message: error.details[0].message });

		const user = await User.findOne({ phone: req.body.phone });
		if (!user)
			return res.status(401).send({ message: "Invalid phone number" });

		const validPhoneNumber = await bcrypt.compare(
			req.body.phone,
			user.phone
		);
		if (!validPhoneNumber)
			return res.status(401).send({ message: "Invalid Phone Number" });
		const token = user.generateAuthToken();
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
		if (user){
			return res
			.status(409)
			.send({ message: "User with given phone number already Exist!" });
		}
		await new User({ ...req.body}).save();
    const {name,phone}=req.body;
		res.status(201).json({name:name,phone:phone ,message: "User created successfully",id:user._id });
	// }
  //  catch (error) {
	// 	res.status(500).send({ message: "Internal Server Error" });
	// }
})

app.listen(Port,()=>{
  console.log("server started at port 5001");
})