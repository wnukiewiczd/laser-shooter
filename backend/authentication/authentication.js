const authenticationUtils = require('./utils');
const db = require('../database');

const authenticateUser = (login, password) => {
    return new Promise((resolve, reject) => {
        db.get('SELECT id, login, password_hash FROM users WHERE login = ?', [login], async (err, row) => {
            if (err) {
                return reject({ status: 500, message: 'Database error' });
            }

            if (!row) {
                return reject({ status: 401, message: 'Invalid login or password' });
            }

            try {
                const isValid = await authenticationUtils.comparePassword(password, row.password_hash);

                if (isValid) {
                    resolve({ status: 200, message: 'Authenticated', user: { id: row.id, login: row.login } });
                } else {
                    reject({ status: 401, message: 'Invalid login or password' });
                }
            } catch (error) {
                reject({ status: 500, message: 'Error comparing password' });
            }
        });
    });
};

module.exports = { authenticateUser };