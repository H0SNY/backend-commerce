import { Item } from '../models/index.js';

//return item if found , null if not
export async function getItemByID(id) {
	const item = await Item.findOne({ id: id });
	if (!item) return { err: 'Item Not Found', item: false };
	return { err: false, item: item };
}

//returns items if found , throws an error if category or items not found
export async function getItemsByCategory(title) {
	const items = await Item.find({ category: title });
	if (!items.length) return { err: '0 Items Found', items: false };
	else return { err: false, items: items };
}

//return items if found , throws an error otherwise
export async function getItemsBySearchQuery(query) {
	try {
		const items = await Item.find({});
		const result = [];
		for (const item of items){
			if (item.description.includes(query)) result.push(item);
			if (item.title.includes(query)) result.push(item);
		}
		let j = 0;
		for (let i = query.length; i > 2; i--) {
			const temp = query.slice(0, i);
			for (const item of items) {
				if (item.title.includes(temp)) result.push(item);
				if (item.description.includes(temp)) result.push(item);
			}
			
		}

		if (!result.length) return { err: '0 Items Found', items: false };
		else return { err: false, items: result };
	} catch (err) {
		return { err: 'Invalid Entry', items: false };
	}
}
