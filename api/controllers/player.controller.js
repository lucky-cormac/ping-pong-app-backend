const mongoose = require('mongoose');
const httpStatus = require('http-status');
const PlayerModel = require('../models/player.model');
const { getRanksMap } = require('../helpers/rank.helper');
const APIError = require('../helpers/APIError');

exports.getPlayer = async (req, res, next) => {
  try {
    const player = await PlayerModel.findById(req.params.id);
    if (!player) {
      throw new APIError('Player not found.', httpStatus.NOT_FOUND, true);
    }
    const ranksMap = await getRanksMap();
    res.status(httpStatus.OK).json({
      player: ranksMap[player._id.toString()],
    });
  } catch (err) {
    next(err);
  }
};

exports.getPlayers = async (req, res, next) => {
  const { order, orderBy, page: pageStr, limit: limitStr } = req.query;
  let page = parseInt(pageStr, 10);
  let limit = parseInt(limitStr, 10);
  if (isNaN(page)) page = 0;
  if (isNaN(limit)) limit = 10;
  let playerQuery = PlayerModel.find()
    .skip(page * limit)
    .limit(limit);
  if ((order === 'asc' || order === 'desc') && orderBy) {
    playerQuery = playerQuery.sort({ [orderBy]: order });
  }

  try {
    const total = await PlayerModel.countDocuments();
    const players = await playerQuery;
    const ranksMap = await getRanksMap();
    const transformedPlayers = players.map(
      (player) => ranksMap[player._id.toString()],
    );
    res.status(httpStatus.OK).json({
      result: {
        players: transformedPlayers,
        total,
        page,
        limit,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.createPlayer = async (req, res, next) => {
  try {
    const player = await PlayerModel.create(req.body);
    res.status(httpStatus.CREATED).json({
      player: player.toObject(),
    });
  } catch (err) {
    next(err);
  }
};

exports.updatePlayer = async (req, res, next) => {
  try {
    const player = await PlayerModel.findOneAndUpdate(
      { _id: mongoose.Types.ObjectId(req.params.id) },
      req.body,
      { new: true },
    );
    res.status(httpStatus.OK).json({
      player: player.toObject(),
    });
  } catch (err) {
    next(err);
  }
};

exports.deletePlayer = async (req, res, next) => {
  try {
    await PlayerModel.deleteOne({
      _id: mongoose.Types.ObjectId(req.params.id),
    });
    res.status(httpStatus.OK).json({ deletedId: req.params.id });
  } catch (err) {
    next(err);
  }
};

exports.deletePlayers = async (req, res, next) => {
  const { selectedIds: deletedIds } = req.body;
  const ids = (deletedIds || []).map((id) => mongoose.Types.ObjectId(id));

  try {
    await PlayerModel.deleteMany({ _id: { $in: ids } });
    res.status(httpStatus.OK).json({ deletedIds });
  } catch (err) {
    next(err);
  }
};
