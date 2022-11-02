const express	= require('express');
const sha256	= require('js-sha256');
const mysql	= require('../database/connection.js');
const router	= express.Router();

function get_user(req) {
    let user = {
	username	: req.body.username.trim(),
	password	: sha256(req.body.password),
    }

    return user;
}

function validate_user(user) {
    return new Promise(function(resolve, reject) {
	mysql.getConnection((err, connection) => {
	    if (err) throw err;
	    connection.query('SELECT * FROM Users WHERE username = (?)', [user.username], (error, rows, fields) => {
		connection.release();
		if (error) throw error;
		if (rows.length != 0 && rows[0].password == user.password) resolve(true);
		else resolve(false);
	    });
	});
    });
}

router.get('/', (req, res) => {
    res.render('login/login.ejs');
});

router.post('/', (req, res) => {
    let user = get_user(req);

    validate_user(user).then(function (valid) {
	if (valid) {
	    let full_user = {};
	    mysql.getConnection((err, connection) => {
		if (err) throw err;
		connection.query('SELECT * FROM Users WHERE username = (?)', [user.username], (error, rows, fields) => {
		    if (error) throw error;
		    full_user = rows[0];
		});
		connection.query('SELECT * FROM Books', (error, rows, fields) => {
		    connection.release();
		    if (error) throw error;
		    console.log(full_user);
		    res.render('books/dashboard.ejs', {
			user: full_user,
			books: rows
		    });
		});
	    });
	    
	    // res.redirect('/books');
	} else {
	    res.render('login/login.ejs', {
		alert: 'Username or Password is incorrect',
	    });
	}
    });
});

module.exports = router;
