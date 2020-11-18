module.exports = function(mongoose) {
  const Schema = mongoose.Schema;

  const InterviewSchema = {
    title: String,
    user_id: { type: Schema.Types.ObjectId, ref: 'User' },
    project_id: { type: Schema.Types.ObjectId, ref: 'Project' },
    respondent: String,
    created: { type: Date },
    content: {
      blocks: [
        {
          id: Number,
          text: String
        }
      ],
      atoms: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Atom'
        }
      ]
    }
  };

  const Interview = new Schema(InterviewSchema);

  return {
    Interview,
    InterviewSchema
  }
}