const pushId = async (model, id) => {
  if (!model.text_block_ids.find(textBlockId => textBlockId === id)) {
    model.text_block_ids.push(id);
    await model.save();
  }
}

const changeAtom = async ({ req, res, models }) => {
  const { _id, id, atom_type, content } = req.body;
  
  try {
    const atom = await models.Atom.findOne({ _id });
    const newHost = await models.Atom.findOne({ atom_type, content });

    const lastBlock = atom.text_block_ids.length <= 1 && atom.text_block_ids[0] === id;
    // old and new host being the same means that there's no changes to be applied
    const sameBlock = newHost && atom._id.toString() === newHost._id.toString();
    const PL = {
      new: null,
      old: null
    }
    if (lastBlock) {
      // last textBlock of current Atom host => Atom should be removed
      if (!sameBlock) {
        await models.Atom.findOneAndDelete({ _id });
      } else {
        PL.old = atom;
      }
    } else {
      // not the last textBlock => remove id from the host list of textBlocks
      const match = atom.text_block_ids.findIndex(block => block === id);
      if (match > -1) {
        atom.text_block_ids.splice(match, 1);
        await atom.save();
        PL.old = atom;
      }
    }

    if (!sameBlock) {
      if (newHost) {
        // there's compatible Atom to host changed textBlock
        await pushId(newHost, id);
        PL.new = newHost;
      } else { // no compatible atoms to host textBlock
        const body = {
          text_block_ids: [id],
          atom_type,
          content
        }
        const newerHost = new models.Atom(body);
        await newerHost.save();
        PL.new = newerHost;
      }
    }

    res.status(201).send(PL);
  } catch(err) {
    console.log(err);
    res.status(500).send('invalid id');
  }
}

exports.changeAtom = changeAtom;