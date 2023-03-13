module.exports = function(mongoose) {
  const schemas = require('../schema')(mongoose);
  return {
    Interview : mongoose.model('Interview', schemas.Interview, 'interviews'),
    Project: mongoose.model('Project', schemas.Project, 'projects'),
    Atom: mongoose.model('Atom', schemas.Atom, 'atoms'),
    User: mongoose.model('User', schemas.User, 'users'),
    AtomNode: mongoose.model('AtomNode', schemas.AtomNode, 'nodes'),
  }
}