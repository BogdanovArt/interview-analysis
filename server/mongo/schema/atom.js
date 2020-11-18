module.exports = function(mongoose) {
  const Schema = mongoose.Schema;

  const AtomSchema = {
    atom_type: Number,
    content: String,
    created: { type: Date, default: Date.now() },
    interview_id: {
      type: Schema.Types.ObjectId,
      ref: 'Interview'
    },
    text_block_ids: [String]
  };

  const Atom = new Schema(AtomSchema);

  return {
    Atom,
    AtomSchema
  }
}

