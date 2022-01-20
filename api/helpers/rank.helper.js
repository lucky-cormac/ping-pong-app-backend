const PlayerModel = require('../models/player.model');
const GameModel = require('../models/game.model');

exports.getRanksMap = async () => {
  const promises = [PlayerModel.find(), GameModel.find()];
  const [docPlayers, docGames] = await Promise.all(promises);
  const ranksMap = docGames.reduce(
    (acc, game) => ({
      ...acc,
      [game.player1.toString()]:
        (acc[game.player1.toString()] || 0) + game.player1Score,
      [game.player2.toString()]:
        (acc[game.player2.toString()] || 0) + game.player2Score,
    }),
    {},
  );
  const sortedScores = Object.values(ranksMap).sort(
    (scoreA, scoreB) => scoreB - scoreA,
  );
  docPlayers.forEach((player) => {
    const score = ranksMap[player._id.toString()] || 0;
    const foundIndex = sortedScores.indexOf(score);
    const rank = foundIndex === -1 ? sortedScores.length + 1 : foundIndex + 1;
    ranksMap[player._id.toString()] = {
      ...player.toObject(),
      score,
      rank,
    };
  });
  return ranksMap;
};
