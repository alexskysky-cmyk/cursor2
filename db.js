const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

// Initialize tables
const init = () => {
	db.serialize(() => {
		db.run(`CREATE TABLE IF NOT EXISTS cars (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			name TEXT,
			brand TEXT,
			price_per_day INTEGER,
			description TEXT,
			image_url TEXT
		)`);

		db.run(`CREATE TABLE IF NOT EXISTS bookings (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			car_id INTEGER,
			customer_name TEXT,
			customer_email TEXT,
			customer_phone TEXT,
			start_date TEXT,
			end_date TEXT,
			status TEXT DEFAULT 'Pending',
			FOREIGN KEY(car_id) REFERENCES cars(id)
		)`);

		db.run(`CREATE TABLE IF NOT EXISTS contacts (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			name TEXT,
			email TEXT,
			message TEXT,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		)`);

		// Seed minimal cars if empty
		db.get('SELECT COUNT(*) as count FROM cars', (err, row) => {
			if (err) return;
			if (row && row.count === 0) {
				const stmt = db.prepare(`INSERT INTO cars (name, brand, price_per_day, description, image_url) VALUES (?, ?, ?, ?, ?)`);
				stmt.run('Avanza', 'Toyota', 350000, 'MPV irit dan nyaman untuk keluarga', 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?q=80&w=1200&auto=format&fit=crop');
				stmt.run('Civic', 'Honda', 650000, 'Sedan sporty dan nyaman', 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop');
				stmt.run('Fortuner', 'Toyota', 950000, 'SUV tangguh untuk berbagai medan', 'https://images.unsplash.com/photo-1619767886558-efdc259cde1d?q=80&w=1200&auto=format&fit=crop');
				stmt.finalize();
			}
		});
	});
};

module.exports = { db, init };