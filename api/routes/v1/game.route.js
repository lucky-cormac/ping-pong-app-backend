const express = require('express');
const {
  getGame,
  getGames,
  createGame,
  updateGame,
  deleteGame,
  deleteGames,
} = require('../../controllers/game.controller');

const router = express.Router();

router.route('/').get(getGames).post(createGame);

router.route('/deleteBatch').post(deleteGames);

router.route('/:id').get(getGame).put(updateGame).delete(deleteGame);

module.exports = router;
