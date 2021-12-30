import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
const { hash, compare } = bcrypt;
const { sign, verify } = jwt;
const { Types } = mongoose;
const { ObjectId } = Types;
export async function createPassword(password) {
	try {
		const pass = await hash(password, 13);
		if (!pass) return false;
		return pass;
	} catch (err) {
		return false;
	}
}

//throws an error if password is not valid
export async function validatePassword(password, hash) {
	try {
		const pass = await compare(password, hash);
		if (!pass) return false;
		return true;
	} catch (err) {
		return false;
	}
}

export async function createToken(payload) {
	try {
		const token = sign({ iima: payload }, process.env.JSON_KEY, { expiresIn: '6h' });
		if (!token) return false;
		return token;
	} catch (err) {
		return false;
	}
}

//throws an error if token is not valid
export async function validateToken(token , user) {
	try {
		const x =  verify(token, process.env.JSON_KEY);
		if (!x) return false;
		const valid = await validatePayload(user , x.iima);
		if(!valid) return false;
		return true;
	} catch (err) {
		return false;
	}
}

//check object id validity
export function isValidObjectID(ID) {
	let res;
	try {
		res = new ObjectId(ID);
		return res;
	} catch (err) {
		return false;
	}
}




export async function createPayload(user){
	try{
		const p = 'sa7dfysa89fy9s8ad7fy' + user.email + 'sdafhsdaf7soadhfso' ;
		const pp = await hash(p , 10);
		return pp;
	}catch(err){
		return false;
	}
}
export async function validatePayload(user , bpayload){
	try{
		const p = 'sa7dfysa89fy9s8ad7fy' + user.email + 'sdafhsdaf7soadhfso';
		const pp = await compare(p , bpayload);
		return pp;
       }catch(err){
	       return false;
       }
}

