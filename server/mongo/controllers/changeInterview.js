const changeInterview = async ({ req, res, models }) => {
  const { id } = req.params;
  const { content, title, unbind, bind } = req.body;
  try {
    const interview = await models.Interview.findOne({ _id: id });
    
    if (title) interview.title = title;
    if (content) interview.content.text = content.text;

    if (unbind && interview.project_id) {
      const project = await models.Project.findOne({
        _id: interview.project_id,
      });
      const newIds = project.interviews.filter(
        (interview_id) => interview_id.toString() !== id.toString()
      );
      project.interviews = newIds;
      interview.project_id = null;
      await project.save();
    }
    if (bind) {
      const project = await models.Project.findOne({ _id: bind });
      const match = project.interviews.includes(interview._id);
      interview.project_id = bind;
      if (!match) {
        project.interviews.push(interview._id);
        await project.save();
      }
    }
    await interview.save();

    const populated = await models.Interview.findOne({ _id: id })
      .populate({ path: "content.atoms", populate: { path: "nodes" } })
      .populate("project_id");
    res.status(201).send(JSON.stringify(populated));
  } catch (err) {
    console.log(err);
    res.status(500).send(JSON.stringify(err));
  }
};

exports.changeInterview = changeInterview;
