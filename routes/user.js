import express from 'express';
import { createPassword, createPayload, createToken, validatePassword } from '../playground.js';
import { changeEmail, changeName, changePassword, createUser, deleteUserByID, getUserByEmail } from '../queries/user.js';
import { validateUser } from '../middelwares/app/connctions.js';
const userRoute = express();

//get user data (restricted)
userRoute.route('/').get( validateUser , async (req, res) => {
	try {
		console.log('/user requires()');
		const {user} = req.query;
		res.status(200).json({
			valid: true,
			user: {
				_id: user._id,
				firstName: user.firstName,
				lastName: user.lastName,
				country: user.country,
				email: user.email,
				addressBook : user.addressBook
			},
		});
	}catch(err) {
		console.log(`Error Occured , ${err.message}`);
		res.status(403).json({ valid: false, msg: err.message });
	}
});

//register new user
userRoute.route('/register').post(async (req, res ) => {
	try {
		console.log('/user/regeister requires(firstName ,lastName, email, password )');
		const { firstName, lastName, email, password } = req.query;
		//check input validity
		console.log('checking input validity.....');
		const passwordValid = password.length > 8;
		//check if email exist;
		const {user} = await getUserByEmail(email);
		if(user) throw new Error('email already Exists');
		if (!firstName || !lastName || !email || !passwordValid) throw new Error('Invalid Inputs');
		//create confirmation token
		const confirmation = Math.floor(Math.random() * 999999999);
		//hash the password
		const pswd = await createPassword(password);
		console.log('creating user....');
		const {err , user : newUser} = await createUser(firstName , lastName , email , pswd , confirmation);
		if(err) throw new Error(err);
		//create token
		console.log('creating token....');
		const payload = await createPayload(newUser);
		const token = await createToken(payload);
		res.status(200).json({valid : true , user : {
				_id: newUser._id,
				firstName: newUser.firstName,
				lastName: newUser.lastName,
				country: newUser.country,
				email: newUser.email,
				cart : newUser.cart
		} , token : token})
	} catch (err) {
		console.log(`registeration failed , ${err.message}`);
		res.status(403).json({ valid: false, msg: err.message});
	}
});

//login
userRoute.route('/login').post(async (req, res) => {
	try {
		console.log('/user/login requires( email, password )');
		const { email, password } = req.query;
		//find user by email
		console.log('getting user info....');
		const {user} = await getUserByEmail(email);
		console.log('user : ' , user);
		if (!user) throw new Error('User Not Found');
		//validate password
		console.log('validating password....');
		const valid = await validatePassword(password , user.pwd);
		console.log('passwword validation : ' , valid);
		//if valid create login token
		if (valid) {
			console.log("creating token......");
			const payload = await createPayload(user);
			const token =  await createToken(payload);
			res.status(200).json({ valid: true, user : {
				_id: user._id,
				firstName: user.firstName,
				lastName: user.lastName,
				country: user.country,
				email: user.email,
				addressBook : user.addressBook
			} , token: token });
			return;
		} else throw new Error('Something Went Wrong');
	} catch (err) {
		console.log(`login failed , ${err.message}`);
		res.status(403).json({ valid: false, msg: err.message });
	}
});

//delete user
userRoute.route('/delete').delete(validateUser , async (req , res) =>{
	try{
		console.log('/user/delete requires( email, password )');
		const {user , password} = req.query;
		//validate password
		console.log("validating password.....");
		const passValid = await validatePassword(password , user.gemail);
		console.log('password validation : ' , passValid);
		if(!passValid) throw new Error('Authentication Failed');
		//delete user
		console.log('deleting user.......');
		const {deleteErr} = await deleteUserByID(user._id);
		console.log("deleted : " , !deleteErr);
		if(deleteErr) throw new Error(err);
		res.status(200).json({valid : true});
	}catch(err){
		console.log(`delete failed , ${err.message}`);
		res.status(403).json({ valid: false, msg: err.message });
	}
})
//change password
userRoute.route('/changepassword').post(validateUser , async (req , res) =>{
	try{
		console.log('/user/changepassword requires( id, oldPassword, newPassword , token )');
		const {user , oldPassword , newPassword} = req.query;
		//validate password
		console.log("validating password.....");
		const passValid = await validatePassword(oldPassword , user.pwd);
		console.log('password validation : ' , passValid);
		if(!passValid) throw new Error('Authentication Failed');
		//change password
		console.log('changing password user.......');
		const newPass = await createPassword(newPassword);
		if(!newPass) throw new Error('Failed Creating Password')
		const {err} = await changePassword(user._id , newPass);
		console.log("changed :  ?" , !err);
		if(err) throw new Error(err);
		res.status(200).json({valid : true});
	}catch(err){
		console.log(`changing password failed , ${err.message}`);
		res.status(403).json({ valid: false, msg: err.message });
	}
})
//change name
userRoute.route('/changename').post(validateUser , async (req , res) =>{
	try{
		console.log('/user/changename requires( firstName , lastName )');
		const {user , firstName , lastName} = req.query;
		//validate name
		console.log('changing user name.......');
		const {err} = await changeName(user._id , firstName , lastName);
		console.log("changed :  ?" , !err);
		if(err) throw new Error('Failed Updating Name')
		res.status(200).json({valid : true});
	}catch(err){
		console.log(`changing name failed , ${err.message}`);
		res.status(403).json({ valid: false, msg: err.message });
	}
})
//change email
userRoute.route('/changeemail').post(validateUser , async (req , res) =>{
	try{
		console.log('/user/changeemail requires( email , password)');
		const {user , email , password} = req.query;
		//validate name
		console.log('validating password .......');
		const valid = await validatePassword(password , user.pwd);
		console.log("valid :  ?" , valid);
		if(!valid) throw new Error('Invalid Passworrd')
		console.log("changing email ......");
		const {err : updateErr} = await changeEmail(user._id , email);
		console.log("updated :  ?" , !updateErr);
		if(updateErr) throw new Error('Error Updating User')
		res.status(200).json({valid : true});
	}catch(err){
		console.log(`changing email failed , ${err.message}`);
		res.status(403).json({ valid: false, msg: err.message });
	}
})


export default userRoute;
