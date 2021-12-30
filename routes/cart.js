import express from 'express';
import { validateToken } from '../playground.js';
import { createCart, addItemByUserID, addItemByID, deleteItemByID, deleteItemByUserID, getCartByUserID, hasItemByUserID, hasItemByCartID, getCartByID, deleteAllItemsByUserID, deleteAllItemsByCartID, changeQtyByID, changeQtyByUserID } from '../queries/cart.js';
import { getUserByID } from '../queries/user.js';
const cartRoute = express();

cartRoute.route('/').get(async (req, res) => {
	try {
		console.log('/cart requires(cartID or userID)');
		let { cartID, userID } = req.query;
		const { token } = req.headers;
		if (!cartID) {
			console.log('User Cart , loading user..........');
			const { user, err: userErr } = await getUserByID(userID);
			console.log('user : ', user);
			if (userErr) throw new Error(userErr);
			console.log('validating user........');
			const valid1 = await validateToken(token, user);
			console.log('user validation : ', valid1);
			if (!valid1) throw new Error('Authentication Failed');
			console.log('getting cart.........');
			const { cart, err } = await getCartByUserID(userID);
			console.log('cart : ', cart);
			if (err) throw new Error(err);
			res.status(200).json({ valid: true, cart: cart });
			return;
		} else {
			console.log('visitor cart , loading cart..........');
			const { err, cart } = await getCartByID(cartID);
			console.log('cart : ', cart);
			if (cart.user) throw new Error('Invalid Access');
			if (err) throw new Error(err);
			res.status(200).json({ valid: true, cart: cart });
		}
	} catch (err) {
		console.log(`cartRoute ${err.message}`);
		res.status(403).json({ valid: false, msg: err.message });
	}
});

//add items to cart by cart id or user id
//access : all
cartRoute.route('/additem').post(async (req, res) => {
	try {
		console.log('/cart/additem requires(userID or cartID , itemID)');
		let { itemID, cartID, userID } = req.query;
		const { token } = req.headers;
		if (!cartID) {
			console.log('User Cart , loading user..........');
			const { user, err: userErr } = await getUserByID(userID);
			console.log('user : ', user);
			if (userErr) throw new Error(userErr);
			console.log('validating user........');
			const valid1 = await validateToken(token, user);
			console.log('user validation : ', valid1);
			if (!valid1) throw new Error('Authentication Failed');
			console.log('checking if cart has this item........');
			const has = await hasItemByUserID(userID, itemID);
			console.log('has ? : ', has);
			if (has) throw new Error('Item Already Exists');
			const { err } = await addItemByUserID(userID, itemID);
			if (err) throw new Error(err);
		} else {
			console.log('visitor cart , loading cart..........');
			const { cart, err: cartErr } = await getCartByID(cartID);
			console.log('cart : ', cart);
			if (cartErr) throw new Error(cartErr);
			if (cart.user) throw new Error('Invalid Access');
			console.log('checking if cart has this item........');
			const has = await hasItemByCartID(cartID, itemID);
			console.log('has ? : ', has);
			if (has) throw new Error('Item Already Exists');
			const { err } = await addItemByID(cartID, itemID);
			if (err) throw new Error(err);
		}
		res.status(200).json({ valid: true });
	} catch (err) {
		console.log(`cartRoute ${err.message}`);
		res.status(403).json({ valid: false, msg: err.message });
	}
});

//access : all
cartRoute.route('/deleteitem').delete(async (req, res) => {
	try {
		console.log('/cart/deleteitem requires (cartID or userID , itemID)');
		const { cartID, userID, itemID } = req.query;
		const { token } = req.headers;
		if (!cartID) {
			//get user
			console.log('User Cart , loading user..........');
			const { user, err: userErr } = await getUserByID(userID);
			console.log('user : ', user);
			if (userErr) throw new Error(userErr);
			console.log('validating user.........');
			const valid = await validateToken(token, user);
			console.log('user validation : ', valid);
			if (!valid) throw new Error('Authenication Failed');
			const foundErr = await hasItemByUserID(userID , itemID)
			if(!foundErr) throw new Error("Item Not Found")
			const { err } = await deleteItemByUserID(userID, itemID);
			if (err) throw new Error(err);
		} else {
			console.log('visitor cart , loading cart..........');
			const { cart, err: cartErr } = await getCartByID(cartID);
			console.log('cart : ', cart);
			if (cartErr) throw new Error(cartErr);
			if (cart.user) throw new Error('Invalid Access');
			const foundErr = await hasItemByCartID(cartID , itemID)
			if(!foundErr) throw new Error("Item Not Found")
			console.log('deleting item........');
			const { err } = await deleteItemByID(cartID, itemID);
			console.log('deleted : ', !err);
			if (err) throw new Error(err);
		}
		res.status(200).json({ valid: true });
	} catch (err) {
		console.log(`cartRoute ${err.message}`);
		res.status(403).json({ valid: false, msg: err.message });
	}
});
//access : all
cartRoute.route('/deleteall').delete(async (req, res) => {
	try {
		console.log('/cart/deleteall requires (cartID or userID)');
		const { cartID, userID } = req.query;
		const { token } = req.headers;
		if (!cartID) {
			//get user
			console.log('User Cart , loading user..........');
			const { user, err: userErr } = await getUserByID(userID);
			console.log('user : ', user);
			if (userErr) throw new Error(userErr);
			console.log('validating user.........');
			const valid = await validateToken(token, user);
			console.log('user validation : ', valid);
			if (!valid) throw new Error('Authenication Failed');
			console.log('deleting all items........');
			const { err } = await deleteAllItemsByUserID(userID);
			console.log('deleted : ', !err);
			if (err) throw new Error(err);
		} else {
			console.log('visitor cart , loading cart..........');
			const { cart, err: cartErr } = await getCartByID(cartID);
			console.log('cart : ', cart);
			if (cartErr) throw new Error(cartErr);
			if (cart.user) throw new Error('Invalid Access');
			console.log('deleting all items........');
			const { err } = await deleteAllItemsByCartID(cartID);
			console.log('deleted : ', !err);
			if (err) throw new Error(err);
		}
		res.status(200).json({ valid: true });
	} catch (err) {
		console.log(`cartRoute ${err.message}`);
		res.status(403).json({ valid: false, msg: err.message });
	}
});

cartRoute.route('/create').post(async (req ,res) => {
	try {
		console.log('/cart/create (creates empty cart)');
		console.log('creating cart.........');
		const { cart, err } = await createCart();
		console.log('cart : ', cart);
		if (!cart) throw new Error(err);
		res.status(200).json({ valid: true, cart: cart });
	} catch (err) {
		console.log(`cartRoute ${err.message}`);
		res.status(403).json({ valid: false, msg: err.message });
	}
});

cartRoute.route('/changeqty').post(async (req, res) => {
	try {
		console.log('/cart/changeqty requires (cartID or userID)');
		const { cartID, userID, itemID, qty } = req.query;
		const { token } = req.headers;
		console.log('query : ' , req.query);
		if (!cartID) {
			//get user
			console.log('user ID : ' , userID , " token : " , token);
			console.log('User Cart , loading user..........');
			const { user, err: userErr } = await getUserByID(userID);
			console.log('user : ', user);
			if (userErr) throw new Error(userErr);
			console.log('validating user.........');
			const valid = await validateToken(token, user);
			console.log('user validation : ', valid);
			if (!valid) throw new Error('Authenication Failed');
			console.log('changing qty........');
			const {err} = await changeQtyByUserID(userID , itemID , qty);
			console.log('changed ? : ', !err);
			if (err) throw new Error(err);
		} else {
			console.log('visitor cart , loading cart..........');
			const { cart, err: cartErr } = await getCartByID(cartID);
			console.log('cart : ', cart);
			if (cartErr) throw new Error(cartErr);
			if (cart.user) throw new Error('Invalid Access');
			console.log('changing qty........');
			const { err } = await changeQtyByID(cartID , itemID , qty);
			console.log('changed ?  : ', !err);
			if (err) throw new Error(err);
		}
		res.status(200).json({ valid: true });
	} catch (err) {
		console.log(`cartRoute ${err.message}`);
		res.status(403).json({ valid: false, msg: err.message });
	}
});

export default cartRoute;
