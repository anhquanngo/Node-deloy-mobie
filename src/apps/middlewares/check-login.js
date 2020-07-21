module.exports = function (req, res, next) {
  if (req.session.user) {
    return res.redirect("/admin/dashboard");
  }
  next();
};
