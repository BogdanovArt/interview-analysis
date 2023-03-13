const putNode = async ({ req, res, models }) => {
  // controller for adding nodes !
  try {
    let payload = {
      atom: null,
      node: null,
    };

    const { atom_type, content, interview_id, DOM_id } = req.body;
    
    const AtomNode = new models.AtomNode({
      DOM_id,
      atom_id: null,
    });

    const AtomHost = await models.Atom.findOne({ atom_type, content, interview_id }); // look for compatible host

    if (AtomHost) {
      // add new node to compatible host
      AtomNode.atom_id = AtomHost._id;
      const nodeDoc = await AtomNode.save();

      AtomHost.nodes.push(nodeDoc._id);
      const atomDoc = await AtomHost.save();      

      payload.node = nodeDoc;
      payload.atom = atomDoc;
    } else {
      // create new host and add node      
      const Interview = await models.Interview.findOne({ _id: interview_id });
      const Atom = new models.Atom({
        atom_type,
        content,
        interview_id,
        nodes: [AtomNode._id],
      });

      Interview.content.atoms.push(Atom._id);      
      AtomNode.atom_id = Atom._id;

      await Interview.save();
      const atomDoc = await Atom.save();
      const nodeDoc = await AtomNode.save();

      payload.node = nodeDoc;
      payload.atom = atomDoc;
    }

    res.status(201).send({
      success: true,
      data: payload,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

exports.putNode = putNode;
