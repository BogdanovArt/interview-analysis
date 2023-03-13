const getInterview = async ({ req, res, models }) => {
  const Interview = await models.Interview.findOne({ _id: req.params.id })
    .populate("project_id")
    .populate({ path: "content.atoms", populate: { path: "nodes" } });

  res.status(200).send(JSON.stringify(Interview));
};

exports.getInterview = getInterview;
