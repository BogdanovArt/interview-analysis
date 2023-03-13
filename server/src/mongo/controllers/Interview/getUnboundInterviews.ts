import models from "mongo/model";

import { Controller } from "../types";

export const getUnboundInterviews: Controller = async ({ req, res }) => {
  const Interviews = await models.Interview.find({ project_id: null });
  res.status(200).send(JSON.stringify(Interviews));
};
