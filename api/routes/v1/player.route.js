const express = require('express');
const {
  getPlayer,
  getPlayers,
  createPlayer,
  updatePlayer,
  deletePlayer,
  deletePlayers,
} = require('../../controllers/player.controller');

const router = express.Router();

router.route('/').get(getPlayers).post(createPlayer);

router.route('/deleteBatch').post(deletePlayers);

router.route('/:id').get(getPlayer).put(updatePlayer).delete(deletePlayer);

module.exports = router;
