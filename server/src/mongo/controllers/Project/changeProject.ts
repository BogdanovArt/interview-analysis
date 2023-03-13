import models from "mongo/model";

import { Controller } from "../types";

export const changeProject: Controller = async ({ req, res }) => {
  const { title } = req.body;
  const { id } = req.params;

  try {
    const result = await models.Project.updateOne({ _id: id }, { title });
    if (result.nModified) {
      res.status(201).send({ success: true, ...result });
    } else {
      res.status(204).send();
    }
  } catch (error) {
    res.status(500).send(JSON.stringify(error));
  }
};
