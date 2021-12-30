import { Cart } from '../models/index.js';
import { isValidObjectID } from '../playground.js';
import { getItemByID } from './item.js';
import { getUserByID } from './user.js';

//returns cart if found , err otherwise
export async function getCartByID(cartID) {
	const valid = isValidObjectID(cartID);
	if (!valid) return { err: 'Invalid ID', cart: false };
	const cart = await Cart.findOne({ _id: cartID });
	if (!cart) return { err: 'Cart Not Found', cart: false };
	return { err: false, cart: cart };
}

//returns cart if found , err otherwise
export async function getCartByUserID(userID) {
	const valid = isValidObjectID(userID);
	if (!valid) return { err: 'Invalid ID', cart: false };
	const cart = await Cart.findOne({ user: userID });
	if (!cart) return { err: 'Cart Not Found', cart: false };
	return { err: false, cart: cart };
}

//creates new cart
//accepts user (optional)
export async function createCart(userID) {
	let cart = new Cart({ items: [], totalPrice: 0 });
	if (userID) {
		const valid = isValidObjectID(userID);
		if (!valid) return { err: 'Invalid ID', cart: false };
		cart.user = userID;
	}
	try {
		const c = await cart.save();
		return { err: false, cart: c };
	} catch (err) {
		return { err: err.message, cart: false };
	}
}

//adds items to cart by cart id, throws an error if something went wrong
export async function addItemByID(cartID, itemID) {
	const valid1 = isValidObjectID(cartID);
	if (!valid1) return { err: 'Invalid Cart ID', cart: false };
	const { cart, err } = await getCartByID(cartID);
	if (err) return { err: 'Invalid Cart', cart: false };
	const { item, err: itemErr } = await getItemByID(itemID);
	if (itemErr) return { err: itemErr, cart: false };
	const { modifiedCount } = await Cart.updateMany(
		{ _id: cartID },
		{
			$push: { items: { item: item, qty: 1 } },
		}
	);
	console.log('modified ? ', modifiedCount);

	if (!modifiedCount) return { err: 'Cannot Update', cart: false };
	const { err: billErr, cart: c } = await updateBill(cart._id);
	console.log('bill err : ', billErr);
	if (billErr) return { err: 'Item Saved But Couldnt Update Bill Please Reset Your Cart', cart: false };
	return { err: false, cart: c };
}
//adds items to cart by user id, throws an error if something went wrong
export async function addItemByUserID(userID, itemID) {
	const valid1 = isValidObjectID(userID);
	if (!valid1) return { err: 'Invalid ID', cart: false };
	const { cart, err } = await getCartByUserID(userID);
	if (err) return { err: 'Invalid Cart', cart: false };
	let { item, err: itemErr } = await getItemByID(itemID);
	if (itemErr) return { err: itemErr, cart: false };
	const { modifiedCount } = await Cart.updateMany(
		{ user: userID },
		{
			$push: { items: { item: item, qty: 1 } },
		}
	);

	if (!modifiedCount) return { err: 'Cannot Update', cart: false };
	const { err: billErr, cart: c } = await updateBill(cart._id);
	console.log('bill err : ', billErr);
	if (billErr) return { err: 'Item Saved But Couldnt Update Bill Please Reset Your Cart', cart: false };
	return { err: false, cart: c };
}

//deltes an item from cart by item id and cart id
export async function deleteItemByID(cartID, itemID) {
	const valid1 = isValidObjectID(cartID);
	if (!valid1) return { err: 'Invalid ID', cart: false };
	const { err: itemErr } = await getItemByID(itemID);
	if (itemErr) return { err: itemErr, cart: false };
	const { cart, err: cartErr } = await getCartByID(cartID);
	if (cartErr) return { err: cartErr, cart: false };
	let qty = 0;
	for (const item of cart.items) if (String(item.item._id) === String(itemID)) qty = item.qty;

	const { modifiedCount } = await Cart.updateOne(
		{ _id: cartID },
		{
			$pull: { items: { 'item.id': itemID } },
		}
	);
	const { cart1, err: cart1Err } = await getCartByID(cartID);
	if (cart1Err) return { err: cart1Err, cart: false };

	if (!modifiedCount) return { err: 'Error Deleting Item', cart: false };
	const { err: billErr, cart: updatedCart } = await updateBill(cart._id);
	if (billErr) return { err: 'Item Was Deleted But Bill Is Messed , Please Clear Your Cart', cart: false };
	return { err: false, cart: updatedCart };
}

//deltes an item from cart by item id and user id
export async function deleteItemByUserID(userID, itemID) {
	const valid1 = isValidObjectID(userID);
	if (!valid1) return { err: 'Invalid ID', cart: false };
	const { err: itemErr } = await getItemByID(itemID);
	if (itemErr) return { err: itemErr, cart: false };
	const { cart, err: cartErr } = await getCartByUserID(userID);
	if (cartErr) return { err: cartErr, cart: false };
	let qty = 0;
	for (const item of cart.items) {
		if (String(item.item._id) === String(itemID)) qty = item.qty;
	}
	const { modifiedCount } = await Cart.updateOne(
		{ user: userID },
		{
			$pull: { items: { 'item.id': itemID } },
		}
	);
	if (!modifiedCount) return { err: 'Error Deleting Item', cart: false };
	const { err: billErr, cart: updatedCart } = await updateBill(cart._id);
	if (billErr) return { err: 'Item Was Deleted But Bill Is Messed , Please Clear Your Cart', cart: false };
	return { err: false, cart: updatedCart };
}

//delete all cart items
export async function deleteAllItemsByUserID(userID) {
	const valid = isValidObjectID(userID);
	if (!valid) return { err: 'Invalid ID', cart: false };
	const { cart, err } = await getCartByUserID(userID);
	if (err) return { err: err, cart: false };
	cart.items = [];
	cart.totalPrice = 0;
	try {
		const c = await cart.save();
		return { err: false, cart: c };
	} catch (err) {
		return { err: 'Error Saving Cart', cart: false };
	}
}
export async function deleteAllItemsByCartID(cartID) {
	const valid = isValidObjectID(cartID);
	if (!valid) return { err: 'Invalid ID', cart: false };
	const { cart, err } = await getCartByID(cartID);
	if (err) return { err: err, cart: false };
	cart.items = [];
	cart.totalPrice = 0;
	try {
		const c = await cart.save();
		return { err: false, cart: c };
	} catch (err) {
		return { err: 'Error Saving Cart', cart: false };
	}
}

//adds a cart owner
export async function setUserByUser(cartID, userID) {
	const valid1 = isValidObjectID(cartID);
	const valid2 = isValidObjectID(userID);
	if (!valid1 || !valid2) return { err: 'Invalid ID', cart: false };
	const { user } = await getUserByID(userID);
	const { cart } = await getCartByID(userID, cartID);
	if (!user || !cart) return { err: 'User  or Cart Is Invalid', cart: false };
	cart.user = user._id;
	try {
		const c = await cart.save();
		return { err: false, cart: c };
	} catch (err) {
		return { err: 'Error Saving Cart', cart: false };
	}
}

//check if item exist in cart by userID or by cartID
export async function hasItemByUserID(userID, itemID) {
	const valid2 = isValidObjectID(userID);
	if (!valid2) return false;
	const { cart } = await getCartByUserID(userID);
	if (!cart) return false;
	if (cart.items.find((val) => String(val.item.id) === itemID)) return true;
	return false;
}
export async function hasItemByCartID(cartID, itemID) {
	const valid2 = isValidObjectID(cartID);
	if (!valid2) return false;
	const { cart } = await getCartByID(cartID);
	if (!cart) return false;
	if (cart.items.find((val) => String(val.item.id) === itemID)) return true;
	return false;
}

export async function changeQtyByID(cartID, itemID, qty) {
	const valid1 = isValidObjectID(cartID);
	if (!valid1) return { err: 'Invalid ID', cart: false };
	const { cart, err: cartErr } = await getCartByID(cartID);
	if (cartErr) return { err: cartErr, cart: false };
	const { item, err: itemErr } = await getItemByID(itemID);
	if (itemErr) return { err: itemErr, cart: false };
	// if (qty > item.qty) return { err: 'This Quantity Isnt Available', cart: false };
	for (const item of cart.items) {
		if (String(item.item.id) === String(itemID)) {
			item.qty = qty;
			break;
		}
	}
	try {
		const c = await cart.save();
		const { err: billErr } = await updateBill(c._id);
		if (billErr) return { err: 'Cart Saved But Bill Is Corrupt Please Reset Your Cart', cart: c };
		return { err: false, cart: c };
	} catch (err) {
		return { err: 'Error Saving Cart', cart: false };
	}
}

export async function changeQtyByUserID(userID, itemID, qty) {
	const valid1 = isValidObjectID(userID);
	if (!valid1) return { err: 'Invalid User ID', cart: false };
	const { cart, err: cartErr } = await getCartByUserID(userID);
	if (cartErr) return { err: cartErr, cart: false };
	const { item, err: itemErr } = await getItemByID(itemID);
	if (itemErr) return { err: itemErr, cart: false };
	// if (qty > item.qty) return { err: 'This Quantity Isnt Available', cart: false };
	for (const item of cart.items) {
		if (String(item.item.id) === String(itemID)) {
			item.qty = qty;
			break;
		}
	}
	try {
		const c = await cart.save();
		const { err: billErr } = await updateBill(c._id);
		if (billErr) return { err: 'Cart Saved But Bill Is Corrupt Please Reset Your Cart', cart: c };
		return { err: false, cart: c };
	} catch (err) {
		return { err: 'Error Saving Cart', cart: false };
	}
}


export async function updateBill(cartID) {
	const valid = isValidObjectID(cartID);
	if (!valid) return { err: 'Invalid ID', cart: false };
	const { cart, err: cartErr } = await getCartByID(cartID);
	if (cartErr) return { err: cartErr, cart: false };
	let price = 0;
	for (const item of cart.items) price += item.item.price * item.qty;

	cart.totalPrice = price;
	try {
		const c = await cart.save();
		return { err: false, cart: c };
	} catch (err) {
		return { err: 'Error Saving Cart', cart: false };
	}
}
