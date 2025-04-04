const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const serviceAccount = require('./key.json');

const app = express();
const port = 5000;

// Initialize Firebase
initializeApp({
    credential: cert(serviceAccount),
});
const db = getFirestore();

// Middleware
app.use(express.static('public2'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Import Routes
const authRoutes = require('./routes/auth');
const searchRoutes = require('./routes/search');
// Adjust the path as necessary

// Use Routes
app.use(authRoutes);
app.use(searchRoutes);

// Home Route
app.get('/', (req, res) => {
    res.render('web');
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
