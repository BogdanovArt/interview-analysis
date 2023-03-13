import models from "mongo/model";

import { Controller } from "../types";

export const getProjects: Controller = async ({ req, res }) => {
  const Projects = await models.Project.find({});
  res.status(200).send(JSON.stringify(Projects));
};
