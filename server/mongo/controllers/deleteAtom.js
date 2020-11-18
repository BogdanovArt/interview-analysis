const deleteAtom = async ({ req, res, models }) => {

  const { _id, id } = req.body;
  try {
    const atom = await models.Atom.findOne({ _id });
    if (atom) {
      const lastBlock = atom.text_block_ids.length <= 1 && atom.text_block_ids[0] === id;
      if (lastBlock) {
        const deleted = await models.Atom.findOneAndDelete({ _id });
        const data = { ...deleted }._doc;
        data.deleted = true;
        res.status(200).send(data);
      } else {
        const match = atom.text_block_ids.findIndex(block => block === id);
        if (match > -1) atom.text_block_ids.splice(match, 1);
        await atom.save();
        res.status(200).send(atom);
      }
    } else {
      const data = { ...req.body, deleted: true }
      res.status(404).send(data);
    }    
  } catch (err) {
    console.log(err);
    res.status(500).send('error');
  }
}

exports.deleteAtom = deleteAtom;