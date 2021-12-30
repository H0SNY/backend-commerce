import { User, Cart } from '../models/index.js';
import { isValidObjectID } from '../playground.js';
import { createCart } from './cart.js';

export async function getUserByEmail(email) {
	const user = await User.findOne({ email: email });
	if (!user) return { err: 'User Does Not Exist', user: false };
	return { err: false, user: user };
}
export async function getUserByID(ID) {
	const valid = isValidObjectID(ID);
	if (!valid) return { err: 'Invalid Object ID', user: false };
	const user = await User.findOne({ _id: ID });
	if (!user) return { err: 'User Does Not Exist', user: false };
	return { err: false, user: user };
}

//delete user
export async function deleteUserByID(userID) {
	const valid = isValidObjectID(userID);
	if (!valid) return { err: 'Invalid ID', user: false };
	const { user, err } = await getUserByID(userID);
	if (err) return { err: 'User Not Found', user: false };
	if (user.cart) await Cart.deleteOne({ _id: user.cart });
	const { deletedCount } = await User.deleteOne({ _id: userID });
	if (!deletedCount) return { err: 'Error Deleting Account', user: user };
	return { err: false, user: user };
}

export async function createUser(firstName, lastName, email, password) {

	const user = new User({
		firstName: firstName,
		lastName: lastName,
		country: 'US',
		email: email,
		pwd: password,
	});
	const { cart, err: cartErr } = await createCart(user._id);
	if (cartErr) return { err: cartErr, user: false };
	user.cart = cart._id
	try {
		const u = await user.save();
		return { err: false, user: u };
	} catch (err) {
		return { err: err.message, valid: false };
	}
}

export async function changePassword(userID, pass) {
	const { modifiedCount } = await User.updateMany(
		{ _id: userID },
		{
			$set: { pwd: pass },
		}
	);
	if (!modifiedCount) return { err: 'Failed Updating User' };
	else return { err: false };
}
export async function changeName(userID, firstName, lastName) {
	const { modifiedCount } = await User.updateMany(
		{ _id: userID },
		{
			$set: { firstName: firstName, lastName: lastName },
		}
	);
	if (!modifiedCount) return { err: 'Failed Updating User' };
	else return { err: false };
}
export async function changeEmail(userID, email) {
	const { modifiedCount } = await User.updateMany(
		{ _id: userID },
		{
			$set: { email: email },
		}
	);
	if (!modifiedCount) return { err: 'Failed Updating User' };
	else return { err: false };
}

