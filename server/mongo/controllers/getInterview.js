const getInterview = async ({ req, res, models }) => {
  await models.Interview.findOne({ _id: req.params.id })
  .populate('project_id')
  .populate('content.atoms')
  .exec(function(err, data) {
    res.status(200).send(JSON.stringify(data));
  });
}

exports.getInterview = getInterview;