const db = require('../database');

const fetchUserSettingsFromDatabase = (user_id) => {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM user_settings WHERE user_id = ?;`;
        db.all(query, [user_id], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows[0]);
            }
        });
    });
};

const getUserSettings = async (req, res) => {
    if (req.session && req.session.user) {
        try {
            const settingsRecord = await fetchUserSettingsFromDatabase(req.session.user.id);

            return res.status(200).json({ settings: settingsRecord });
        } catch (error) {
            return res.status(500).json({ message: error.messsage });
        }
    } else {
        return res.status(404).json({ message: 'User not found in session' });
    }
};

module.exports = getUserSettings;