const checkSession = (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: 'You are not authorized' });
    }

    res.status(200).json({ message: 'You are authorized', user: req.session.user });
};

module.exports = checkSession;