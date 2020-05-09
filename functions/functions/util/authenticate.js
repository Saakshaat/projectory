const { authenticated } = require('../handlers/users');

module.exports = {
  isAuthenticated: function (req, res, next) {
    if (authenticated !== null) {
        req.user = authenticated;
      next();
    } else {
        console.error('User not signed in.')
        return res.status(403).json({ error: `Authentication Error` });
    }
  },
};
