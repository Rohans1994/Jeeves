// Access control
module.exports = function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()){
      return next();
    }
    else {
      req.flash('danger','Please Login');
      res.redirect('/users/login');
    }
  }