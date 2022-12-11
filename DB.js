import mongoose from "mongoose";
import Joi from "joi";
import JoiPasswordComplexity from "joi-password-complexity"
const userSchema = new mongoose.Schema({
	name: { type: String, require: true },
	phone: { type: String, require: true },
	passward: { type: String, require: true },

});
const TicketChecker = new mongoose.Schema({
	name: { type: String, require: true },
	pin: { type: Number, require: true },

});


const complexityOptions = {
  min: 11,
};
const complexityOptions2 = {
  min: 6,
};
// const validate = (data) => {
// 	const schema = Joi.object({
// 	  name: Joi.string().required().label("Name"),
// 		phone:JoiPasswordComplexity(complexityOptions).required().label("Password"),
// 		passward:JoiPasswordComplexity(complexityOptions2).required().label("Password"),

// 	});
// 	return schema.validate(data);
// };
const BikalpaAuto=new mongoose.Schema({
	stoppage:{
		type:String,
		trim:true,
		require:true
	},
	distance:{
		type:String,
		trim:true,
		require:true
	}
})
const Bikalpa = mongoose.model("Bikalpa", BikalpaAuto);
const User = mongoose.model("user", userSchema);
const Checker = mongoose.model("TicketChecker", TicketChecker);
export { User,Bikalpa,Checker };


