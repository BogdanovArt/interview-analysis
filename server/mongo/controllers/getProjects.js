const getProjects = ({ req, res, models }) => {
  models.Project.find({}).exec(function (err, data) {
    res.status(200).send(JSON.stringify(data));
  });
}

exports.getProjects = getProjects;