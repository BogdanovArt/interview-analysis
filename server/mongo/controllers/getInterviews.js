const getInterviews = async ({ req, res, models }) => {
  const Interviews = await models.Interview.find({ project_id: null });
  res.status(200).send(JSON.stringify(Interviews));
}

exports.getInterviews = getInterviews;
