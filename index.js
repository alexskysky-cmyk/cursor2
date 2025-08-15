const express = require('express');
const path = require('path');
const morgan = require('morgan');
const methodOverride = require('method-override');
const { db, init } = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// Init DB
init();

// Middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use('/public', express.static(path.join(__dirname, 'public')));

// View engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Routes
const publicRoutes = require('./routes/public');
const adminRoutes = require('./routes/admin');
app.use('/', publicRoutes);
app.use('/admin', adminRoutes);

// 404
app.use((req, res) => {
	res.status(404).render('404', { title: 'Tidak Ditemukan' });
});

app.listen(PORT, () => {
	console.log(`Server berjalan di http://localhost:${PORT}`);
});