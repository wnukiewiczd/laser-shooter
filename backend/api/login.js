const userAuthenticator = require('../authentication/authentication');

const login = async (req, res) => {
    const { login, password } = req.body;

    try {
        const { status, message, user } = await userAuthenticator.authenticateUser(login, password);


        if (user) {
            req.session.user = {
                id: user.id,
                login: user.login
            };
            req.session.save();
        }

        res.status(status).json({ message });
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message || 'Something went wrong' });
    }
};

module.exports = login;