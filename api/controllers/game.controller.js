const mongoose = require('mongoose');
const httpStatus = require('http-status');
const GameModel = require('../models/game.model');
const APIError = require('../helpers/APIError');

exports.getGame = async (req, res, next) => {
  try {
    const game = await GameModel.findById(req.params.id)
      .populate('player1')
      .populate('player2');
    if (!game) {
      throw new APIError('Game not found.', httpStatus.NOT_FOUND, true);
    }

    res.status(httpStatus.OK).json({
      game: game.toObject(),
    });
  } catch (err) {
    next(err);
  }
};

exports.getGames = async (req, res, next) => {
  const { order, orderBy, page: pageStr, limit: limitStr } = req.query;
  let page = parseInt(pageStr, 10);
  let limit = parseInt(limitStr, 10);
  if (isNaN(page)) page = 0;
  if (isNaN(limit)) limit = 10;
  let gameQuery = GameModel.find()
    .populate('player1')
    .populate('player2')
    .skip(page * limit)
    .limit(limit);

  if ((order === 'asc' || order === 'desc') && orderBy) {
    gameQuery = gameQuery.sort({ [orderBy]: order });
  }

  try {
    const total = await GameModel.countDocuments();
    const games = await gameQuery;
    const transformedGames = games.map((game) => game.toObject());
    res.status(httpStatus.OK).json({
      result: {
        games: transformedGames,
        total,
        page,
        limit,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.createGame = async (req, res, next) => {
  try {
    const game = await GameModel.create(req.body);
    res.status(httpStatus.CREATED).json({
      game: game.toObject(),
    });
  } catch (err) {
    next(err);
  }
};

exports.updateGame = async (req, res, next) => {
  try {
    const game = await GameModel.findOneAndUpdate(
      { _id: mongoose.Types.ObjectId(req.params.id) },
      req.body,
      { new: true },
    );
    res.status(httpStatus.OK).json({
      game: game.toObject(),
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteGame = async (req, res, next) => {
  try {
    await GameModel.deleteOne({
      _id: mongoose.Types.ObjectId(req.params.id),
    });
    res.status(httpStatus.OK).json({ deletedId: req.params.id });
  } catch (err) {
    next(err);
  }
};

exports.deleteGames = async (req, res, next) => {
  const { selectedIds: deletedIds } = req.body;
  const ids = (deletedIds || []).map((id) => mongoose.Types.ObjectId(id));

  try {
    await GameModel.deleteMany({ _id: { $in: ids } });
    res.status(httpStatus.OK).json({ deletedIds });
  } catch (err) {
    next(err);
  }
};
