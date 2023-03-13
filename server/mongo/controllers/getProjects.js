const getProjects = async ({ req, res, models }) => {
  const Projects = await models.Project.find({});  
  res.status(200).send(JSON.stringify(Projects));
}

exports.getProjects = getProjects;