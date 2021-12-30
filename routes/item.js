import express from 'express';
import { getItemsBySearchQuery, getItemsByCategory, getItemByID } from '../queries/item.js';
const itemRoute = express();

//get item
itemRoute.route('/').get(async (req, res) => {
	try {
		console.log('/item requires(itemID)');
		const { itemID } = req.query;
		const { item, err } = await getItemByID(itemID);
		if (err) throw new Error(err);
		res.status(200).json({ valid: true, item: item });
	} catch (err) {
		console.log(`itemRoute ${err.message}`);
		res.status(404).json({ valid: false, msg: err.message });
	}
});
//get items by category
//access : all
itemRoute.route('/category').get(async (req, res) => {
	try {
		console.log('/item/category requires(categoryID or categoryTitle)');
		const { category } = req.query;
		//get items
		console.log('getting items......');
		const { items, err } = await getItemsByCategory(category);
		console.log(items)
		if (err) throw new Error('Error Retrieving Items');
		if (!items?.length) throw new Error('Invalid Category or Category Does Not Contain Items');
		res.status(200).json({ valid: true, items: items });
	} catch (err) {
		console.log(`itemRoute ${err.message}`);
		res.status(404).json({ valid: false, msg: err.message });
	}
});

//get items by search query
//access : all
itemRoute.route('/search').get(async (req, res) => {
	console.log('/item/search requires(query)');
	try {
		const { query } = req.query;
		if(!query || query.length < 3) throw new Error("Invalid Text")
		//get items
		console.log('getting items');
		const { items, err } = await getItemsBySearchQuery(query);
		console.log('items : ', items);
		if (err) throw new Error('Item Not Found');
		res.status(200).json({ valid: true, items: items });
	} catch (err) {
		console.log(`itemRoute ${err.message}`);
		res.status(404).json({ valid: false, msg: err.message });
	}
});


export default itemRoute;
