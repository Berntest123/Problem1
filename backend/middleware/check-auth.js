const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, "secret_this_should_be_longer");      // the package also needs to know the secret to varify the token
    next();     // The execution will continue
  } catch (error) {
    res.status(401).json({ message: "Auth failed!" });
  }
};
