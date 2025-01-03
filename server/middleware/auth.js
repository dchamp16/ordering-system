const verifyAdmin = (req, res, next) => {
  console.log("Session user:", req.session?.user);
  if (req.session?.user?.role === "admin") {
    return next();
  }
  return res.status(403).json({ error: "Access denied" });
};
module.exports = { verifyAdmin };
