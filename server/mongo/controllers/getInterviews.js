const getInterviews = ({ req, res, models }) => {
  models.Interview.find({ project_id: null }).exec(function (err, data) {
    res.status(200).send(JSON.stringify(data));
  });
}

exports.getInterviews = getInterviews;