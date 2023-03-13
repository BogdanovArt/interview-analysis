import models from "mongo/model";

import { Controller } from "../types";

export const deleteInterview: Controller = async ({ req, res }) => {
  const { id } = req.body;

  try {
    const Interview = await models.Interview.findOne({ _id: id }).populate("blocks").populate("atoms");
    await Interview.remove();

    res.status(200).send({ success: true, data: { Interview } });
  } catch (err) {
    res.status(500).send(err.message);
  }
};
