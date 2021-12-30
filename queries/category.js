import { Category } from '../models/index.js';


//get all category
export async function getCategories() {
	const category = await Category.find({});
	if (!category || !category.length) return { err: 'Category Not Found', categories: false };
	return { categories: category, err: false };
}

