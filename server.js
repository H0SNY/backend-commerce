import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import admin from './routes/admin.js';
import {UserRoute ,  CategoryRoute , ItemRoute , CartRoute} from './routes/index.js';
import helpRoute from './helper.js';
import { validateUser } from './middelwares/app/connctions.js';
dotenv.config(); //to activate environment variables
const port = process.env.port || 8080;
const atlasUri = process.env.ATLAS_URI;

const startConnection = async () => {
	try{
		 mongoose.connect(atlasUri ,  {
			 useNewUrlParser : true , useUnifiedTopology : true , autoIndex : false
		}
	);
		console.log(`mongo connected`);
	}catch(err){
		console.log(`mongo error ${err.message}`);
	}

}

//main configrations
const app = express();
app.use(express.urlencoded({ extended : true }));
app.use(cors());
startConnection();

app.use('/user' , UserRoute);
app.use('/category' , CategoryRoute);
app.use('/item' , ItemRoute);
app.use('/cart' , CartRoute);
app.use('/helper' ,  helpRoute);
app.use('/admin' ,  admin);



app.listen(port , err =>{
	if(!err) console.log(`listening on ${port}`);
	else console.log(`port ${port} error`);
});