import mongoose from 'mongoose';
const { Schema, model, Types } = mongoose;
const { ObjectId } = Types;
//user schema

const userSchema = new Schema({
	firstName: {
		type: String,
		required: true,
	},
	lastName: {
		type: String,
		required: true,
	},
	country: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: [true, 'User Email Is Required'],
		unique: [true, 'email must be unique'],
	},
	pwd: {
		type: String,
		required: [true, 'User Password Is Required'],
	},
	cart: {
		type: ObjectId,
	},
	
});

const User = model('user', userSchema);

export default User;
