import { ObjectId } from "mongoose";

import { Controller } from "../types";

import models from "mongo/model";
import { TextBlockType } from "mongo/schema/textBlock";

import { ForEach } from "utils/index";

export const resetInterview: Controller = async ({ req, res }) => {
  try {
    const Interview = await models.Interview.findOne({ _id: req.params.id }).populate("project_id").populate("blocks");

    const NodeIDs: ObjectId[] = [];
    const AtomIDs = Interview.atoms;

    await ForEach(Interview.blocks, async (block: TextBlockType) => {
      NodeIDs.push(...(block.nodes as ObjectId[]));
      block.content = block.source;
      block.nodes = [];
      await block.save();
    });

    await models.AtomNode.deleteMany({ _id: { $in: NodeIDs } });
    await models.Atom.deleteMany({ _id: { $in: AtomIDs } });

    Interview.atoms = [];
    await Interview.save();

    res.status(200).send(JSON.stringify(Interview));
  } catch (error) {
    res.status(500).send(error);
  }
};
