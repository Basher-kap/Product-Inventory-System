function requireLogin(req, res, next) {
    if (!req.session.username) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    next();
}

module.exports = requireLogin;