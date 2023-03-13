import models from "mongo/model";

import { Controller } from "../types";

export const putProject: Controller = async ({ req, res }) => {
  const { title } = req.body;
  const Project = new models.Project({
    title,
  });

  try {
    const result = await Project.save();
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send(error);
  }
};
