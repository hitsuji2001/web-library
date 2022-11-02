require('dotenv').config();
const path		= require('path');
const express		= require('express');
const fileUpload	= require('express-fileupload');
const mysql		= require('./database/connection.js');
const booksRouter	= require('./routes/books.js');
const loginRouter	= require('./routes/login.js');
const signUpRouter	= require('./routes/signup.js');
const reset_db		= require('./database/reset_database.js');

const app		= express();
const port		= process.env.WEB_PORT;
const hostname		= process.env.WEB_HOST;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/static', express.static(__dirname + '/public'));
app.use('/clients_images', express.static(__dirname + '/clients_images'));

app.use(fileUpload({}));

// reset_db.reset_database();
// reset_db.insert_data();

app.use('/books', booksRouter);
app.use('/signup', signUpRouter);
app.use('/', loginRouter);

app.get('*', (req, res) => {
    res.sendFile('./public/errors/index.html', {root: __dirname});
});

app.listen(port, hostname, () => {
    console.log(`Started server at "${hostname}:${port}"`);
});
