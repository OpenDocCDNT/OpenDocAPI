const headerFiller = (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  return next();
}

module.exports = headerFiller;
