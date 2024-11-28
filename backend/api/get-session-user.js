const getSessionUser = (req, res) => {
    if (req.session && req.session.user) {
        return res.status(200).json({ user: req.session.user });
    } else {
        return res.status(404).json({ message: 'User not found in session' });
    }
};

module.exports = getSessionUser;