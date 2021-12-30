import mongoose from 'mongoose';
const {Schema , model , Types} = mongoose;
const {ObjectId} = Types;

export const item = {
	id : {
		type : Number , 
		required : true , 
		unique : true
	} , 
	description : {
		type : String , 
		required : true
	} , 

	category : {
		type : String, 
		required : true 
	} , 
	title : {
		type : String , 	
	} , 
	image : {
		type : String ,
		required : true 
	} , 
	price : {
		type : Number , 
		required : true
	} , 
	rating : {
		rate : {
			type : Number
		} , 
		count :{
			type : Number
		}
	}
	
}
const itemSchema = new Schema(item);

const Item = model('item' , itemSchema);
export default Item;