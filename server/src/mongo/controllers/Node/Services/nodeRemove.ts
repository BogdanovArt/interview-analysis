import models from "mongo/model";
import { AtomType } from "mongo/schema/atom";

import { ForEach, RemoveOne } from "utils";
import { ID } from "utils/types";

import { AtomsChanged } from "../types";

export const nodeRemove = async (nodes: ID[]): Promise<AtomsChanged> => {
  const atoms: AtomsChanged = {};

  const AtomNodes = await models.AtomNode.find({ _id: { $in: nodes } }).populate("atom_id");
  await ForEach(AtomNodes, async (AtomNode) => {
    const Atom = AtomNode.atom_id as AtomType;
    RemoveOne(Atom.nodes as ID[], AtomNode._id);

    if (Atom.nodes.length) {
      await Atom.save();
      atoms[Atom._id] = Atom;
    } else {
      const Interview = await models.Interview.findOne({ _id: Atom.interview_id });
      RemoveOne(Interview.atoms as ID[], Atom._id);
      atoms[Atom._id] = null;
      await Atom.remove();
    }

    await AtomNode.remove();
  });

  return atoms;
};
