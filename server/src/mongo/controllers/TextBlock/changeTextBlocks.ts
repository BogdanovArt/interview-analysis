import models from "mongo/model";

import { TextBlockType } from "mongo/schema/textBlock";
import { ForEach } from "utils";

import { Controller } from "../types";

export const changeTextBlocks: Controller = async ({ req, res }) => {
  const { blocks } = req.body;

  if (blocks?.length) {
    try {
      const changed: TextBlockType[] = [];

      await ForEach(blocks, async ({ _id, content, nodes }: TextBlockType) => {
        const TextBlock = await models.TextBlock.findOne({ _id });
        if (TextBlock) {
          TextBlock.nodes = nodes;
          TextBlock.content = content;
          const doc = await TextBlock.save();
          changed.push(doc);
        }
      });

      res.status(200).send(changed);
    } catch (error) {
      res.status(500).send(JSON.stringify(error));
    }
  } else {
    res.status(204).send([]);
  }
};
