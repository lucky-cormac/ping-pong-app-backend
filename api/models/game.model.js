const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const GameSchema = new Schema(
  {
    player1: {
      type: Schema.Types.ObjectId,
      ref: 'player',
    },
    player2: {
      type: Schema.Types.ObjectId,
      ref: 'player',
    },
    player1Score: {
      type: Number,
      required: true,
    },
    player2Score: {
      type: Number,
      required: true,
    },
    gameAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true },
);

const GameModel = mongoose.model('game', GameSchema);

module.exports = GameModel;
