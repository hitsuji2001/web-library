const express	= require('express');
const sha256	= require('js-sha256');
const mysql	= require('../database/connection.js');
const router	= express.Router();

function get_user(req) {
    let user = {
	username	: req.body.username.trim(),
	password	: sha256(req.body.password),
	firstname	: req.body.firstName.trim(),
	lastname	: req.body.lastName.trim(),
	email		: req.body.email.trim(),
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
		console.log(rows);
		if (rows.length != 0) resolve(false);
		else resolve(true);
	    });
	});
    });    
}

router.get('/', (req, res) => {
    res.render('signup/signup.ejs');
});

router.get('/get', (req, res) => {
    mysql.getConnection((err, connection) => {
	if (err) throw err;
	connection.query('SELECT * FROM Users', (error, rows, fields) => {
	    connection.release();
	    if (error) throw error;
	    console.log(rows);
	});
    });
});

router.post('/', (req, res) => {
    let user = get_user(req);

    validate_user(user).then(function (valid) {
	if (valid) {
	    mysql.getConnection((err, connection) => {
		if (err) throw err;
		connection.query(`INSERT INTO Users(username, password, firstname, lastname, email) VALUES (?)`,
				 [Object.values(user)], (error, result) => {
				     connection.release();
				     if (error) throw error;
				     console.log(`Successfully inserted ${result.affectedRows} record(s)`);
				 });

		res.redirect('/');
	    });
	} else {
	    res.render('signup/signup.ejs', {
		alert: 'Sorry that username is already taken',
	    });
	}
    });
});

module.exports = router;
