import models from "mongo/model";
import { AtomType } from "mongo/schema/atom";
import { AtomNodeType } from "mongo/schema/atomNode";

import { Controller } from "../types";

type ResponseData = {
  node: AtomNodeType;
  atom: AtomType | null;
  oldAtom: AtomType | null;
};

export const changeNode: Controller = async ({ req, res }) => {
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

    let Payload: ResponseData = {
      node: Node,
      atom: null,
      oldAtom: OldHostAtom,
    };

    // check if we need to change atom host;
    if (OldHostAtom?.atom_type !== atom_type || OldHostAtom?.content !== content) {
      // parameters changed - trying to find new host;
      const NewHostAtom = await models.Atom.findOne({
        atom_type,
        content,
        interview_id,
      });

      if (NewHostAtom) {
        // compatible host exists - add node as a child;
        NewHostAtom.nodes.push(_id);
        Node.atom_id = NewHostAtom._id;

        Payload.node = await Node.save();
        Payload.atom = await NewHostAtom.save();
      } else {
        // there is no compatible host - creating new one;
        const Interview = await models.Interview.findOne({ _id: interview_id });
        const NewAtom = new models.Atom({
          atom_type,
          content,
          interview_id,
          nodes: [_id],
        });

        Interview.atoms.push(NewAtom._id);
        Node.atom_id = NewAtom._id;

        await Interview.save();
        Payload.node = await Node.save();
        Payload.atom = await NewAtom.save();
      }

      const OldNodeIDs = OldHostAtom.nodes.filter((node_id) => {
        return node_id.toString() !== _id.toString();
      });

      // check if node was the last child of old host atom;
      if (OldNodeIDs.length) {
        OldHostAtom.nodes = OldNodeIDs;
        Payload.oldAtom = await OldHostAtom.save();
      } else {
        // if it was - remove the host atom;
        const Interview = await models.Interview.findOne({ _id: interview_id });
        const newAtomIds = Interview.atoms.filter((atom_id) => atom_id.toString() !== OldHostAtom._id.toString());
        Interview.atoms = newAtomIds;

        Payload.oldAtom = null;
        await Interview.save();
        await OldHostAtom.remove();
      }
      res.status(200).send({ success: true, data: Payload });
    }
    res.status(204).send({ success: true, data: Payload });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};
