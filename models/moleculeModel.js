// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');
//
// const moleculeSchema = new mongoose.Schema({
//   name: {type: String, required: true},
//   weight: {type: Number, default: 0}
// });
//
// moleculeSchema.set('timestamps', true);
// moleculeSchema.set('toObject', {
//   virtuals: true,     // include built-in virtual `id`
//   transform: (doc, ret) => {
//     delete ret._id; // delete `_id`
//     delete ret.__v;
//   }
// });
//
// module.exports = mongoose.model('Molecule', moleculeSchema);
