const db = require('../database');

const fetchAllScoreboardRecordsFromDatabase = (userId) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT players.name AS player_name, scoreboard.score, scoreboard.game_time, scoreboard.game_timestamp
            FROM scoreboard
            INNER JOIN players ON scoreboard.player_id = players.id
            WHERE scoreboard.user_id = ?;
            `;
        db.all(query, [userId], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};

const getScoreboardData = async (req, res) => {
    if (req.session && req.session.user) {
        try {
            const scoreboardRecords = await fetchAllScoreboardRecordsFromDatabase(req.session.user.id);

            return res.status(200).json({ scoreboard: scoreboardRecords });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    } else {
        return res.status(404).json({ message: 'User not found in session' });
    }
};

module.exports = getScoreboardData;