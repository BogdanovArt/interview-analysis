const changeInterview = async ({ req, res, models }) => {
  const { id } = req.params;
  const { content, title, unbind, bind } = req.body;
  try {    
    const interview = await models.Interview.findOne({ _id: id });
    if (title) interview.title = title;
    if (content) interview.content = content;
    if (unbind && interview.project_id) {
      const project = await models.Project.findOne({ _id: interview.project_id })
      if (project) {
        const match = project.interviews.findIndex(id => id.toString() === interview._id.toString());
        interview.project_id = null;
        if (match >= 0) {
          project.interviews.splice(match, 1);
          project.save();
        }
      }
    }
    if (bind) {
      const project = await models.Project.findOne({ _id: bind });
      if (project) {
        const match = project.interviews.includes(interview._id);
        interview.project_id = bind;
        if (!match) {
          project.interviews.push(interview._id);
          project.save();
        }
      }
    }
    await interview.save();
    const populated = await models.Interview
      .findOne({ _id: id })
      .populate('content.atoms')
      .populate('project_id');
    res.status(201).send(JSON.stringify(populated));
  } catch(err) {
    console.log(err);
    res.status(500).send(JSON.stringify(err));    
  }
}

exports.changeInterview = changeInterview;