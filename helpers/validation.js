function verifyUser(req, res, next) {
  if (!req.user) {
    const err = new Error('Unauthorized Access');
    err.status = 401;
    return next(err);
  } else {
    next();
  }
}

module.exports = { verifyUser };
