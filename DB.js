import mongoose from "mongoose";
import Joi from "joi";
import JoiPasswordComplexity from "joi-password-complexity"
const userSchema = new mongoose.Schema({
	name: { type: String, required: true },
	phone: { type: String, required: true },
});

const User = mongoose.model("user", userSchema);
const complexityOptions = {
  min: 11,
};
const validate = (data) => {
	const schema = Joi.object({
	  name: Joi.string().required().label("Name"),
		phone:JoiPasswordComplexity(complexityOptions).required().label("Password"),
	});
	return schema.validate(data);
};
export { User, validate };


