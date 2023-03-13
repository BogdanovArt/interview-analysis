import { Controller } from "../types";

import models from "mongo/model";
import { AtomType } from "mongo/schema/atom";
import { AtomNodeType } from "mongo/schema/atomNode";

interface Payload {
  atom: AtomType | null;
  node: AtomNodeType | null;
}

export const putNode: Controller = async ({ req, res }) => {
  // controller for adding nodes !
  try {
    let payload: Payload = {
      atom: null,
      node: null,
    };

    const { atom_type, content, interview_id, DOM_id, block_id } = req.body;

    const AtomNode = new models.AtomNode({
      DOM_id,
      atom_id: null,
      block_id,
    });

    const AtomHost = await models.Atom.findOne({ atom_type, content, interview_id }); // look for compatible host

    if (AtomHost) {
      // add new node to compatible host
      AtomNode.atom_id = AtomHost._id;
      payload.node = await AtomNode.save();

      AtomHost.nodes.push(AtomNode._id);
      payload.atom = await AtomHost.save();
    } else {
      // create new host and add node
      const Interview = await models.Interview.findOne({ _id: interview_id });
      const Atom = new models.Atom({
        atom_type,
        content,
        interview_id,
        nodes: [AtomNode._id],
      });

      Interview.atoms.push(Atom._id);
      AtomNode.atom_id = Atom._id;

      await Interview.save();
      payload.atom = await Atom.save();
      payload.node = await AtomNode.save();
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
