const express = require('express');
const passport = require('passport');
const authRoutes = require('./auth.route');
const playerRoutes = require('./player.route');
const gameRoutes = require('./game.route');
const rankRoutes = require('./rank.route');

const router = express.Router();

/**
 * API status
 */
router.get('/status', (req, res) => res.send('OK'));

/**
 * Auth
 */
router.use('/auth', authRoutes);

/**
 * Players
 */
router.use(
  '/players',
  passport.authenticate('jwt', { session: false }),
  playerRoutes,
);

/**
 * Games
 */
router.use(
  '/games',
  passport.authenticate('jwt', { session: false }),
  gameRoutes,
);

/**
 * Ranks
 */
router.use(
  '/ranks',
  passport.authenticate('jwt', { session: false }),
  rankRoutes,
);

module.exports = router;
