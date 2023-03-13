import { TextBlockBase } from "mongo/schema/textBlock";
import models from "mongo/model";

import { Controller } from "../types";

export const putInterview: Controller = async ({ req, res }) => {
  const { project_id, source, respondent, title, interview_id } = req.body;

  try {
    const Interview = new models.Interview({
      title,
      project_id,
      respondent,
      blocks: [],
      atoms: [],
    });

    const blocks = source
      .map((text: string, index: number) => {
        const source = text.trim();
        if (source) {
          const blockRaw: TextBlockBase = {
            source,
            order: index + 1,
            content: source,
            interview_id: Interview._id,
            nodes: [],
          };
          return blockRaw;
        }
      })
      .filter((block: TextBlockBase) => !!block);

    const Project = await models.Project.findOne({ _id: project_id });
    Project.interviews.push(Interview._id);

    await Project.save();
    Interview.blocks = await models.TextBlock.insertMany(blocks);
    await Interview.save();

    // console.log(createdBlocks);

    res.status(201).send({ success: true, data: Interview });
  } catch (error) {
    res.status(500).send(error);
  }
};
