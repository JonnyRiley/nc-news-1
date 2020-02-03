exports.formatDates = list => {
  console.log(list);
  if (list.length === 0) {
    return list;
  } else {
    const newData = [];
    list.forEach(time => {
      const createdTime = { ...time };
      createdTime.created_at = new Date(createdTime.created_at);
      newData.push(createdTime);
    });
    return newData;
  }
};

exports.makeRefObj = (list, key, value) => {
  const obj = {};
  list.forEach(entry => {
    obj[entry[key]] = entry[value];
  });
  return obj;
};

exports.formatComments = (comments, articleRef) => {
  return comments.map(iteratedComment => {
    const newComments = { ...iteratedComment };

    const alteredObj = {
      body: newComments.body,
      article_id: articleRef[newComments.belongs_to],
      author: newComments.created_by,
      votes: newComments.votes,
      created_at: new Date(newComments.created_at)
    };

    return alteredObj;
  });
};
