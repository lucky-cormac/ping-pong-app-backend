const httpStatus = require('http-status');
const { getRanksMap } = require('../helpers/rank.helper');

exports.getRanks = async (req, res, next) => {
  const { page: pageStr, limit: limitStr } = req.query;
  let page = parseInt(pageStr, 10);
  let limit = parseInt(limitStr, 10);
  if (isNaN(page)) page = 0;
  if (isNaN(limit)) limit = 10;

  try {
    const ranksMap = await getRanksMap();
    const rankedPlayers = Object.values(ranksMap);
    const totalRanks = rankedPlayers.sort(
      (playerA, playerB) => playerA.rank - playerB.rank,
    );
    const total = totalRanks.length;
    const ranks = totalRanks.slice(page * limit, page * limit + limit);
    res.status(httpStatus.OK).json({
      result: { total, page, limit, ranks },
    });
  } catch (err) {
    next(err);
  }
};
