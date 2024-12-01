const db = require('../database');

const updateUserSettingsInDatabase = ({ user_id, sound_enabled, target_color }) => {
    return new Promise((resolve, reject) => {
        const query = `
            UPDATE user_settings 
            SET sound_enabled = ?, target_color = ? 
            WHERE user_id = ?;
        `;
        db.run(query, [sound_enabled, target_color, user_id], function (err) {
            if (err) {
                reject(err);
            } else {
                resolve({ changes: this.changes });
            }
        });
    });
};

const updateUserSettings = async (req, res) => {
    if (req.session && req.session.user) {
        try {
            const { sound_enabled, target_color } = req.body;
            const insertResponse = await updateUserSettingsInDatabase({ user_id: req.session.user.id, sound_enabled, target_color });
            if (insertResponse.changes) {
                return res.status(200).json({ message: "Settings updated in the database" });
            } else {
                return res.status(500).json({ message: "Settings not updated in database" });
            }
        } catch (error) {
            return res.status(500).json({ message: error.messsage });
        }
    } else {
        return res.status(404).json({ message: 'User not found in session' });
    }
};

module.exports = updateUserSettings;