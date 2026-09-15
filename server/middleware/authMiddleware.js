module.exports = (req, res, next) => {
  const userRole = req.headers['x-user-role'];
  const userEmail = req.headers['x-user-email'];

  // Check if user is authenticated and has administrative role
  if (userRole === 'admin' || userEmail === 'admin@municipality.gov') {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: 'Access Denied: Administrative privileges required.'
  });
};
