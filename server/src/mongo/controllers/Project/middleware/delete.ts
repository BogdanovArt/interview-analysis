import { HookSyncCallback } from "mongoose";

import { ProjectType } from "mongo/schema/project";

import { ForEach, Sleep } from "utils";

export const beforeDelete: HookSyncCallback<ProjectType> = async function (next) {
  const project = this;

  await ForEach(project.interviews, async (interview) => {
    interview.project_id = null;
    await interview.save();
  });

  await Sleep(2000);
};
