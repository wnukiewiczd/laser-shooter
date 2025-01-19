const db = require('../database');

const newScoreRecordInDatabase = ({ userId, playerId, score, gameTime }) => {
    return new Promise((resolve, reject) => {
        const query = `
            INSERT INTO scoreboard (user_id, player_id, score, game_time) 
            VALUES (?, ?, ?, ?);
        `;
        db.run(query, [userId, playerId, score, gameTime], function (err) {
            if (err) {
                reject(err);
            } else {
                resolve({ changes: this.changes });
            }
        });
    });
};

const newScoreRecord = async (req, res) => {
    if (req.session && req.session.user) {
        try {
            const { playerId, score, gameTime } = req.body;
            const userId = req.session.user.id;

            const insertResponse = await newScoreRecordInDatabase({ userId, playerId, score, gameTime });

            if (insertResponse.changes) {
                return res.status(200).json({ message: "Score record inserted successfully" });
            } else {
                return res.status(500).json({ message: "Score record not inserted into database" });
            }
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    } else {
        return res.status(404).json({ message: 'User not found in session' });
    }
};

module.exports = newScoreRecord;