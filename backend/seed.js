const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Define the path for the SQLite database file
const dbPath = path.resolve(__dirname, 'invoices.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Error opening database: " + err.message);
    } else {
        console.log("Connected to SQLite database.");
    }
});

// Create the invoices table if it doesn't exist and insert dummy data
db.serialize(() => {
    // Create invoices table
    db.run(
        `CREATE TABLE IF NOT EXISTS invoices (
       invoice_no TEXT PRIMARY KEY,
       amount REAL,
       date TEXT
     )`,
        (err) => {
            if (err) {
                console.log("Table creation error: " + err.message);
            } else {
                console.log("Invoices table created or already exists.");
            }
        }
    );

    // Insert dummy data into invoices table
    const insert = `INSERT INTO invoices (invoice_no, amount, date) VALUES (?, ?, ?)`;
    db.run(insert, ["INV001", 100.50, "2024-10-01"]);
    db.run(insert, ["INV002", 250.75, "2024-10-15"]);
    db.run(insert, ["INV003", 180.20, "2024-10-20"]);
    db.run(insert, ["INV004", 300.00, "2024-10-25"]);
    db.run(insert, ["INV005", 125.50, "2024-10-26"]);

    console.log("Inserted dummy data into invoices table.");
});

// Close the database connection
db.close((err) => {
    if (err) {
        console.error(err.message);
    }
    console.log("Database connection closed.");
});
