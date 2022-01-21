const httpStatus = require('http-status');
const { getRanksMap } = require('../helpers/rank.helper');

exports.getRanks = async (req, res, next) => {
  try {
    const { page: pageStr, limit: limitStr } = req.query;
    let page = parseInt(pageStr, 10);
    let limit = parseInt(limitStr, 10);
    if (isNaN(page)) page = 0;
    if (isNaN(limit)) limit = 10;

    const ranksMap = await getRanksMap();
    const rankedPlayers = Object.values(ranksMap);
    const ranks = rankedPlayers.sort(
      (playerA, playerB) => playerA.rank - playerB.rank,
    );
    res
      .status(httpStatus.OK)
      .json({ ranks: ranks.slice(page * limit, page * limit + limit) });
  } catch (err) {
    next(err);
  }
};
