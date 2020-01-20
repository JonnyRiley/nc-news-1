exports.customErrors = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
};

exports.psqlErrors = (err, req, res, next) => {
  const psql = ["42703", "22P02", "23505", "42601", "42803"];

  if (psql.includes(err.code)) {
    res.status(400).send({ msg: "Bad Request" });
  } else next(err);
};

exports.serverErrors = (err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error" });
};

exports.send405Error = (req, res, next) => {
  res.status(405).send({ msg: "Method not allowed" });
};
