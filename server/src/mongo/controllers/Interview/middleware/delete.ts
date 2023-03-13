import { HookSyncCallback, Schema } from "mongoose";

import models from "mongo/model";

import { InterviewType } from "mongo/schema/interview";
import { AtomType } from "mongo/schema/atom";

import { ForEach, Sleep } from "utils";
import { ID } from "utils/types";

export const beforeDelete: HookSyncCallback<InterviewType> = async function (next, done) {
  const Interview = this;

  try {
    const { blocks, atoms } = Interview;
    const nodes: ID[] = [];

    await models.TextBlock.deleteMany({ _id: { $in: blocks } });

    atoms.forEach((atom: AtomType) => {
      nodes.push(...(atom.nodes as ID[]));
      atom.remove();
    });

    await models.AtomNode.deleteMany({ _id: { $in: nodes } });

    // await Sleep(2000);
  } catch (error) {
    console.log(error);
  }
};
