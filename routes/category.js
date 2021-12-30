import express from 'express';
import { getCategories } from '../queries/category.js';

const categoryRoute = express();



//get category
//access : all

categoryRoute.route('/all').get(async (req , res) =>{
	try{
		console.log('/category/all requires()');
		console.log('getting categories........');
		const {categories , err} = await getCategories();
		console.log('categories :  ' , categories); 
		if(err) throw new Error(err);
		res.status(200).json({valid : true , categories : categories});
	}catch(err){
		console.log(`categoryRoute ${err.message}`);
		res.status(403).json({valid : false , msg : err.message});
	}
})

export default categoryRoute;