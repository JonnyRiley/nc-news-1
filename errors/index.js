exports.customErrors = (err, req, res, next) => {
  // if (err.status) res.status(err.status).send({ msg: err.msg });
  // else next(err);

  if (err.status) {
    console.log(err, "In app error else");
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
};

exports.psqlErrors = (err, req, res, next) => {
  const psql = ["42703", "22P02", "23505", "42601"];
  console.log(err.code, "In app error");
  if (psql.includes(err.code))
    res.status(400).send({ msg: err.message || "Bad Request" });
  else next(err);
};

// exports.handlePsqlErrors = (err, req, res, next) => {
//   const psqlBadRequestCodes = ['22P02'];
//   if (psqlBadRequestCodes.includes(err.code))
//     res.status(400).send({ msg: err.message || 'Bad Request' });
//   else next(err);
// };
// if (err.code) {
//   const psql = {
//     "42703": "Invalid column provided"],
//     "22P02": "Bad Request - Invalid column provided"],
//     "23505": "column already exists",
//     "42601": "Bad Request"
//   };

exports.serverErrors = (err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error" });
  next(err);
};

exports.send405Error = (req, res, next) => {
  res.status(405).send({ msg: "Method not allowed" });
};
