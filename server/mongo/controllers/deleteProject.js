const {ForEach} = require("../../utils");

const deleteProject = async ({ req, res, models }) => {
  const { id } = req.body;
  try {
    const project = await models.Project.findOne({ _id: id })
      .populate('interviews');
    await ForEach(project.interviews, async (interview) => {
      interview.project_id = null;
      await interview.save();
    });
    res.status(200).send({ success: true, ...project });
    await project.deleteOne();
  } catch (err) {
    console.log(err);
    res.status(500).send('error deleting project');
  }
}

exports.deleteProject = deleteProject;