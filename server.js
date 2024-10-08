const express = require('express');
const connection = require('./models/db'); // Import your db connection

const app = express();
const port = process.env.PORT || 3000;

// Route to test database connection
app.get('/test-db', (req, res) => {
  connection.query('SELECT 1 + 1 AS solution', (error, results, fields) => {
    if (error) {
      res.status(500).send('Database connection failed: ' + error);
    } else {
      res.send('Database connection successful! Result: ' + results[0].solution);
    }
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
