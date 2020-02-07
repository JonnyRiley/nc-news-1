exports.customErrors = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
};

exports.psqlErrors = (err, req, res, next) => {
  const badRequest = ["23503", "22P02"];
  const psql = ["42703", "23505", "42601", "42803", "23502", "42712"];

  if (psql.includes(err.code)) {
    res.status(400).send({ msg: "Bad Request" });
  } else if (badRequest.includes(err.code)) {
    res.status(404).send({ msg: "Not Found" });
  } else next(err);
};

exports.serverErrors = (err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error" });
};

exports.send405Error = (req, res, next) => {
  res.status(405).send({ msg: "Method not allowed" });
};

exports.all404Errors = (request, response, next) => {
  next({ status: 404, msg: "Route pathway NOT FOUND" });
};
