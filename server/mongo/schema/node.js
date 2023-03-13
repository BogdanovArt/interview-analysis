module.exports = function (mongoose) {
  const Schema = mongoose.Schema;

  const AtomNodeSchema = {
    DOM_id: String,
    created: { type: Date, default: Date.now() },
    atom_id: {
      type: Schema.Types.ObjectId,
      ref: "Atom",
    },
  };

  const AtomNode = new Schema(AtomNodeSchema);

  return {
    AtomNode,
    AtomNodeSchema,
  };
};
