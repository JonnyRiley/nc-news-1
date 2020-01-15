const connection = require("../db/connection");

exports.selectTopics = () => {
  console.log("im in the models");
  return connection("topics")
    .returning("*")
    .then(function(mystery) {
      //console.log(mystery);
      return mystery;
    });
};

// const db = require("../db/connection");
// const deleteHouse = ({ id }) => {
//   return connection("houses")
//     .where("house_id", id)
//     .del()
//     .then(function(mystery) {
//       console.log(mystery);
//     });
// };
