const getProject = ({ req, res, models }) => {
  models.Project.findOne({ _id: req.params.project })
  .populate({
    path: 'interviews'
  })
  .exec(function (err, data) {
    res.status(200).send(JSON.stringify(data));
  });
}

exports.getProject = getProject;