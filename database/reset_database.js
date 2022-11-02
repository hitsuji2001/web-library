const mysql = require('./connection.js')

let reset_database = function() {
    let create_book = `CREATE TABLE Books(
        id            INT UNSIGNED NOT NULL AUTO_INCREMENT,
        title         VARCHAR(255) NOT NULL,
        author        VARCHAR(255) NOT NULL,
        description   VARCHAR(1000),
        release_date  VARCHAR(10),
        pages         INT UNSIGNED,
        category      VARCHAR(255) NOT NULL,
        cover_image   VARCHAR(255),
        PRIMARY KEY(id)
    )`;

    let create_user = `CREATE TABLE Users(
        id        INT UNSIGNED NOT NULL AUTO_INCREMENT,
        username  VARCHAR(45)  NOT NULL,
        firstname VARCHAR(45)  NOT NULL,
        lastname  VARCHAR(45)  NOT NULL,
        password  VARCHAR(255) NOT NULL,
        email     VARCHAR(255) NOT NULL,
        role      VARCHAR(45),
        PRIMARY KEY(id)
    )`;

    mysql.getConnection((err, connection) => {
	if (err) throw err;
	connection.query('DROP TABLE IF EXISTS Books, Users', (error, result) => {
	    if (error) throw error;
	    connection.release();
	    console.log(`Succesfully dropped Table: 'Books' and 'Users'`);
	});
    });

    mysql.getConnection((err, connection) => {
	if (err) throw err;
	connection.query(create_book, (error, result) => {
	    if (error) throw error;
	    connection.release();
	    console.log("Succesfully created Table: 'Books'");
	});
    });

    mysql.getConnection((err, connection) => {
	if (err) throw err;

	connection.query(create_user, (error, result) => {
	    if (error) throw error;
	    connection.release();
	    console.log("Succesfully created Table: 'Users'");
	});
    });
}

let insert_books = function() {
    let books = [{
	title: 'Nghệ thuật giao tiếp để thành công',
	author: 'Leil Lowndes',
	description: 'Là cuốn sách hướng tới mọi đối tượng độc giả, dù là sinh viên, nhân viên bán hàng, doanh nhân, nhà quản lý, chính trị gia hay người nội trợ hoặc bất cứ ai muốn kiểm soát các mối quan hệ, thu nhập hay cuộc đời họ theo cách hiệu quả hơn...',
	release_date: '2019-02-14',
	pages: 360,
	category: 'Kỹ Năng Giao Tiếp',
	cover_image: '../../clients_images/sach-nghe-thuat-giao-tiep-de-thanh-cong-1.jpeg'
    }, {
	title: 'The Simple Path To Wealth',
	author: 'J. L. Collins',
	description: 'Collins highlights the importance of what he calls "F-you money," which he describes as enough money to be completely free of the demands of others.',
	release_date: '2017-06-24',
	pages: 212,
	category: 'Investment',
	cover_image: '../../clients_images/image.jpeg'
    }, {
	title: 'Khi Bạn Đang Mơ Thì Người Khác Đang Nỗ Lực',
	author: 'Vĩ Nhân',
	description: 'Người ta nói rằng, khả năng của con người có giới hạn, nhưng giới hạn của bạn được đến đâu thì bạn lại không hề biết. Không ít người từng băn khoăn rằng, tại sao người khác đạt được thành công nhanh như vậy mà bạn vẫn mãi vẫn dậm chân tại chỗ. ',
	release_date: '2018-11-22',
	pages: 415,
	category: 'Phát triển bản thân',
	cover_image: '../../clients_images/cdeabe1e07dc2fd2a2d99c4bd558f41f.jpg'
    }, {
	title: 'Deep work',
	author: 'Cal Newport',
	description: "One of the most valuable skills in our economy is becoming increasingly rare. If you master this skill, you'll achieve extraordinary results.",
	release_date: '2016-01-05',
	pages: 304,
	category: 'Self Help',
	cover_image: '../../clients_images/41WSUER72L._SX333_BO1204203200_.jpg'
    }, {
	title: 'Tư Duy Tối Ưu',
	author: 'Stephen R. Covey',
	description: 'Nếu làm việc chăm chỉ hơn, tài tình hơn và nhanh nhẹn hơn mà vẫn không có kết quả, thì chúng ta phải làm cách nào?',
	release_date: '2015-07-14',
	pages: 334,
	category: 'Self Help',
	cover_image: '../../clients_images/BtwS0G0oN8.webp'
    }, {
	title: 'Cha giàu cha nghèo',
	author: 'Robert T.Kiyosaki',
	description: 'Từ những bài học tưởng chừng như mâu thuẫn của hai người cha mà con đã rút ra được những kinh nghiệm lớn lao về chủ đề tiền bạc và sự lựa chọn cách sống trong đời. ',
	release_date: '2000-04-01',
	pages: 375,
	category: 'Finance',
	cover_image: '../../clients_images/Cha-giau-cha-ngheo.jpg'
    }, {
	title: 'Hoàn Thành Mọi Việc Không Hề Khó',
	author: 'David Allen',
	description: 'Thông điệp của Allen rất ngắn gọn: hãy tổ chức lại bản thân để giải phóng trí óc, tập trung vào những điều thật sự xứng đáng.',
	release_date: '2016-05-01',
	pages: 395,
	category: 'Time Management',
	cover_image: '../../clients_images/hoan_thanh_moi_viec_outline_5.7.2016-01.u2469.d20160831.t144732.26335.jpg'
    },{
	title: 'Temp',
	author: 'Temp',
	description: 'Temp',
	release_date: '2001-29-05',
	pages: 295,
	category: 'Temp',
	cover_image: ''
    }];
    for (let i = 0; i < books.length; i++) {
	mysql.getConnection((err, connection) => {
	    if (err) throw err;
	    connection.query(`INSERT INTO Books(title, author, description, release_date, pages, category, cover_image) VALUES (?, ?, ?, ?, ?, ?, ?)`,
			     Object.values(books[i]),
			     (error, result) => {
				 connection.release();
				 if (error) throw error;
				 console.log(`Successfully inserted ${result.affectedRows} record(s) into Books`);
			     });
	});
    }
}

let insert_users = function() {
    let users = [{
	username: '1justiH',
	firstname: 'Minh',
	lastname: 'Nguyen',
	password: '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92',
	email: 'hitsuji2001@gmail.com',
    }, {
	username: 'admin',
	firstname: 'Admin',
	lastname: 'Admin',
	password: '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92',
	email: 'admin@gmail.com',
    }];

    for (let i = 0; i < users.length; i++) {
	mysql.getConnection((err, connection) => {
	    if (err) throw err;
	    connection.query(`INSERT INTO Users(username, firstname, lastname, password, email) VALUES (?, ?, ?, ?, ?)`,
			     Object.values(users[i]),
			     (error, result) => {
				 connection.release();
				 if (error) throw error;
				 console.log(`Successfully inserted ${result.affectedRows} record(s) into Users`);
			     });
	});
    }
}

let insert_data = function() {
    insert_books();
    insert_users();
}

module.exports = {
    reset_database	: reset_database,
    insert_data		: insert_data
}
