import axios from "axios";
import express from "express"
import { Item , Category} from "../models/index.js";
const admin = express();

admin.route('/pushall').post(async (req , res) => {
	const {data} = await axios.get("https://fakestoreapi.com/products");
	console.log("data : " , data);
	for(let i = 0 ; i < data.length ; i++){
		data[i] = new Item(data[i])
	}
	await Item.insertMany(data)
	res.send("<h4>Done</h4>")
})
admin.route('/pushcats').post(async (req , res) => {
	const {data} = await axios.get("https://fakestoreapi.com/products/categories");
	console.log("data : " , data);
	for(let i = 0 ; i < data.length ; i++){
		data[i] = new Category({title : data[i]})
	}
	await Category.insertMany(data)
	res.send("<h4>Done</h4>")
})
export default admin