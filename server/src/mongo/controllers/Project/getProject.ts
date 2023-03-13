import models from "mongo/model";

import { Controller } from "../types";

export const getProject: Controller = async ({ req, res }) => {
  const _id = req.params.id;
  const Project = await models.Project.findOne({
    _id,
  }).populate({ path: "interviews", populate: { path: "source" } });

  if (Project) {
    res.status(200).send(JSON.stringify(Project));
  } else {
    res.status(404).send("Project not found");
  }
};
