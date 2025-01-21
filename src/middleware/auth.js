// 🔐 Authentication Middleware
const isAdmin = (req, res, next) => {
    if (req.session && req.session.isAdmin) {
        return next();
    }
    res.redirect('/auth/login');
};

// 🛡️ API Authentication
const isAdminAPI = (req, res, next) => {
    if (req.session && req.session.isAdmin) {
        return next();
    }
    res.status(401).json({ error: 'Unauthorized' });
};

module.exports = {
    isAdmin,
    isAdminAPI
};
