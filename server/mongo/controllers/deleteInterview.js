const {ForEach} = require("../../utils");

// @TODO навести порядок в контроллерах

const clearTextBlockIds = (int_id, atom) => {
  return atom.text_block_ids.filter(id => {
    const ids = id.split('-');
    return ids[0] !== int_id.toString();
  });
};

const deleteInterviewById = async ({ _id, models }) => {
  const doc = await models.Interview.findOne({ _id }).populate('content.atoms');
  const atoms = doc.content.atoms;
  await ForEach(atoms, async (atom) => {
    const textBlocks = clearTextBlockIds(_id, atom);
    if (textBlocks.length) {
      atom.text_block_ids = textBlocks;
      await atom.save();
    } else {
      await atom.deleteOne();
    }
  });
  await doc.deleteOne();
}

const deleteInterview = async ({ req, res, models }) => {
  const { id } = req.body;
  try {
    await deleteInterviewById({ _id: id, models });
    res.status(200).send({ success: true });
  } catch(err) {
    res.status(500).send('error deleting document');
  }
}

exports.deleteInterviewById = deleteInterviewById;
exports.deleteInterview = deleteInterview;
