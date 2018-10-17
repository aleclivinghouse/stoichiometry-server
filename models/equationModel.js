const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const equationSchema = new mongoose.Schema({
  name: {type: String, required: true},
  molecules: [{type: mongoose.Schema.Types.ObjectId, ref: 'Molecule'}]
  // userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

equationSchema.set('timestamps', true);
equationSchema.set('toObject', {
  virtuals: true,     // include built-in virtual `id`
  transform: (doc, ret) => {
    delete ret._id; // delete `_id`
    delete ret.__v;
  }
});


module.exports = mongoose.model('Equation', equationSchema);
