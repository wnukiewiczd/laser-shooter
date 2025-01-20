const db = require('../database');

const deletePlayerFromDatabase = ({ userId, playerName }) => {
    return new Promise((resolve, reject) => {
        const query = `
            DELETE FROM players 
            WHERE user_id = ? AND name = ?;
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

const deletePlayer = async (req, res) => {
    if (req.session && req.session.user) {
        try {
            const { playerName } = req.body;
            const userId = req.session.user.id;

            const deleteResponse = await deletePlayerFromDatabase({ userId, playerName });

            if (deleteResponse.changes) {
                return res.status(200).json({ message: "Player record deleted successfully" });
            } else {
                return res.status(404).json({ message: "Player record not found" });
            }
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    } else {
        return res.status(404).json({ message: 'User not found in session' });
    }
};

module.exports = deletePlayer;
