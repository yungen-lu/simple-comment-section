const { DateTimeResolver } = require('graphql-scalars');

function DateTime(parent, args, context) {
  return DateTimeResolver;
}

module.exports = {
  DateTime,
};
