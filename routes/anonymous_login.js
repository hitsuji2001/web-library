const express = require('express');
const mysql = require('../database/connection.js');
const router = express.Router();

router.use('/static', express.static(__dirname + '/../public'));

router.get('/', (req, res) => {
    mysql.getConnection((err, connection) => {
	if (err) throw err;
	connection.query('SELECT * FROM Books', (error, rows, fields) => {
	    connection.release();
	    if (error) throw error;
	    res.render('books/dashboard.ejs', {
		books: rows,
		user_type: 'anonymous'
	    });
	});
    });
});

router.get('/view/:bookID', (req, res) => {
    let index = req.params.bookID;
    mysql.getConnection((err, connection) => {
	if (err) throw err;
	connection.query('SELECT * FROM Books WHERE id = (?)', [index], (error, rows, fields) => {
	    connection.release();
	    if (error) throw error;
	    res.render('books/book_instance.ejs', {
		method: 'GET',
		h1_title: 'View',
		book: rows[0],
		user_type: 'anonymous',
		book_id: index,
	    });
	});
    });
});

module.exports = router;
