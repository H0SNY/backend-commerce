import mongoose from 'mongoose';
const { Schema, model, Types } = mongoose;
const { ObjectId } = Types;
const categorySchema = new Schema({
	title : String ,
	img : String , 
});

const Category = model('category', categorySchema);
export default Category;
