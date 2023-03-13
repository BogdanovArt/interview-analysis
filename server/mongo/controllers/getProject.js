const getProject = async ({ req, res, models }) => {
  const Project = await models.Project.findOne({ _id: req.params.project })
    .populate("interviews");
  
  res.status(200).send(JSON.stringify(Project));
};

exports.getProject = getProject;
