const deleteNode = async ({ req, res, models }) => {
  const { DOM_id, _id, atom_id } = req.body;
  try {
    const Node = await models.AtomNode.findOne({ _id });
    const Atom = await models.Atom.findOne({ _id: atom_id });

    const newIds = Atom.nodes.filter((node_id) => node_id.toString() !== _id.toString());

    if (newIds.length) {
      Atom.nodes = newIds;
      await Atom.save();
    } else {      
      const Interview = await models.Interview.findOne({ _id: Atom.interview_id });
      const newAtomIds = Interview.content.atoms.filter(
        (atom_id) => atom_id.toString() !== Atom._id.toString()
      );
      Interview.content.atoms = newAtomIds;

      await Interview.save();
      await Atom.deleteOne();
    }

    await Node.deleteOne();
    res.status(200).send({ success: true });
  } catch (err) {
    console.log(err);
    res.status(500).send("error");
  }
};

exports.deleteNode = deleteNode;
