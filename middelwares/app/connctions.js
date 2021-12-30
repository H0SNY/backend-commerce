import { validateToken } from "../../playground.js";
import { getUserByID } from "../../queries/user.js";

export async function validateUser(req , res , next){
	try{
		console.log('validateUser middleware....');
		const {userID} = req.query;
		const {token} = req.headers;
		//getting user info
		console.log('getting user info......');
		const {user , err : userErr} = await getUserByID(userID);
		if(userErr) throw new Error(userErr);
		console.log('user : ' , user);
		//validating user
		console.log('validating user.........');
		const valid = await validateToken(token , user);
		console.log('user validation : ' , valid);
		if(!valid) throw new Error('Authentication Failed');
		req.query = {...req.query , user : user};
		next();
	}catch(err){
		console.log('err validating user : ' , err.message);
		res.status(403).json({valid : false , msg : err.message});
	}
}

