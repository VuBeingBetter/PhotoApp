// Reusable function to check if user is logged in
function isAuthenticated(request, response, next) {
  if (!request.session.user) {
    return response.status(401).send("Not logged in");
  }
  next(); // Continue the route
}

module.exports = {
  isAuthenticated,
}