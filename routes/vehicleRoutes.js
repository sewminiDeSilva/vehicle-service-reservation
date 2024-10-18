// routes/vehicleRoutes.js

const express = require('express');
const connection = require('../models/db'); // Database connection
const { check, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const router = express.Router();

// Middleware to check if the user is authenticated
const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).send('Unauthorized');
};

// Define rate limiter middleware
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again after 15 minutes"
});

// POST route to reserve vehicle service
router.post('/reserve', isAuthenticated, (req, res) => {
    const { date, time, location, vehicle_no, mileage, message } = req.body;
    const username = req.user.name.givenName; // Updated to use givenName for username

    // Validate input (you can expand this validation)
    if (!date || !time || !location || !vehicle_no || !mileage) {
        return res.status(400).send('All fields are required');
    }

    // Insert reservation into the database
    const query = 'INSERT INTO reservations (date, time, location, vehicle_no, mileage, message, username) VALUES (?, ?, ?, ?, ?, ?, ?)';
    connection.query(query, [date, time, location, vehicle_no, mileage, message, username], (error, results) => {
        if (error) {
            console.error('Error inserting reservation:', error);
            return res.status(500).send('Error reserving vehicle service');
        }
        res.status(201).send('Reservation created successfully');
    });
});

// GET route to fetch reservations for the authenticated user
router.get('/reservations', isAuthenticated, (req, res) => {
    const username = req.user.name.givenName; // Updated to use givenName for username
    
    // Query to fetch reservations from the database
    const query = 'SELECT * FROM reservations WHERE username = ?';

    connection.query(query, [username], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err });
        }
        res.status(200).json(results); // Return the results as JSON
    });
});

module.exports = router;
