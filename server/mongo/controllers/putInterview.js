const putInterview = async ({ req, res, models }) => {
  const { project_id, content, title } = req.body;
  if (content) {
    try {
      const Interview = new models.Interview({
        title,
        content,
        project_id,
      });
      const doc = await Interview.save();

      const Project = await models.Project.findOne({ _id: project_id });
      Project.interviews.push(doc._id);
      await Project.save();
      
      res.status(200).send({
        success: true,
        data: doc,
      });
    } catch(err) {
      console.warn(err);
      res.status(500).send(err);
    }
  } else {
    res.status(500).send('invalid data');
  }
}

exports.putInterview = putInterview;