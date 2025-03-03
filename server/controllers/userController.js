const db = require('../models/query');
const bcrypt = require('bcryptjs');

const userController = {};

// CREATE new user account
userController.addUser = (req, res, next) => {
	const { firstname, lastname, username, email, password } = req.body;
	const salt = bcrypt.genSaltSync(10);
	const hashed_password = bcrypt.hashSync(password, salt);
	const queryString = `INSERT INTO users(firstname,
		lastname,
		username,
    email,
		hashed_password)
    VALUES('${firstname}', '${lastname}', '${username}', '${email}', '${hashed_password}')`;
	db.query(queryString)
		.then(() => {
			console.log('success');
			return next();
		})
		.catch((err) => {
			// res.redirect('/createAccount');
			return next({ log: err, message: 'userController.addUser failed' });
		});
};

// DELETE user account
userController.deleteUser = (req, res, next) => {
	const { id } = req.body;
	console.log('id', id);
	const query = `DELETE FROM users WHERE _id=${id}`;
	db.query(query)
		.then(() => {
			return next();
		})
		.catch((err) => next(err));
};

// VERIFY user exists
userController.verifyUser = (req, res, next) => {
	const { username, password } = req.body;
	console.log('USER INFO:', username, password);
	// console.log('VERIFY USER:', username, password);
	const queryString = `SELECT * FROM users WHERE username='${username}'`;

	db.query(queryString)
		.then((user) => {
			// check if username exists on users table
			if (user.rows.length === 0) {
				res.locals.msg =
					'The username and password you entered did not match our records. Please double-check and try again.';
				return next();
			}

			// verify login information
			const verified = bcrypt.compareSync(
				password,
				user.rows[0].hashed_password
			);

			console.log('USERCONTROLLER.VERIFYUSER verified:', verified)

			if (verified) {
				req.session.auth = true;
				// console.log('REQ SESSION authorized:', req.session);
				console.log('REQ SESSION authorized');
				res.locals.msg = 'You have been successfully logged in.';
			} else {
				// console.log('REQ SESSION not authorized:', req.session);
				console.log('REQ SESSION not authorized');
				res.locals.msg =
					'The username and password you entered did not match our records. Please double-check and try again.';
			}
			return next();
		})
		.catch((err) => {
			console.log('userController.verifyUser ERROR:', err)
			next(err)
		});
};

// LOGOUT
userController.logout = (req, res, next) => {
	// req.session.destroy(function (err) {
	// 	if (err) {
	// 		res.locals =
	// 			'There was a problem with logging out. Please check that you are logged in.';
	// 		return next();
	// 	}
	// 	next();
	// });
	res.locals.msg = "You're logged out!";
	return next();
};

// Check for user authentication
userController.checkAuthenticated = (req, res, next) => {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/login');
};

module.exports = userController;
