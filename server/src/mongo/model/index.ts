import Project from "mongo/schema/project";
import User from "mongo/schema/user";
import Interview from "mongo/schema/interview";
import TextBlock from "mongo/schema/textBlock";
import AtomNode from "mongo/schema/atomNode";
import Atom from "mongo/schema/atom";

const Models = {
  Interview,
  Project,
  TextBlock,
  AtomNode,
  Atom,
  User,
};

export type ModelsType = typeof Models;

export default Models;
