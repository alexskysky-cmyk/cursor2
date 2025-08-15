const express = require('express');
const router = express.Router();
const { db } = require('../db');

// Home - list cars
router.get('/', (req, res) => {
	db.all('SELECT * FROM cars', (err, cars) => {
		if (err) return res.status(500).send('Database error');
		res.render('home', { title: 'Rental Mobil', cars, query: req.query });
	});
});

// Booking form for a car
router.get('/booking/:carId', (req, res) => {
	const { carId } = req.params;
	db.get('SELECT * FROM cars WHERE id = ?', [carId], (err, car) => {
		if (err || !car) return res.status(404).send('Mobil tidak ditemukan');
		res.render('booking', { title: 'Pemesanan', car });
	});
});

router.post('/booking/:carId', (req, res) => {
	const { carId } = req.params;
	const { customer_name, customer_email, customer_phone, start_date, end_date } = req.body;
	db.run(
		`INSERT INTO bookings (car_id, customer_name, customer_email, customer_phone, start_date, end_date, status) VALUES (?, ?, ?, ?, ?, ?, 'Pending')`,
		[carId, customer_name, customer_email, customer_phone, start_date, end_date],
		function (err) {
			if (err) return res.status(500).send('Gagal menyimpan pemesanan');
			res.redirect('/?success=1');
		}
	);
});

// Contact page
router.get('/kontak', (req, res) => {
	res.render('contact', { title: 'Kontak', query: req.query });
});

router.post('/kontak', (req, res) => {
	const { name, email, message } = req.body;
	db.run(
		`INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)`,
		[name, email, message],
		function (err) {
			if (err) return res.status(500).send('Gagal menyimpan pesan');
			res.redirect('/kontak?success=1');
		}
	);
});

module.exports = router;