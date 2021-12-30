import mongoose from 'mongoose';
import {item} from './item.js';
const {Schema , model , Types} = mongoose;
const {ObjectId} = Types;
//order cart
export const cart = {
	user : {
		type : ObjectId , 
		unique : [true , 'each cart must be unique to one user']
	} , 
	items : [{item : item , qty : Number}] , 
	totalPrice : Number
}
const cartSchema = new Schema(cart);

const Cart = model('cart' , cartSchema);
export default Cart;