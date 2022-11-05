const express		= require('express');
const mysql		= require('../database/connection.js');
const anonymousRouter	= require('./anonymous_login.js');
const router		= express.Router();

router.use('/anonymous/', anonymousRouter);

function validate(book) {
    return new Promise(function(resolve, reject) {
	if (book.title.trim() == '' || book.author.trim() == '' || book.category.trim() == '') resolve(false);
	else resolve(true);
    });
}

function validate_new(book) {
    return new Promise(function(resolve, reject) {
	mysql.getConnection((err, connection) => {
	    if (err) throw err;
	    connection.query('SELECT * FROM Books WHERE title = (?)', [book.title], (error, rows, fields) => {
		connection.release();
		if (error) throw error;
		if (rows.length != 0) {
		    resolve(false);
		} else if (book.title.trim() == '' || book.author.trim() == '' || book.category.trim() == '') resolve(false);
		else resolve(true);
	    });
	});
    });
}

function download_image(req) {
    let cover_image = '';
    if (!req.files || Object.keys(req.files).length === 0) {
	console.log('No images were uploaded');
    } else {
	cover_image = req.files.cover_image;
	let uploadPath = __dirname + '/../clients_images/' + cover_image.name;

	cover_image.mv(uploadPath, (err) => {
	    if (err) res.status(500).send(err);
	});
    }
    return cover_image;
}

function get_book(req) {
    let cover_image = download_image(req);
    var book = {
	title		: req.body.title.trim(),
	author		: req.body.author.trim(),
	description	: req.body.description.trim(),
	release_date	: req.body.release_date,
	pages		: req.body.pages,
	category	: req.body.category.trim(),
	cover_image	: cover_image == '' ? '' : '../../clients_images/' + cover_image.name,
    };

    return book;
}

router.get('/', (req, res) => {
    mysql.getConnection((err, connection) => {
	if (err) throw err;
	connection.query('SELECT * FROM Books', (error, rows, fields) => {
	    connection.release();
	    if (error) throw error;
	    res.render('books/dashboard.ejs', { books: rows });
	});
    });
});

router.get('/add', (req, res) => {
    let book = { title: '', author: '', description: '', release_date: '', pages: '', category: '', cover_image: '' };

    res.render('books/book_instance.ejs', {
	method: 'POST',
	action: `/books/add`,
	book: book,
	h1_title: 'Create new',
    });
});

router.post('/add', (req, res) => {
    let book = get_book(req);
    validate_new(book).then(function (valid) {
	if (valid) {
	    mysql.getConnection((err, connection) => {
		if (err) throw err;
		connection.query(`INSERT INTO Books(title, author, description, release_date, pages, category, cover_image) VALUES (?)`,
				 [Object.values(book)],
				 (error, result) => {
				     connection.release();
				     if (error) throw error;
				     console.log(`Successfully inserted ${result.affectedRows} record(s)`);
				 });
	    });
	    res.redirect('/books');
	} else {
	    res.render('books/book_instance.ejs', {
		method: 'POST',
		action: `/books/add`,
		book: book,
		alert: 'Book title already exist',
		h1_title: 'Create new',
	    });
	}
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
		book_id: index,
	    });
	});
    });
});

router.get('/edit/:bookID', (req, res) => {
    let index = req.params.bookID;
    mysql.getConnection((err, connection) => {
	if (err) throw err;
	connection.query('SELECT * FROM Books WHERE id = (?)', [index], (error, rows, fields) => {
	    connection.release();
	    if (error) throw error;
	    let book = rows[0];
	    res.render('books/book_instance.ejs', {
		method: 'POST',
		h1_title: 'Edit',
		action: `/books/edit/` + index,
		book: book,
	    });
	});
    });
});

router.post('/edit/:bookID', (req, res) => {
    // TODO: When user edit book, if `Clear Image` button haven't pressed once
    // Cover image should not be null

    let index = req.params.bookID;
    let book = get_book(req);
    validate(book).then(function (valid) {
	if (valid) {
	    mysql.getConnection((err, connection) => {
		if (err) throw err;
		connection.query(
		    `UPDATE Books
                 SET
                     title = ?,
                     author = ?,
                     description = ?,
                     release_date = ?,
                     pages = ?,
                     category = ?,
                     cover_image = ?
                 WHERE
                     id = ${index}`, Object.values(book),
		    (error, result) => {
			connection.release();
			if (error) throw error;
			console.log(result.affectedRows + " record(s) updated");
			res.redirect('/books');
		    });
	    });
	} else {
	    res.render('books/book_instance.ejs', {
		method: 'POST',
		h1_title: 'Edit',
		action: `/books/edit/` + index,
		book: book,
	    });
	}
    });
});

router.get('/delete/:bookID', (req, res) => {
    let index = req.params.bookID;
    mysql.getConnection((err, connection) => {
	if (err) throw err;
	connection.query(`DELETE FROM Books WHERE id = ${index}`, (error, result) => {
	    connection.release();
	    if (error) throw error;
	    console.log(result.affectedRows + " record(s) deleted");
	    res.redirect('/books');
	});
    });
});

module.exports = router;
