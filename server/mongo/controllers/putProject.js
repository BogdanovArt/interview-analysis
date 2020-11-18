const putProject = ({ req, res, models }) => {
  const { name } = req.body;
  const Project = new models.Project({
    name,
  });
  Project
    .save()
    .then((doc) => {
      res.status(200).send({
        success: true,
        data: doc,
      });
    })
    .catch((err) => {
      res.status(500).send(err);
    })
  ;
}

exports.putProject = putProject;