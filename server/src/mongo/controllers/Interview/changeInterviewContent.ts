import models from "mongo/model";

import { AtomType } from "mongo/schema/atom";
import { AtomNodeType } from "mongo/schema/atomNode";
import { TextBlockType } from "mongo/schema/textBlock";

import { nodeRemove } from "../Node/Services/nodeRemove";

import { ForEach } from "utils";
import { ID } from "utils/types";
import { Controller } from "../types";

export const changeInterviewContent: Controller = async ({ req, res }) => {
  try {
    const _id = req.params.id;
    const { blocks } = req.body;
    if (!blocks.length) {
      res.status(204).send([]);
    }

    const Interview = await models.Interview.findOne({ _id }).populate("blocks").populate("atoms");

    const initialBlockIDs: string[] = Interview.blocks.map((block: TextBlockType) => block._id.toString());
    const initialNodeIDs: string[] = [];

    Interview.atoms.forEach((atom: AtomType) => {
      atom.nodes.forEach((nodeID) => initialNodeIDs.push(nodeID.toString()));
    });

    const changedBlockIDs: string[] = [];
    const changedNodeIDs: string[] = [];
    const changed: TextBlockType[] = [];

    await ForEach(
      blocks,
      async ({ _id, content, nodes, order, interview_id, source }: TextBlockType, index: number) => {
        let TextBlock: TextBlockType | null;

        if (_id) {
          TextBlock = await models.TextBlock.findOne({ _id });
          TextBlock.nodes = nodes;
          TextBlock.source = source;
          TextBlock.content = content;
        } else {
          const prevOrder = blocks[index - 1]?.order || 1;
          const nextOrder = blocks[index + 1]?.order || index + 2;
          const newOrder = (prevOrder + nextOrder) / 2;

          TextBlock = await new models.TextBlock({
            source,
            content,
            nodes,
            order: newOrder,
            interview_id,
          });
        }

        TextBlock.content = TextBlock.content.replace(
          /data-block_id="([A-Za-z0-9]{24})"/g,
          `data-block_id="${TextBlock._id}"`
        );

        if (nodes.length) {
          const AtomNodes = await models.AtomNode.find({ _id: { $in: nodes } });
          AtomNodes.forEach((AtomNode: AtomNodeType) => {
            AtomNode.block_id = TextBlock._id;
            changedNodeIDs.push(AtomNode._id.toString());
            AtomNode.save();
          });
        }

        const doc = await TextBlock.save();
        changed.push(doc);
        changedBlockIDs.push(TextBlock._id.toString());
      }
    );

    const removedBlockIDs = initialBlockIDs.filter((initialBlockID) => !changedBlockIDs.includes(initialBlockID));
    await models.TextBlock.deleteMany({ _id: { $in: removedBlockIDs } });

    const removedNodeIDs = initialNodeIDs.filter((initialNodeID) => !changedNodeIDs.includes(initialNodeID));
    const changedAtoms = await nodeRemove(removedNodeIDs as any as ID[]);
    const atoms = await models.Atom.find({ interview_id: _id as any as ID });
    const nodes = await models.AtomNode.find();

    Interview.blocks = changedBlockIDs as any as ID[];
    Interview.atoms = atoms.map((atom) => atom._id.toString());
    
    await Interview.save();


    res.status(200).send({
      changed,
      interview_nodes: changedNodeIDs.length,
      total_nodes: nodes.length,
      total_atoms: atoms.length,
    });
  } catch (error) {
    res.status(500).send(JSON.stringify(error));
  }
};
