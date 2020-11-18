const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.connect("mongodb://mongodb:27017/INTERVIEW");

const InterviewSchema = require('../mongo/schema').InterviewSchema;
// const models = require('../mongo/model');

// const newSchema = { ...InterviewSchema, ...{
//   date: { type: Date },
// }};

console.log(InterviewSchema);


// const interview = new Schema(schema);
// const Interview = mongoose.model('Interview', interview, 'interviews');

// models.Interview.find({}, function(err, entities) {
//     entities.forEach(interview => {
//       interview.created = undefined;
//       interview.save();
//       console.log(interview);
//     });
//     process.exit(1);
//   // doc.update({ date: 'SESS' }, function(err, ass) {
//   //   console.log(err, ass);
//   //   process.exit(1);
//   // });
//   // doc.date = 'succ';
//   // doc.markModified('date');
//   // doc.save(function(err, succ) {
//   //   console.log(err, succ);
//   //   process.exit(1);
//   // });
// })





