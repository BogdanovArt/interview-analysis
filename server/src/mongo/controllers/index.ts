// const getInterviews = require('./getInterviews').getInterviews;
// const putInterview = require('./putInterview').putInterview;
// const changeInterview = require('./changeInterview').changeInterview;
// const changeProject = require('./changeProject').changeProject;
// const deleteInterview = require('./deleteInterview').deleteInterview;
// const getInterview = require('./getInterview').getInterview;
// const putNode = require('./putNode').putNode;
// const changeNode = require('./changeNode').changeNode;
// const deleteNode = require('./deleteNode').deleteNode;

import { getProjects } from "./Project/getProjects";
import { getProject } from "./Project/getProject";
import { putProject } from "./Project/putProject";
import { deleteProject } from "./Project/deleteProject";
import { changeProject } from "./Project/changeProject";

import { putInterview } from "./Interview/putInterview";
import { getUnboundInterviews } from "./Interview/getUnboundInterviews";
import { deleteInterview } from "./Interview/deleteInterview";
import { getInterview } from "./Interview/getInterview";
import { resetInterview } from "./Interview/resetInterview";
import { changeInterviewContent } from "./Interview/changeInterviewContent";
import { changeInterview } from "./Interview/changeInterview";

import { putNode } from "./Node/putNode";
import { changeNode } from "./Node/changeNode";
import { deleteNodes } from "./Node/deleteNodes";

import { changeTextBlock } from "./TextBlock/changeTextBlock";
import { changeTextBlocks } from "./TextBlock/changeTextBlocks";

export default {
  getProjects,
  getProject,
  putProject,
  deleteProject,
  changeProject,
  getUnboundInterviews,
  putInterview,
  deleteInterview,
  getInterview,
  resetInterview,
  changeInterview,
  changeInterviewContent,
  putNode,
  changeNode,
  deleteNodes,
  changeTextBlock,
  changeTextBlocks,
};
