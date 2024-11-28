const db = require('../database');

const listUserPlayers = (req, res) => {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM players WHERE user_id = ?;`;
        db.all(query, [req.body.user_id], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};

module.exports = listUserPlayers;