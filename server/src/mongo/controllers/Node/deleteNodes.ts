import { nodeRemove } from "./Services/nodeRemove";

import { Controller } from "../types";
import { ID } from "utils/types";

export const deleteNodes: Controller = async ({ req, res }) => {
  try {
    const nodes: ID[] = req.body.nodes;

    const atoms = await nodeRemove(nodes);

    res.status(200).send({ atoms });
  } catch (error) {
    res.status(500).send(error);
  }
};
