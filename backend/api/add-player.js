const db = require('../database');

const addPlayerInDatabase = ({ userId, playerName }) => {
    return new Promise((resolve, reject) => {
        const query = `
            INSERT INTO players (user_id, name) 
            VALUES (?, ?);
        `;
        db.run(query, [userId, playerName], function (err) {
            if (err) {
                reject(err);
            } else {
                resolve({ changes: this.changes });
            }
        });
    });
};

const addPlayer = async (req, res) => {
    if (req.session && req.session.user) {
        try {
            const { playerName } = req.body;
            const userId = req.session.user.id;

            const insertResponse = await addPlayerInDatabase({ userId, playerName });

            if (insertResponse.changes) {
                return res.status(200).json({ message: "Player record inserted successfully" });
            } else {
                return res.status(500).json({ message: "Player record not inserted into database" });
            }
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    } else {
        return res.status(404).json({ message: 'User not found in session' });
    }
};

module.exports = addPlayer;