import { Controller } from "../types";

import models from "mongo/model";

export const getInterview: Controller = async ({ req, res }) => {
  const Interview = await models.Interview.findOne({ _id: req.params.id })
    .populate("project_id")
    .populate("atoms")
    .populate({ path: "blocks", populate: { path: "nodes" } });

  res.status(200).send(JSON.stringify(Interview));
};
