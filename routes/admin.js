const express = require('express');
const router = express.Router();
const { db } = require('../db');

// Admin dashboard
router.get(['/','/dashboard'], (req, res) => {
	const data = {};
	db.all('SELECT * FROM cars', (err, cars) => {
		if (err) return res.status(500).send('DB error');
		data.cars = cars || [];
		db.all(`SELECT bookings.*, cars.name as car_name FROM bookings LEFT JOIN cars ON cars.id = bookings.car_id ORDER BY bookings.id DESC`, (err2, bookings) => {
			if (err2) return res.status(500).send('DB error');
			data.bookings = bookings || [];
			res.render('admin/dashboard', { title: 'Admin Dashboard', ...data });
		});
	});
});

// Cars - add form
router.get('/mobil/tambah', (req, res) => {
	res.render('admin/car_form', { title: 'Tambah Mobil', car: null });
});

router.post('/mobil/tambah', (req, res) => {
	const { name, brand, price_per_day, description, image_url } = req.body;
	db.run(
		`INSERT INTO cars (name, brand, price_per_day, description, image_url) VALUES (?, ?, ?, ?, ?)`,
		[name, brand, price_per_day, description, image_url],
		function (err) {
			if (err) return res.status(500).send('Gagal menambah mobil');
			res.redirect('/admin/dashboard');
		}
	);
});

// Cars - edit form
router.get('/mobil/edit/:id', (req, res) => {
	const { id } = req.params;
	db.get('SELECT * FROM cars WHERE id = ?', [id], (err, car) => {
		if (err || !car) return res.status(404).send('Mobil tidak ditemukan');
		res.render('admin/car_form', { title: 'Edit Mobil', car });
	});
});

router.post('/mobil/edit/:id', (req, res) => {
	const { id } = req.params;
	const { name, brand, price_per_day, description, image_url } = req.body;
	db.run(
		`UPDATE cars SET name=?, brand=?, price_per_day=?, description=?, image_url=? WHERE id=?`,
		[name, brand, price_per_day, description, image_url, id],
		function (err) {
			if (err) return res.status(500).send('Gagal mengupdate mobil');
			res.redirect('/admin/dashboard');
		}
	);
});

router.post('/mobil/hapus/:id', (req, res) => {
	const { id } = req.params;
	db.run(`DELETE FROM cars WHERE id=?`, [id], function (err) {
		if (err) return res.status(500).send('Gagal menghapus mobil');
		res.redirect('/admin/dashboard');
	});
});

// Bookings - edit status form
router.get('/booking/edit/:id', (req, res) => {
	const { id } = req.params;
	db.get(`SELECT bookings.*, cars.name as car_name FROM bookings LEFT JOIN cars ON cars.id = bookings.car_id WHERE bookings.id = ?`, [id], (err, booking) => {
		if (err || !booking) return res.status(404).send('Pesanan tidak ditemukan');
		res.render('admin/booking_form', { title: 'Edit Pesanan', booking });
	});
});

router.post('/booking/edit/:id', (req, res) => {
	const { id } = req.params;
	const { status } = req.body;
	db.run(`UPDATE bookings SET status=? WHERE id=?`, [status, id], function (err) {
		if (err) return res.status(500).send('Gagal mengupdate pesanan');
		res.redirect('/admin/dashboard');
	});
});

router.post('/booking/hapus/:id', (req, res) => {
	const { id } = req.params;
	db.run(`DELETE FROM bookings WHERE id=?`, [id], function (err) {
		if (err) return res.status(500).send('Gagal menghapus pesanan');
		res.redirect('/admin/dashboard');
	});
});

// Messages page
router.get('/pesan', (req, res) => {
	db.all(`SELECT * FROM contacts ORDER BY created_at DESC`, (err, messages) => {
		if (err) return res.status(500).send('DB error');
		res.render('admin/messages', { title: 'Pesan Kontak', messages });
	});
});

module.exports = router;