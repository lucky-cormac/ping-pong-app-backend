const express = require('express');
const { getRanks } = require('../../controllers/rank.controller');

const router = express.Router();

router.route('/').get(getRanks);

module.exports = router;
