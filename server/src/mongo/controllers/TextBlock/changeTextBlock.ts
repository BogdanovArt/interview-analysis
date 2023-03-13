import models from "mongo/model";

import { Controller } from "../types";

export const changeTextBlock: Controller = async ({ req, res }) => {
  const { content, nodes } = req.body;
  const { id } = req.params;

  try {
    const TextBlock = await models.TextBlock.findOne({ _id: id });
    if (content) TextBlock.content = content;
    if (nodes) TextBlock.nodes = nodes;
    const result = await TextBlock.save();
    if (result.isModified) {
      res.status(201).send({ success: true, ...result });
    } else {
      res.status(204).send();
    }
  } catch (error) {
    res.status(500).send(JSON.stringify(error));
  }
};
