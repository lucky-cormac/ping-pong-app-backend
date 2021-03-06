const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const PlayerSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);
const PlayerModel = mongoose.model('player', PlayerSchema);

module.exports = PlayerModel;
