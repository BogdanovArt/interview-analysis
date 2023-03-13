const pushId = async (model, id) => {
  if (!model.text_block_ids.find((textBlockId) => textBlockId === id)) {
    model.text_block_ids.push(id);
    await model.save();
  }
};

const changeNode = async ({ req, res, models }) => {
  const {
    _id, // node id
    atom_id, // atom id
    atom_type, // new atom_type
    content, // atom content
    interview_id,
  } = req.body;

  try {
    const Node = await models.AtomNode.findOne({ _id });
    const OldHostAtom = await models.Atom.findOne({ _id: atom_id });

    let Payload = Node;

    if (
      OldHostAtom.atom_type !== atom_type ||
      OldHostAtom.content !== content
    ) {
      const NewHostAtom = await models.Atom.findOne({
        atom_type,
        content,
        interview_id,
      });

      if (NewHostAtom) {
        NewHostAtom.nodes.push(_id);
        Node.atom_id = NewHostAtom._id;

        Payload = await Node.save();
        await NewHostAtom.save();
      } else {
        const Interview = await models.Interview.findOne({ _id: interview_id });
        const NewAtom = new models.Atom({
          atom_type,
          content,
          interview_id,
          nodes: [_id],
        });

        Interview.content.atoms.push(NewAtom._id);
        Node.atom_id = NewAtom._id;

        Payload = await Node.save();
        await Interview.save();
        await NewAtom.save();
      }

      OldNodeIDs = OldHostAtom.nodes.filter((node_id) => {
        return node_id.toString() !== _id.toString();
      });

      if (OldNodeIDs.length) {
        OldHostAtom.nodes = OldNodeIDs;
        await OldHostAtom.save();
      } else {
        const Interview = await models.Interview.findOne({ _id: interview_id });
        const newAtomIds = Interview.content.atoms.filter(
          (atom_id) => atom_id.toString() !== OldHostAtom._id.toString()
        );
        Interview.content.atoms = newAtomIds;

        await Interview.save();
        await OldHostAtom.deleteOne();
      }
    }

    res.status(201).send({ success: true, data: Payload });
  } catch (err) {
    console.log(err);
    res.status(500).send("invalid id");
  }
};

exports.changeNode = changeNode;
