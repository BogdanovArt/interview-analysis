import models from "mongo/model";

import { Controller } from "../types";

export const deleteProject: Controller = async ({ req, res }) => {
  const { id } = req.body;
  try {
    const project = await models.Project.findOne({ _id: id }).populate("interviews");
    await project.remove();

    res.status(200).send({ success: true });
  } catch (err) {
    console.log(err);
    res.status(500).send("error deleting project");
  }
};
