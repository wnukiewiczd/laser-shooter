const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./point-tag.db', (err) => {
    if (err) {
        console.error('Error connecting to database:', err.message);
    } else {
        console.log('Connected to the SQLite point-tag database.');
    }
});

module.exports = db;