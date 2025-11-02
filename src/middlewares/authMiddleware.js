const jwt = require('jsonwebtoken');
const globalCalls = require('../utils/globalCalls');

exports.verifyToken = (req, res, next) => {
  try {
    const token = req.headers['authorization']?.split(" ")[1];
    if (!token) return globalCalls.badRequest(res, "Access denied. No token provided.");

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return globalCalls.badRequest(res, "Invalid or expired token");
      req.user = decoded;
      next();
    });
  } catch (error) {
    return globalCalls.serverError(res, error.message);
  }
};
