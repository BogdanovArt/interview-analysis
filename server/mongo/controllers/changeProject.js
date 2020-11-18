const changeProject = ({ req, res, models }) => {
  const { id, name } = req.body;
  models.Project.updateOne({ _id: id }, { name }, (err, doc) => {
    if (err) {
      res.status(500).send(JSON.stringify(err));
    } else if (doc.nModified) {
      res.status(201).send({ success: true, ...doc });
    } else {
      res.status(500).send('nothing to modify');
    }
  });
}

exports.changeProject = changeProject;