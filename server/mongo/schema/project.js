module.exports = function(mongoose) {
  const Schema = mongoose.Schema;

  const ProjectSchema = {
    name: { type: String || undefined, default: undefined },
    created: { type: Date, default: Date.now() },
    interviews: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Interview'
      }
    ],
    atoms: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Atom'
      }
    ]
  }

  const Project = new Schema(ProjectSchema);

  return {
    Project,
    ProjectSchema
  }
}

