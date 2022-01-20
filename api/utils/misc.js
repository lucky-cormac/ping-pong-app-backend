const _ = require('lodash');

exports.userWithoutPassword = (user) => _.omit(user.toObject(), ['password']);
