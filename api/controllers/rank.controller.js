const httpStatus = require('http-status');
const { getRanksMap } = require('../helpers/rank.helper');

exports.getRanks = async (req, res, next) => {
  try {
    const ranksMap = await getRanksMap();
    res.status(httpStatus.OK).json({ ranksMap });
  } catch (err) {
    next(err);
  }
};
