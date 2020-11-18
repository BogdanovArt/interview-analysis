const putAtom = async ({ req, res, models }) => {
  try {
    let atom;
    const { atom_type, content, id } = req.body;
    let doppleGanger = await models.Atom.findOne({ atom_type, content });
    if (doppleGanger) {
      atom = doppleGanger;
      if (!atom.text_block_ids.find(el => el === id)) {
        atom.text_block_ids.push(id);
        await atom.save();
      }     
    } else {
      const newBody = { ...req.body };
      newBody.text_block_ids = [newBody.id];
      delete newBody.id;
      atom = new models.Atom(newBody);
      await atom.save();
    }    
    res.status(201).send({
      success: true,
      data: atom,
    });
  } catch(err) {
    console.log(err);
    res.status(500).send(err);
  }

}

exports.putAtom = putAtom;