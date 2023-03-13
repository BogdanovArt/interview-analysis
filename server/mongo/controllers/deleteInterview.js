const deleteInterview = async ({ req, res, models }) => {
  const { id } = req.body;

  try {
    const Interview = await models.Interview.findOne({ _id: id }).populate({
      path: "content.atoms",
      populate: { path: "nodes" },
    });

    const AtomNodeIds = [];
    const AtomIds = Interview.content.atoms.map((Atom) => {
      AtomNodeIds.push(...Atom.nodes.map((AtomNode) => AtomNode._id));
      return Atom._id;
    });

    await models.AtomNode.deleteMany({ _id: { $in: AtomNodeIds } });
    await models.Atom.deleteMany({ _id: { $in: AtomIds } });
    await models.Interview.deleteOne({ _id: id });

    res
      .status(200)
      .send({ success: true, data: { Interview, AtomNodeIds, AtomIds } });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.deleteInterview = deleteInterview;
