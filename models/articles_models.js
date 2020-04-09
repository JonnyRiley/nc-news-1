const connection = require("../db/connection");

exports.getAllUsers = () => {
  return connection("users")
    .returning("*")
    .then((res) => {
      if (res.length === 0) {
        return Promise.reject({ status: 404, msg: "Not-Found" });
      } else {
        return res;
      }
    });
};

exports.selectUserById = (user_id) => {
  if (!isNaN(user_id)) {
    return (
      connection("users")
        .select("users.*")
        .where("users.user_id", "=", user_id)
        .groupBy("users.user_id")
        // .modify(function (articleQuery) {
        //   if (user_id) articleQuery.where("users.user_id", "=", user_id);
        // })
        .then((res) => {
          if (res.length === 0) {
            return Promise.reject({ status: 404, msg: "Not-Found" });
          } else {
            return res;
          }
        })
    );
  } else {
    return Promise.reject({ status: 400, msg: "Not-Found" });
  }
};

// exports.checkUserIdExists = (user_id) => {
//   return connection("users")
//     .select("*")
//     .where("users.user_id", "=", user_id)
//     .then((userRows) => {
//       if (userRows.length === 0) {
//         return false;
//       } else return true;
//     });
// };

exports.insertUser = (username, email) => {
  return connection("users")
    .insert({ username, email })
    .then((res) => {
      console.log(res);
      return res;
    });
};
