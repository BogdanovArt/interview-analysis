module.exports = function (mongoose) {
  const Types = {
    InterviewSchema: require("./interview")(mongoose).InterviewSchema,
    UserSchema: require("./user")(mongoose).UserSchema,
    ProjectSchema: require("./project")(mongoose).ProjectSchema,
    AtomSchema: require("./atom")(mongoose).AtomSchema,
    AtomNodeSchema: require("./node")(mongoose).AtomNodeSchema,
  };
  const Schemas = {
    Interview: require("./interview")(mongoose).Interview,
    User: require("./user")(mongoose).User,
    Project: require("./project")(mongoose).Project,
    Atom: require("./atom")(mongoose).Atom,
    AtomNode: require("./node")(mongoose).AtomNode,
  };
  return {
    ...Types,
    ...Schemas,
  };
};
