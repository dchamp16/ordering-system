const verifyAdmin = (req, res, next) => {
  if (
    req.session?.user?.role === "admin" ||
    req.session?.user?.role === "superadmin"
  ) {
    return next();
  }
  return res.status(403).json({ error: "Access denied" });
};

const verifySuperAdmin = (req, res, next) => {
  if (req.session?.user?.role === "superadmin") {
    return next();
  }
  return res
    .status(403)
    .json({ error: "Access denied for non-superadmin users" });
};

module.exports = { verifyAdmin, verifySuperAdmin };
